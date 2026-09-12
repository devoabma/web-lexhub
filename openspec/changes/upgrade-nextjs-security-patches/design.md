## Context

- Versões atuais: `next@15.2.2`, `react`/`react-dom@19.0.0` e `axios@1.8.3`,
  todas de março/2025. O ambiente de dev usa Node 24.13.
- O `pnpm audit` de 11/09/2026 aponta 81 vulnerabilidades: 5 críticas, 35
  altas, 38 moderadas e 3 baixas. Por origem:
  - `next`: 37, sendo 4 críticas. As que exigem a versão mais alta pedem
    `>=15.5.24` (RCE no Image Optimization e RCE em servidor Windows).
  - `axios` e suas transitivas `form-data`/`follow-redirects`: cerca de 33.
    Pedem até `axios >=1.18.0`, e o `form-data` crítico pede `>=4.0.4`.
  - Via `next`: `postcss@8.4.31` (fixado exatamente pelo Next), `nanoid` e
    `sharp`.
  - Via `recharts`: `lodash@4.17.21`.
- O controle de acesso do LexHub no frontend fica todo em `src/middleware.ts`
  (ver spec `access-control`). O app usa `next/image` com import estático do
  logo, então o endpoint `/_next/image` fica ativo em produção.
- O ambiente de produção e a forma de deploy não estão documentados no
  repositório (ver Open Questions).

## Goals / Non-Goals

**Goals:**
- Zerar no `pnpm audit` as vulnerabilidades de `next`, `axios`, `form-data`,
  `follow-redirects`, `lodash`, `nanoid` e `sharp`.
- Manter comportamento idêntico para o usuário: nenhuma spec existente muda,
  só se acrescenta o requisito de resistência a bypass.
- Deixar um roteiro reproduzível de verificação da CVE-2025-29927, antes e
  depois da atualização.

**Non-Goals:**
- Migrar para o Next 16 (`middleware.ts` → `proxy.ts`, remoção do
  `next lint`, Turbopack no build).
- Atualizar `react`/`react-dom` (o peer `^19.0.0` do Next 15.5 aceita
  `19.0.0`; o App Router usa o React embutido no próprio Next).
- Trocar `pnpm lint` (`next lint`, agora deprecated) pelo Biome.
- Remover a dependência não usada `cookies-next`.
- Verificar a assinatura do JWT no middleware e tratar cookie malformado
  (itens do `docs/tech-debt.md`).
- Nenhuma queryKey do React Query nem nenhum componente é alterado.

## Decisions

### 1. Next `15.5.25` em vez de `15.2.3` ou `16.x`
- **`15.2.3`**: corrige só a CVE-2025-29927. As 2 RCEs críticas e o bypass
  por segment-prefetch continuam (exigem `>=15.5.18` e `>=15.5.24`).
  Descartada.
- **`16.3.4`** (latest): corrige tudo, mas é major, com breaking changes que
  atingem justamente o arquivo sensível (`middleware.ts` → `proxy.ts`).
  Misturar a correção de segurança com a migração aumenta o risco e atrasa
  a correção. Adiada para uma change própria.
- **`15.5.25`** (tag `backport`): é a última da linha 15, cobre todas as
  faixas corrigidas do audit e mantém as mesmas APIs usadas pelo app
  (`middleware`, `cookies()`, `searchParams` assíncrono, `next/font`,
  `next/image`). **Escolhida.** A versão fica fixada exata (`"15.5.25"`),
  como hoje, para o deploy ser previsível.

### 2. Axios `^1.20.0`
A API usada (`axios.create`, `get/post/put/patch/delete`, `params`,
`interceptors.request`, `isAxiosError`, `withCredentials`) é estável em toda
a linha 1.x. A `1.20.0` puxa `form-data ^4.0.6` e `follow-redirects
^1.16.0`, o que resolve as transitivas sem override.

Ponto de atenção: os filtros enviam `null` quando a opção é "Todos" (`ALL`).
O Axios omite parâmetros `null`/`undefined` na querystring. É preciso
confirmar que isso continua igual (tarefa de smoke test).

### 3. Transitivas: atualizar dentro do range antes de usar override
`lodash` (`recharts` pede `^4.17.21`), `nanoid` (`postcss` pede `^3.3.6`) e
`sharp` (o Next pede `^0.34.3 || ^0.35.4`) aceitam as versões corrigidas
dentro do range já declarado. Primeiro basta atualizar o lockfile para essas
transitivas. Só se o lockfile não subir é que se adiciona `pnpm.overrides`
com ranges seletivos (ex.: `"lodash@<4.18.0": "^4.18.1"`). Assim o
`package.json` fica sem overrides desnecessários.

### 4. `postcss@8.4.31` do Next: aceitar o risco residual
O Next fixa o `postcss` na versão exata `8.4.31`. As vulnerabilidades
restantes (leitura de arquivo via `sourceMappingURL`, XSS no stringify)
exigem CSS controlado por um atacante no momento do build. Aqui todo o CSS
é do próprio repositório. Um override de `next>postcss` foi descartado
porque troca uma dependência que o Next fixa de propósito no pipeline de CSS
dele. O risco residual fica registrado em `docs/tech-debt.md` e deixa de
existir no Next 16.

### 5. Verificação com servidor de produção local
A CVE-2025-29927 só se manifesta com `next start`. A verificação roda
`pnpm build && pnpm start` e faz `curl` com o header forjado, antes da
atualização (para confirmar a falha) e depois (para confirmar a correção).
O teste só é feito contra o próprio app em `localhost`.

## Risks / Trade-offs

- **Build do Next 15.5 com validação de tipos mais rígida** (tipos de rota
  gerados, `next-env.d.ts` regenerado) → rodar `pnpm build` localmente
  primeiro; os `page.tsx` já usam `searchParams: Promise<...>` no padrão do
  15. Versionar o `next-env.d.ts` regenerado.
- **Mudança sutil no middleware entre 15.2 e 15.5** (ordem de cookies,
  normalização de caminho) → smoke test manual de todos os cenários da spec
  `access-control`, com usuário ADMIN, MEMBER e sem sessão.
- **Mudança de serialização no Axios** (params `null`, cabeçalhos,
  `withCredentials`) → testar login, filtros com "Todos" e uma mutação por
  módulo.
- **`pnpm lint` passa a mostrar aviso de deprecated** → aceito e documentado.
  A troca pelo Biome vem em outra change.
- **Risco residual do `postcss`** → aceito, conforme a decisão 4.

## Migration Plan

1. Criar uma branch a partir da `main`.
2. Atualizar as dependências, rodar build e fazer os testes (ver `tasks.md`).
3. Deploy: `pnpm install --frozen-lockfile` e `pnpm build` no servidor, depois
   reiniciar o processo do `next start`.
4. **Rollback**: reverter o commit (volta o `package.json` e o
   `pnpm-lock.yaml`), reinstalar e fazer rebuild. Não há migração de dados nem
   mudança de API, então o rollback é imediato.

## Open Questions

- **Onde e como o frontend roda em produção?** (servidor Linux ou Windows,
  `next start` direto, PM2, Docker, proxy reverso). Isso define a urgência:
  a RCE CVE-2026-75604 afeta servidores Windows, e a CVE-2025-29927 afeta
  qualquer `next start` self-hosted. Se houver proxy reverso, dá para
  bloquear o header `x-middleware-subrequest` na borda como mitigação
  imediata, antes do deploy.
- **O backend valida o papel (`ADMIN`) em cada endpoint administrativo?** Se
  sim, o impacto de qualquer bypass do middleware se limita a expor telas sem
  dados. Vale confirmar com quem mantém a API.
