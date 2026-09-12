## Context

- A API (Fastify, repositório `../api-lexhub`) é a única dona do cookie
  `@lexhub-auth`:
  - `POST /agents/sessions` grava o cookie com `path: '/'`, `httpOnly`,
    `sameSite: 'lax'`, `secure` em produção, `domain: env.DOMAIN` e
    `maxAge` de 1 dia. O JWT tem `sub`, `role` e `exp` (`expiresIn: '1d'`).
  - `POST /agents/logout` apaga o cookie com `path: '/'` e
    `domain: env.DOMAIN`. Hoje a rota exige autenticação, então com o token
    expirado ela responde 401.
  - Todo erro da API vem como `{ message: string }`.
- O middleware atual (`src/middleware.ts`) tem estes problemas:
  - chama `jwtDecode` sem `try/catch`, e um cookie malformado vira erro
    500;
  - apaga o cookie expirado com `response.cookies.delete('@lexhub-auth')`,
    **sem domain**. Um cookie é identificado por nome + domain + path, então
    esse `Set-Cookie` não casa com o da API. O cookie da API continua lá, e
    o redirecionamento para `/` passa de novo pelo mesmo ramo, gerando
    `ERR_TOO_MANY_REDIRECTS`;
  - regrava o cookie a cada rota privada com `maxAge` de 1 dia. Isso
    renova a validade do cookie além do `exp` do JWT e, se
    `NEXT_PUBLIC_DOMAIN` for diferente do `DOMAIN` da API, cria um segundo
    cookie que o logout da API não apaga;
  - casa as rotas de administrador por caminho exato e tem
    `adminRoutes && ...` sempre verdadeiro.
- O `QueryClient` é um singleton de módulo (`src/lib/react-query.ts`).
  Várias queries usam `staleTime: Infinity`, entre elas `['profile']` na
  sidebar. Login e logout navegam com `router.replace`, sem recarregar a
  página.
- Dependência: esta change é construída sobre
  `upgrade-nextjs-security-patches` (Next `15.5.25`, sem migrar para
  `proxy.ts`). As APIs usadas (`NextResponse`, `ResponseCookies`,
  `request.cookies`) são as mesmas em `15.2.2` e `15.5.x`, então o código
  também compila na versão instalada hoje.

## Goals / Non-Goals

**Goals:**
- Sessão inválida nunca gera erro 500 nem loop de redirecionamento.
- O cookie da API é de fato removido quando a sessão fica inválida.
- O cookie dura exatamente o que a API definiu.
- Rotas de administrador são protegidas também nas subrotas.
- Nenhum dado de um usuário aparece para o próximo usuário da mesma aba.
- O logout nunca prende o usuário.

**Non-Goals:**
- Verificar a assinatura do JWT no frontend (ex.: com `jose`). A checagem
  de papel no middleware é só para a UI, e a API valida assinatura e papel
  em todo endpoint.
- Interceptor global de 401/403 no Axios (Fase 2, ver abaixo).
- Mudar a API ou o formato do cookie.
- Migrar para o Next 16 (`proxy.ts`).
- Mudar a queryKey de alguma query ou o `staleTime` das listagens (itens 2 e
  9 do tech-debt).

## Decisions

### 1. Uma função `getSession` que nunca lança exceção
O middleware decodifica o cookie numa função que devolve o payload ou
`null`:
- `jwtDecode` fica dentro de `try/catch`;
- `exp` precisa ser número e estar no futuro.

Um token sem `exp` é tratado como inválido, porque a API sempre emite `exp`.
Todo o fluxo depois disso usa só "tem sessão válida" ou "não tem". Isso
elimina o ramo especial de token expirado, que era a origem do loop.

Alternativa descartada: validar também `role` e `sub`. Um token sem `role`
válido já cai no caso "não é ADMIN" e a API rejeita o resto. Mais validação
aqui não protege nada.

### 2. Tabela de decisão do middleware, sem ciclo possível

