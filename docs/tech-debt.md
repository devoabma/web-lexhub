# Débitos técnicos e bugs conhecidos

Levantamento feito por leitura do código em 11/09/2026 (commit `84f639f`),
como ponto de partida para a atualização do sistema. Itens marcados como
**(a confirmar)** foram deduzidos do código e devem ser reproduzidos
manualmente antes da correção.

Resolvidos pela change `oab-visual-identity-responsive-shell`:
- layout sem versão mobile (antigo item 14);
- erro do campo "Confirmar senha" (antigo item 5);
- navegação duplicada no logout;
- import de `@/auth` num Client Component;
- `DialogTitle` importado direto do Radix;
- `td` com `flex`;
- classe `null` na linha de funcionário;
- mensagens de validação invisíveis (`FormMessage` com texto branco);
- botão de copiar sem fallback quando a permissão é negada.

Resolvidos pela change `fix-session-cookie-handling`:
- perfil da sidebar e listagens do usuário anterior após troca de conta na
  mesma aba (antigo item 3): o cache do React Query é descartado no login e
  no logout;
- erro 500 com cookie malformado no middleware e em `src/auth.ts` (parte do
  antigo item 4);
- `ERR_TOO_MANY_REDIRECTS` após a expiração do JWT: o cookie passa a ser
  apagado com o mesmo `domain` da API e não é mais regravado a cada
  navegação;
- logout com a sessão expirada prendia o usuário com um toast de erro;
- middleware com `adminRoutes && ...` sempre verdadeiro e rotas de
  administrador casadas por caminho exato.

