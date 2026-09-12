## Why

O frontend roda `next@15.2.2` e `axios@1.8.3`, versões de março/2025. O
`pnpm audit` de 11/09/2026 aponta **81 vulnerabilidades (5 críticas, 35
altas)**, entre elas a CVE-2025-29927, que permite pular o `middleware.ts` com o
header `x-middleware-subrequest`. Todo o controle de rotas e papéis do LexHub
depende desse middleware. Também há duas RCEs críticas no Next que só são
corrigidas a partir da `15.5.24`. Por isso não basta ir para a `15.2.3`, que
resolve só a CVE-2025-29927.

## What Changes

- Atualizar `next` de `15.2.2` para `15.5.25`, a última versão da linha 15
  (tag `backport`). Isso corrige a CVE-2025-29927 e todas as demais
  vulnerabilidades do Next no audit, entre elas: RCE no protocolo Flight do
  React, RCE no Image Optimization, bypass de middleware via segment-prefetch
  (CVE-2026-44575/45109), SSRF no redirect do middleware (CVE-2025-57822),
  DoS em Server Components e cache poisoning.
- Atualizar `axios` de `1.8.3` para `^1.20.0`. Isso corrige cerca de 30 avisos
  (prototype pollution, SSRF via NO_PROXY, DoS, vazamento de credenciais de
  proxy) e, de forma transitiva, `form-data` (CVE-2025-7783, crítica) e
  `follow-redirects`.
- Atualizar as dependências transitivas que aceitam versões corrigidas dentro
  do range já declarado: `lodash` (via `recharts`), `nanoid` e `sharp` (via
  `next`).
- Registrar como risco aceito o que sobrar no audit: o `postcss@8.4.31` fica
  fixado pelo próprio Next e é usado apenas em build.
- Adicionar ao controle de acesso o requisito explícito de que o middleware
  não pode ser contornado por headers internos do Next. O cenário serve como
  teste de regressão da CVE.
- Não há mudança de comportamento para o usuário final nem de API. Nenhuma
  mudança é **BREAKING**.

Esta change é **somente frontend**. O backend (API REST) não precisa de
alteração.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `access-control`: requisito novo que torna o controle de rotas resistente a
  bypass por headers internos do Next (`x-middleware-subrequest` e
  equivalentes). As regras de acesso existentes não mudam.

## Impact

- **Dependências**: `package.json` e `pnpm-lock.yaml` (`next`, `axios` e
  transitivas). `react`/`react-dom` continuam em `19.0.0`, compatível com o
  peer `^19.0.0` do Next 15.5.
- **Código**: nenhuma alteração esperada. `src/middleware.ts`,
  `src/lib/axios.ts` e as chamadas de `src/api/**` usam APIs estáveis entre as
  versões.
- **Ferramentas**: o Next 15.5 marca o `next lint` (script `pnpm lint`) como
  deprecated e mostra um aviso. A troca pelo Biome fica fora do escopo.
- **Deploy**: reinstalar dependências e fazer rebuild no servidor. O Node
  exigido continua `>=18.18` (ambiente de dev em Node 24).
- **Documentação**: remover o item 1 de `docs/tech-debt.md` e atualizar a
  versão do Next em `docs/architecture.md`.
- **Fora de escopo**: Next 16 (major com `middleware.ts` → `proxy.ts`), fica
  para uma change própria. Também ficam fora a atualização do React, a remoção
  da dependência não usada `cookies-next` e a verificação de assinatura do JWT
  (item 4 do tech-debt).