| Sessão | Rota pública | Rota privada |
| --- | --- | --- |
| sem cookie | `next()` | redireciona para `/` |
| cookie inválido | `next()` + apaga cookie | redireciona para `/` + apaga cookie |
| válida | redireciona para `/dashboard` | `next()` (MEMBER em rota de admin → `/dashboard`) |

Não há ciclo:
- só se redireciona para `/` a partir de rota privada, e `/` é pública;
- só se redireciona para `/dashboard` com sessão válida, e `/dashboard` é
  privada e não é de administrador.

Mesmo que a remoção do cookie falhe (ex.: domínio mal configurado), `/`
abre o login em vez de redirecionar.

Os redirecionamentos limpam a querystring da rota de origem (`url.search =
''`), porque os destinos são páginas fixas. Antes, `/dashboard?x=1` virava
`/?x=1`.

### 3. Remoção do cookie: `cookies.set` com domain + header manual sem domain
```ts
response.cookies.set('@lexhub-auth', '', {
  path: '/',
  domain: env.NEXT_PUBLIC_DOMAIN,
  maxAge: 0,
})
response.headers.append('Set-Cookie', '@lexhub-auth=; Path=/; Max-Age=0')
```
- A primeira linha casa exatamente com o cookie da API (mesmo nome,
  domain e path).
- A segunda remove a variante sem domain (host-only), gravada por versões
  antigas do middleware ou em ambiente com `NEXT_PUBLIC_DOMAIN` diferente.

Por que a segunda linha é um header manual: o `ResponseCookies` do Next
guarda **um cookie por nome** (um `Map`), e cada `cookies.set` apaga e
regrava todos os `Set-Cookie` da resposta a partir desse `Map`. Duas
chamadas `cookies.set('@lexhub-auth', ...)` resultariam em um único
`Set-Cookie`. Por isso a variante sem domain é anexada direto nos headers e
precisa ser a **última** escrita de cookie da resposta. A função
`clearAuthCookie` encapsula as duas linhas, e o middleware não escreve
outros cookies depois dela.

O cookie só é apagado quando existia. Visitantes sem cookie não recebem
`Set-Cookie`.

### 4. Sem regravação do cookie
O bloco que regravava o cookie a cada navegação privada é removido. Quem
grava e apaga o cookie é a API; o middleware só o apaga quando a sessão é
inválida. Com isso, o cookie e o JWT expiram juntos, e não existe mais um
segundo cookie com outro domain.

### 5. Rotas por lista de strings e casamento por prefixo
- `adminRoutes = ['/agents', '/services-types']`, com
  `path === r || path.startsWith(`${r}/`)`. O `/` no fim evita que
  `/agentsx` case com `/agents`.
- As rotas públicas continuam com casamento exato: `/` por prefixo
  casaria com tudo.
- O objeto `{ path, whenAuthenticated }` é substituído por arrays de
  strings, porque o campo `whenAuthenticated` era sempre `'redirect'` nas
  rotas públicas e `'next'` só no `/services`, que sai da lista.

### 6. `src/auth.ts` com `try/catch`
`checkAdminStatus` e `getIsAgentAuthenticated` retornam `false` se o
`jwtDecode` falhar. Em condições normais o middleware já barrou o cookie
inválido antes do Server Component. É uma defesa em profundidade para o caso
de o middleware ser pulado ou de uma rota nova escapar do `matcher`. As
assinaturas não mudam (`boolean` e `string | false`), então os consumidores
(`(app)/layout.tsx`, `services/page.tsx` e `dashboard/page.tsx`) ficam
como estão.

### 7. `queryClient.clear()` no login e no logout
- **Chaves afetadas**: todas. `clear()` remove as queries e as mutations
  do cache, entre elas `['profile']`, `['services', ...]`,
  `['services-types', ...]`, `['service-types']`, `['agents', ...]` e
  `['metrics', ...]`. Não é preciso invalidar chaves específicas, porque
  tudo que está no cache pertence à sessão anterior.
- **Logout** (`logout-dialog.tsx`): a chamada à API fica num `try/catch`
  que ignora a falha. Em seguida, sempre: `queryClient.clear()` e
  `router.replace('/?logout=true')`.
  - O toast de sucesso só aparece quando a API confirmou o logout.
  - Na falha não há toast de erro. O caso mais comum de falha é 401 com o
    token expirado, em que a sessão já acabou. Um toast de erro nesse caso
    só confundiria.
  - A navegação passa pelo middleware, que apaga o cookie se ele estiver
    inválido.