Resolvidos pela change `upgrade-nextjs-security-patches`:
- Next.js 15.2.2 vulnerável ao bypass do middleware (CVE-2025-29927) e às
  demais falhas do audit (antigo item 1). O Next foi para `15.5.25` e o
  `axios` para `^1.20.0`. As transitivas (`lodash`, `nanoid`, `sharp`,
  `form-data`, `follow-redirects` e o `postcss` do Tailwind) subiram dentro
  dos ranges, sem overrides. O `pnpm audit` caiu de 81 para 4
  vulnerabilidades, todas do `postcss` fixado pelo Next (ver "Ferramentas e
  processo").

Sugestão: cada grupo abaixo pode virar uma change do OpenSpec
(`/opsx:propose "..."`).

## 🔴 Alta prioridade

### 2. Tipos de serviço novos/renomeados não aparecem no "Novo Atendimento"
- O dropdown usa a queryKey `['service-types']` com `staleTime: Infinity`
  ([new-service.tsx:128](<../src/app/(private)/(app)/services/components/new-service.tsx#L128>),
  [new-service-external.tsx:98](<../src/app/(private)/(app)/services/components/new-service-external.tsx#L98>)).
- Criar e editar tipo invalidam outra chave, `['services-types']`
  ([new-type.tsx:59](<../src/app/(private)/(app)/services-types/components/new-type.tsx#L59>),
  [update-type-dialog.tsx:97](<../src/app/(private)/(app)/services-types/components/update-type-dialog.tsx#L97>)).
- **Efeito**: o tipo só aparece para seleção depois de recarregar a página.
  Em compensação, criar um atendimento invalida `['service-types']` sem motivo
  ([new-service.tsx:154](<../src/app/(private)/(app)/services/components/new-service.tsx#L154>)).
- **Ação**: centralizar as queryKeys (ex.: `src/lib/query-keys.ts`) e
  invalidar ambas as listas nas mutações de tipo.

### 15. Sessão recusada pela API não encerra a sessão no frontend (aguarda a API)
- O middleware só decodifica o JWT. Um token que ele considera válido, mas
  que a API rejeita, deixa o usuário na área logada com as requisições
  falhando. Exemplos: assinatura inválida após troca do `JWT_SECRET`,
  funcionário removido ou inativado.
- Com a API atual, o logout também falha nesse caso, e o middleware devolve
  o usuário para `/dashboard`. Contorno: apagar o cookie `@lexhub-auth` no
  navegador.
- **Estado em 11/09/2026:** a change `harden-auth-and-error-contract` já
  está implementada e testada na API (repositório `api-lexhub`), mas **não
  foi publicada**. Depois do deploy dela:
  - o logout funciona sempre;
  - quando o perfil falha, a sidebar mostra um botão "Sair" (change
    `fix-session-cookie-handling`).

  Com isso, o usuário já consegue sair manualmente. Falta só o interceptor
  que faz isso sozinho.
- Um interceptor global de 401 no Axios resolveria o problema. Mas hoje a
  API responde 401 também a erros de negócio (advogado inadimplente, e-mail
  duplicado, registro não encontrado), e o interceptor deslogaria o usuário
  à toa.
- **Ação** (Fase 2 da change `fix-session-cookie-handling`, ver o
  `design.md` dela): quando a API publicar o novo contrato, adicionar em
  `src/lib/axios.ts` o interceptor de 401 → logout +
  `/?session=expired` e o toast de 403. O contrato novo:
  - 401 só para sessão inválida, inclusive funcionário inativo;
  - 403 para falta de permissão;
  - `POST /agents/logout` público e idempotente.

## 🟡 Média prioridade — bugs de UI e validação

| # | Problema | Local |
| --- | --- | --- |
| 6 | Formulário de atendimento externo não exibe **nenhum** erro de validação (OAB, nome, e-mail, forma, tipos): o `errors` é desestruturado e não usado. O usuário clica e nada acontece. | [new-service-external.tsx:180-219](<../src/app/(private)/(app)/services/components/new-service-external.tsx#L180-L219>) |
| 7 | Erro "Selecione pelo menos um tipo de serviço" não é exibido no Novo Atendimento. | [new-service.tsx](<../src/app/(private)/(app)/services/components/new-service.tsx>) |
| 8 | Filtros de tipos de serviço não são restaurados da URL ao recarregar (ao contrário de atendimentos/funcionários). | [types-table-filters.tsx:28](<../src/app/(private)/(app)/services-types/components/types-table-filters.tsx#L28>) |
| 9 | Listagem de atendimentos com `staleTime: Infinity`: atendimentos registrados por outros funcionários só aparecem após recarregar ou após uma mutação local. | [services-list.tsx](<../src/app/(private)/(app)/services/components/services-list.tsx>) |
| 10 | Cabeçalho "Realizado há"/"Finalizado há" muda para a página inteira conforme exista algum `OPEN`, mas cada linha usa uma data diferente. | [services-list.tsx:92](<../src/app/(private)/(app)/services/components/services-list.tsx#L92>) |
| 11 | Observação `null` aparece em branco no detalhe (só `''` mostra "Nenhuma observação adicionada"). | [service-details.tsx:203](<../src/app/(private)/(app)/services/components/service-details.tsx#L203>) |
| 12 | Campo oculto `id` validado como `cuid` (tipo) e `uuid` (funcionário): se o formato do backend mudar, "Salvar" falha silenciosamente, sem mensagem. | [update-type-dialog.tsx:33](<../src/app/(private)/(app)/services-types/components/update-type-dialog.tsx#L33>), [update-agent-dialog.tsx:40](<../src/app/(private)/(app)/agents/components/update-agent-dialog.tsx#L40>) |
| 13 | Senha provisória padrão `@102030@` fixa no código e exibida na tela. | [new-agent.tsx:54](<../src/app/(private)/(app)/agents/components/new-agent.tsx#L54>) |

## 🟢 Baixa prioridade — limpeza e padronização

- **Assinatura do JWT não verificada no frontend** (restante do antigo
  item 4): [middleware.ts](../src/middleware.ts) e
  [auth.ts](../src/auth.ts) usam `jwtDecode`, que só decodifica o token. Um
  cookie forjado com `role: 'ADMIN'` mostra telas e botões de administrador,
  mas nenhum dado, porque a API valida assinatura e papel em todo endpoint.
  Opcional: verificar a assinatura no middleware com `jose`, se o
  segredo/chave pública puder ser compartilhado com o frontend.
- **Imports não usados**: `Popover*` e `DialogClose` em
  `new-service-external.tsx` e `new-service.tsx`. `biome lint` passa limpo porque a regra
  `correctness/noUnusedImports` não está no preset recomendado — habilitá-la
  no `biome.json`.
- **Perfil buscado duas vezes** com chaves diferentes (`['profile']` no
  menu do usuário e `['metrics', 'get-profile']` no card do dashboard).
- **Estado duplicado** `selectedServiceTypes` espelhando o valor do campo
  `serviceTypeId` nos dois formulários de atendimento.
- **Código duplicado**: tipo `Service` redeclarado em `get-all.ts`,
  `service-table-row.tsx` e `service-details.tsx`; `getInitials` repetido em
  `service-details.tsx`, `agent-table-row.tsx` e `nav-user.tsx`. Candidatos a
  `src/utils/` e tipos compartilhados. (A variação percentual dos cards do
  dashboard já foi para `src/utils/calculate-variation.ts`.)
- **Paginação**: `perPage={10}` fixo nas três listagens precisa casar com o
  backend (há um `FIXME` em
  [pagination.tsx:26](../src/components/app/pagination.tsx#L26)).
- **Atraso artificial de 2 s** em todas as requisições no modo dev
  ([axios.ts:11](../src/lib/axios.ts#L11)) — útil para testar loaders, mas
  confunde quem não sabe.
- **Nome da função** `singIn` (typo de `signIn`) em `src/api/agents/sign-in.ts`.
- **Comentários `FIXME`** usados como marcadores de seção (não são pendências
  reais), o que polui buscas por pendências.
- **Dois estilos de import do Radix**: componentes shadcn antigos usam
  `@radix-ui/react-*`; os adicionados/regenerados na change de identidade
  visual (`sidebar`, `dropdown-menu`, `tooltip`, `sheet`, `button`,
  `separator`) usam o pacote unificado `radix-ui`, e o `drawer` usa `vaul`. Funciona, mas duplica
  parte do bundle — migrar os antigos ao regenerá-los.

## Ferramentas e processo

- `pnpm lint` roda `next lint`, mas o projeto usa **Biome**; falta um script
  `"check": "biome check ."` (e `biome.json` tem `vcs.enabled: false`).
- **Não há testes** (unitários ou e2e). Candidatos iniciais:
  `calculateDurationService`, `formatFullName`, cálculo de variação do
  dashboard e o middleware.
- `readme.md` é institucional; não explica setup — ver
  [architecture.md](./architecture.md#desenvolvimento).
- Dependências de março/2025 (React Query 5.68, Tailwind 4.0, zod 3.24,
  Biome 1.9): planejar atualização junto com a migração para o Next 16.
- **Risco aceito — `postcss@8.4.31`**: o Next 15.5 fixa essa versão exata no
  pipeline de CSS e o `pnpm audit` ainda aponta 4 avisos (2 altos) nela. Eles
  exigem CSS controlado por um atacante no build, e todo o CSS é do próprio
  repositório. Some no Next 16.
- **`next lint` deprecated** no Next 15.5 (`pnpm lint` mostra aviso e some no
  Next 16): trocar o script pelo Biome (ver o primeiro item desta seção).
- **Próxima migração: Next 16** — `src/middleware.ts` passa a se chamar
  `src/proxy.ts` (função `proxy`), o `next lint` deixa de existir e o build
  passa a usar Turbopack. Fica para uma change própria.
- `src/components/ui/alert.tsx` é o único arquivo com erro no
  `biome check` (ordem dos imports).
- **Fonte dos títulos**: Montserrat substitui a Gotham HTF do manual por
  licença; se a OAB-MA fornecer a Gotham para web, trocar em
  `src/app/layout.tsx` (`next/font/local`).
