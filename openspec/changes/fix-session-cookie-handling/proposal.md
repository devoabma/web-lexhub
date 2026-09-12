## Why

No dia seguinte ao login, o JWT do cookie `@lexhub-auth` expira e o usuário
cai em `ERR_TOO_MANY_REDIRECTS`. O middleware tenta apagar o cookie com
`cookies.delete` **sem** `domain`, mas a API grava o cookie com
`domain: DOMAIN`. O cookie da API sobrevive, e o middleware redireciona
`/` para `/` indefinidamente. Há outros problemas no mesmo fluxo:

- um cookie malformado faz o `jwtDecode` lançar exceção (erro 500);
- o middleware regrava o cookie a cada navegação privada, e o cookie passa
  a durar mais que o JWT;
- o logout com a sessão já expirada recebe 401 e deixa o usuário preso com
  um toast de erro;
- o cache do React Query sobrevive à troca de usuário na mesma aba (item 3
  do `docs/tech-debt.md`).

## What Changes

- **Sessão inválida no middleware**: cookie malformado, sem `exp` ou com
  JWT expirado passa a ser tratado como sessão inválida, sem exceção.
  - Em rota pública, a página abre normalmente e o cookie é apagado.
  - Em rota privada, há um único redirecionamento para `/`, que também
    apaga o cookie.
  - Nenhum caminho redireciona `/` para `/`.
- **Remoção correta do cookie**: o cookie é apagado com o mesmo `domain`
  (`NEXT_PUBLIC_DOMAIN`) e `path` (`/`) com que a API o grava. A variante
  sem `domain`, gravada por versões anteriores do middleware, também é
  apagada.
- **Fim da regravação do cookie** a cada navegação privada. A validade do
  cookie passa a ser só a definida pela API no login (1 dia).
- **Rotas de administrador por prefixo**: `/agents` e `/services-types`
  protegem também as subrotas (ex.: `/agents/123`). `/services` sai da
  lista de rotas de administrador, onde estava como no-op, e a condição
  `adminRoutes && ...`, sempre verdadeira, é removida.
- **`src/auth.ts` tolerante a cookie inválido**: `checkAdminStatus` e
  `getIsAgentAuthenticated` retornam `false` em vez de lançar exceção.
- **Cache limpo entre sessões**:
  - o logout descarta o cache e sai **mesmo se** `POST /agents/logout`
    falhar;
  - o login bem-sucedido descarta o cache antes de navegar.
- **Documentação**: `NEXT_PUBLIC_DOMAIN` precisa ser igual ao `DOMAIN` da
  API em cada ambiente (`.env.example` e `docs/`). Também são atualizados o
  `docs/tech-debt.md` (itens 3 e 4 e a nota de middleware) e o
  `docs/architecture.md`.
- Nenhuma mudança é **BREAKING** para o usuário. A checagem de papel pelo
  JWT continua só decodificando o token: serve apenas à UI, e a API valida
  assinatura e papel em todo endpoint.

Esta change é **somente frontend**. Ela é construída sobre a change
`upgrade-nextjs-security-patches` (Next `15.5.25`, arquivo
`src/middleware.ts`) e não depende de nenhuma mudança na API.

**Fora de escopo (Fase 2, change própria):** o interceptor global de
respostas 401 e 403 no Axios. Ele depende de um novo contrato da API: 401
somente para sessão inválida, 403 para falta de permissão e logout público
e idempotente. Hoje a API responde 401 também a erros de negócio (advogado
inadimplente, e-mail duplicado, registro não encontrado), e um interceptor
agora deslogaria o usuário sem motivo. O contrato está registrado no
`design.md`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `access-control`:
  - rotas públicas abrem mesmo com sessão inválida, apagando o cookie;
  - rotas privadas redirecionam uma única vez em sessão inválida, apagando
    o cookie;
  - as rotas de administrador passam a valer também para as subrotas.
- `authentication`:
  - a expiração da sessão passa a cobrir também o token malformado;
  - o requisito de renovação do cookie é removido;
  - login e logout passam a descartar o cache de dados;
  - a falha no logout deixa de prender o usuário.

## Impact

- **Código**:
  - `src/middleware.ts`;
  - `src/auth.ts`;
  - `src/components/app/shell/logout-dialog.tsx`;
  - `src/app/(public)/(auth)/(sign-in)/components/form-auth.tsx`.
- **React Query**: `queryClient.clear()` no login e no logout remove
  todas as chaves, entre elas `['profile']`, `['services', ...]`,
  `['agents', ...]`, `['services-types', ...]`, `['service-types']` e
  `['metrics', ...]`. Nenhuma queryKey muda de formato.
- **Configuração**: `NEXT_PUBLIC_DOMAIN` precisa estar definida com o
  mesmo valor do `DOMAIN` da API em cada ambiente. Se forem diferentes, o
  middleware não consegue apagar o cookie da API.
- **Documentação**:
  - `.env.example`;
  - `docs/architecture.md`;
  - `docs/tech-debt.md`.
- **API**: nenhuma alteração nesta fase.