- **Login** (`form-auth.tsx`): `queryClient.clear()` logo após o sucesso
  de `POST /agents/sessions` e antes do `router.replace('/dashboard')`.
  Assim um logout que falhou sem limpar o cache, ou outra aba que deixou
  dados, não vaza para a nova sessão.
- O `QueryClient` é obtido com `useQueryClient()`, no padrão dos demais
  componentes, em vez de importar o singleton.
- **Cache do roteador do Next.** Login e logout chamam também
  `router.refresh()` **depois** do `router.replace`. A ordem importa: a fila
  de ações do roteador descarta um `refresh` pendente quando chega uma
  navegação. Com `refresh()` antes, a limpeza nunca era aplicada (verificado
  no navegador).
  - O teste no navegador mostrou o problema: depois de o membro sair e o
    admin entrar na mesma aba, o `router.replace('/dashboard')` não fez
    nenhuma requisição e reaproveitou a árvore de `/dashboard` que tinha
    sido pré-carregada (prefetch dos links da sidebar) na sessão do membro.
    O nome aparecia certo, porque vem do React Query já limpo, mas o menu
    vinha sem o grupo "Administração".
  - O `router.refresh()` invalida o cache do roteador. As ações do roteador
    são processadas em fila, então o `replace` seguinte já não encontra
    entradas da sessão anterior.
  - Alternativa descartada: navegação completa (`window.location`). Também
    resolve, mas recarrega a página e perde os toasts de "Acesso concedido"
    e "Sessão encerrada".
- **Logout sem perfil.** Se `GET /agents/profile` falhar (ex.: `401` de
  funcionário inativado, com o contrato novo da API), o `NavUser` mostra um
  botão "Sair" no lugar do skeleton. Antes, o menu do usuário nunca
  aparecia e não havia como sair: `/` redireciona de volta para
  `/dashboard`, porque o JWT ainda decodifica.
- A querystring `?logout=true` é mantida como está. Nenhum componente a
  lê hoje.

### 8. `NEXT_PUBLIC_DOMAIN` igual ao `DOMAIN` da API
Um `Set-Cookie` só remove o cookie da API se o domain for idêntico, e o
navegador só aceita um `Domain=` que contenha o host do frontend. Por
isso, em cada ambiente, `NEXT_PUBLIC_DOMAIN` (frontend) precisa ter o mesmo
valor que `DOMAIN` (API): `localhost` em dev e o domínio configurado na API
em produção. Isso fica documentado no `.env.example` e no
`docs/architecture.md`.

O middleware lê o valor no servidor (`src/env`), a partir de
`process.env`. No navegador, `src/env` usa `window.location.hostname`, mas o
middleware não roda no navegador.

## Risks / Trade-offs

- **`NEXT_PUBLIC_DOMAIN` diferente do `DOMAIN` da API** → o cookie da API
  não é removido pelo middleware. Não há loop: `/` abre o login mesmo com
  cookie inválido (decisão 2). O login seguinte sobrescreve o cookie. →
  Mitigação: documentação e conferência no deploy (tarefa de verificação).
- **Token decodificável que a API rejeita** (ex.: assinatura inválida após
  troca do `JWT_SECRET`, ou funcionário removido) → o middleware considera
  a sessão válida, as queries falham e o logout recebe 401. O usuário volta
  para `/?logout=true`, e o middleware o manda de novo para `/dashboard`.
  → Com o contrato novo da API (change `harden-auth-and-error-contract`,
  implementada e ainda não publicada), o logout é público e sempre apaga o
  cookie. O botão "Sair" que aparece quando o perfil falha (decisão 7)
  também dá saída ao usuário. A Fase 2 só automatiza essa saída. Até o
  deploy da API, o contorno é apagar o cookie no navegador. Fica registrado
  no `docs/tech-debt.md`.
