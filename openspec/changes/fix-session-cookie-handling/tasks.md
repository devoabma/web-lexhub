## 1. Middleware: sessão robusta, sem loop

- [x] 1.1 Em `src/middleware.ts`, criar `getSession(token)`: `jwtDecode` em `try/catch`, retornando `null` para token malformado, sem `exp` numérico ou expirado (design, decisão 1)
- [x] 1.2 Criar `clearAuthCookie(response)`: `response.cookies.set('@lexhub-auth', '', { path: '/', domain: env.NEXT_PUBLIC_DOMAIN, maxAge: 0 })` seguido de `response.headers.append('Set-Cookie', '@lexhub-auth=; Path=/; Max-Age=0')` para a variante sem domain, com comentário explicando por que o header manual precisa ser a última escrita (decisão 3)
- [x] 1.3 Reescrever o fluxo conforme a tabela da decisão 2: sessão inválida em rota pública → `NextResponse.next()` + apagar cookie; em rota privada → redirecionar para `/` + apagar cookie; só apagar quando o cookie existia
- [x] 1.4 Remover o bloco que regrava o cookie a cada navegação privada (decisão 4)
- [x] 1.5 Trocar `publicRoutes`/`adminRoutes` por arrays de strings; `adminRoutes = ['/agents', '/services-types']` com casamento por prefixo (`path === r || path.startsWith(`${r}/`)`); remover `/services` e o `adminRoutes &&` (decisão 5)
- [x] 1.6 Manter a checagem de papel pelo JWT (MEMBER em rota de admin → `/dashboard`) e o `matcher` atual

## 2. Helpers de Server Components

- [x] 2.1 Em `src/auth.ts`, envolver o `jwtDecode` de `checkAdminStatus` e de `getIsAgentAuthenticated` em `try/catch`, retornando `false` na falha (decisão 6)

## 3. Limpeza de estado entre sessões

- [x] 3.1 Em `src/components/app/shell/logout-dialog.tsx`, ignorar a falha de `POST /agents/logout`, e sempre chamar `queryClient.clear()` e `router.replace('/?logout=true')`. Toast de sucesso só quando a API confirmar; sem toast de erro (decisão 7)
- [x] 3.2 Em `src/app/(public)/(auth)/(sign-in)/components/form-auth.tsx`, chamar `queryClient.clear()` após o login bem-sucedido e antes do `router.replace('/dashboard')`
- [x] 3.3 Chamar `router.refresh()` **depois** do `router.replace` no login e no logout, para descartar o cache do roteador do Next. O teste no navegador mostrou o menu do usuário anterior depois da troca de conta; com o `refresh` antes do `replace`, a navegação o descarta (design, decisão 7)
- [x] 3.4 `src/components/app/shell/nav-user.tsx`: com erro no perfil, mostrar o botão "Sair" (abre o `LogoutDialog`) no lugar do skeleton

## 4. Documentação

- [x] 4.1 `.env.example`: comentário dizendo que `NEXT_PUBLIC_DOMAIN` precisa ser igual ao `DOMAIN` da API em cada ambiente
- [x] 4.2 `docs/architecture.md`: atualizar a seção "Autenticação e sessão" (sessão inválida, sem regravação, rotas de admin por prefixo, logout que não bloqueia, `clear()` no login), a tabela de variáveis de ambiente (`NEXT_PUBLIC_DOMAIN` = `DOMAIN` da API) e a linha `['profile']` da tabela de cache
- [x] 4.3 `docs/tech-debt.md`:
  - remover o item 3 e registrá-lo como resolvido por esta change;
  - reduzir o item 4 ao que sobra (checagem de papel só cosmética; `jose` opcional);
  - remover a nota "Middleware" de "Baixa prioridade";
  - registrar a Fase 2 (interceptor 401/403 aguardando o contrato da API) e o caso de token decodificável rejeitado pela API.

## 5. Verificação

- [x] 5.1 Rodar `pnpm biome check` nos arquivos alterados, sem erros novos
- [x] 5.2 Rodar `pnpm build` com sucesso
- [x] 5.3 Testar com `pnpm build && pnpm start`, via `curl`, os cenários de middleware:
  - cookie com lixo em `/` → 200 com `Set-Cookie` de remoção (com e sem `Domain`);
  - JWT expirado em `/dashboard` → um único 307 para `/`, removendo o cookie;
  - JWT expirado em `/` → 200, sem redirect;
  - MEMBER em `/agents` e `/agents/qualquer-coisa` → 307 para `/dashboard`;
  - MEMBER em `/services` → 200;
  - sem cookie em `/dashboard` → 307 para `/`, sem `Set-Cookie`.
- [x] 5.4 Teste no navegador, com a API rodando. Foi automatizado com Chrome headless (puppeteer), com front de produção e API do contrato novo; os 27 cenários passaram. Os casos abaixo continuam valendo como roteiro manual (DevTools > Application > Cookies):
  - cookie `@lexhub-auth` com valor lixo → `/` abre o login, sem erro 500;
  - JWT expirado em `/dashboard` → um redirect, cookie removido, sem loop; em `/`, o login abre direto;
  - MEMBER em `/agents` ou `/agents/qualquer-coisa` → `/dashboard`;
  - logout e depois login com outro usuário na mesma aba → a sidebar mostra o usuário novo;
  - logout com o JWT expirado → vai para o login, sem toast de erro.