- **Falha de rede no logout com o token ainda válido** → o middleware vê o
  cookie válido em `/` e devolve o usuário para `/dashboard`, com o cache
  limpo. O estado exibido é verdadeiro (ele continua logado) e basta tentar
  de novo.
- **`clear()` com a área logada ainda montada** → entre o `clear()` e a
  troca de rota, algum componente pode recriar uma query e disparar uma
  requisição. Com o cookie já apagado pela API, a requisição falha sem
  efeito visível. Na Fase 2, uma resposta 401 desse tipo acionaria o
  interceptor, e a flag de "logout em andamento" precisa cobrir também o
  logout manual.
- **Header `Set-Cookie` manual sobrescrito** → se alguém adicionar um
  `response.cookies.set` depois de `clearAuthCookie`, a variante sem domain
  some da resposta. → Mitigação: comentário na função e na decisão 3.

## Migration Plan

1. Aplicar após (ou junto com) a change `upgrade-nextjs-security-patches`.
   Arquivar essa change primeiro, porque as duas alteram a spec
   `access-control` em requisitos diferentes.
2. Conferir `NEXT_PUBLIC_DOMAIN` = `DOMAIN` da API em cada ambiente antes do
   deploy.
3. Deploy normal (`pnpm build` + reinício do `next start`). Usuários com
   cookie antigo sem domain perdem esse cookie na próxima vez que a sessão
   ficar inválida. Nenhuma ação é necessária.
4. **Rollback**: reverter o commit. Não há mudança de dados nem de API.

## Fase 2 (fora desta change): interceptor de 401/403

Fica bloqueada até a API publicar este contrato:
- **401** somente para sessão inválida: sem token, token inválido ou
  expirado, funcionário inexistente ou **inativo**. Inativados passam a ser
  barrados na hora, não só no próximo login.
- **403** para falta de permissão:
  - não-admin em rota de admin;
  - concluir ou cancelar atendimento de outro funcionário sem ser admin
    (mesma regra do `canManage` do front).
- Os demais erros (400/404/409/422) continuam com `{ message }`.
- `POST /agents/logout` passa a ser pública e idempotente: sempre 200 e
  sempre apaga o cookie.

Plano para quando o contrato for publicado:
- **Interceptor de resposta em `src/lib/axios.ts`**, para 401 de qualquer
  endpoint, exceto `/agents/sessions` e `/agents/password/*`, onde 401/400
  é erro do formulário:
  - `queryClient.clear()`;
  - `POST /agents/logout`, ignorando falha;
  - `window.location.href = '/?session=expired'`.
- Uma flag de módulo garante um único logout para vários 401 simultâneos.
- Toast "Sua sessão expirou. Entre novamente." na tela de login quando
  houver `?session=expired`.
- **403**: toast de erro com o `message` da API, sem deslogar.
- O restante do tratamento (`err.response?.data.message` nos toasts)
  continua igual.

## Open Questions

- ~~Qual é o valor de `DOMAIN` da API em produção?~~ **Resolvido**:
  `oabma.org.br`. Em produção, `NEXT_PUBLIC_DOMAIN=oabma.org.br`.
- Os hosts de produção do frontend e da API não estão documentados nos
  repositórios. Os dois precisam ser `oabma.org.br` ou um subdomínio dele
  (ex.: `atende.oabma.org.br`). Caso contrário, o navegador rejeita o
  `Domain=oabma.org.br` e o middleware não enxerga nem apaga o cookie.
- **Escopo amplo do cookie** (decisão da API, fora desta change): com
  `Domain=oabma.org.br`, o `@lexhub-auth` é enviado a **todos** os
  subdomínios da seccional. Qualquer outro sistema em `*.oabma.org.br`
  recebe o JWT a cada requisição e pode sobrescrever o cookie (cookie
  tossing).
  - Mitigação, se os hosts permitirem: colocar o front e a API sob um
    subdomínio dedicado, como `atende.oabma.org.br` e
    `api.atende.oabma.org.br`.
  - Nesse caso, `DOMAIN` e `NEXT_PUBLIC_DOMAIN` passam a ser
    `atende.oabma.org.br`.
