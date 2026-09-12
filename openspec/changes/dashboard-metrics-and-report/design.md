## Context

- O dashboard (`src/app/(private)/(app)/dashboard/`) tem 4 cards de totais
  (`MetricCard`) e o `ServiceChart`, um gráfico de linha sobre
  `GET /services/monthly`. Todos são Client Components com React Query e
  chaves em `['metrics', ...]`, sem invalidação.
- A API ganhou, na change `dashboard-metrics-report` do `api-lexhub`, as
  rotas `/metrics/services/yearly|monthly|daily`, `/metrics/lawyers/top`,
  `/metrics/agents/top` e `/metrics/report` (PDF). Todas exigem sessão,
  contam pela data de registro no horário do Maranhão (UTC-3) e aceitam
  `year` (2000–2100) e `month` (1–12), com `400 { message }` fora da faixa. O
  CORS expõe `Content-Disposition`. `GET /services/monthly` passou a contar só
  o ano atual e está depreciada.
- Sem `month`, `/metrics/services/daily` usa o mês atual do ano informado.
  Nos rankings, sem `year` e sem `month` a API considera todo o histórico.
- As listagens guardam os filtros na URL, com `useSearchParams` e
  `router.push('?...')`. O `sub` do JWT chega aos Client Components por prop,
  via `getIsAgentAuthenticated()` no Server Component, como no
  `EmployeeServicesCard`.
- O cálculo de variação percentual está copiado nos 4 cards.
- Em dev, o `axios.ts` adiciona 2 s a toda requisição.

## Goals / Non-Goals

**Goals:**
- Consumir as rotas `/metrics` com uma função por rota em `src/api/dashboard/`.
- Período (ano + mês opcional) na URL, controlando gráficos e rankings.
- Três gráficos (ano, mês, dia), dois rankings e o download do relatório.
- Estados de carregamento, vazio e erro por painel.
- Tirar a variação percentual duplicada para `src/utils` sem mudar o
  resultado.

**Non-Goals:**
- Mudar os 4 cards de totais ou fazê-los seguir o período.
- Opção "todo o histórico" nos rankings ou períodos arbitrários (de/até).
- Métricas por tipo de serviço, por forma de atendimento ou por funcionário.
- Restringir métricas ou relatório a administradores (a API libera para
  qualquer funcionário autenticado).
- Testes automatizados (o projeto não tem infraestrutura de testes).

## Decisions

### 1. Período lido da URL por um hook e aplicado na hora

`useDashboardPeriod()` lê `year` e `month` de `useSearchParams` e valida cada
um com zod (`safeParse`). Um valor inválido vale o padrão só naquele campo:
ano atual e sem mês. O seletor (`PeriodFilter`) grava a URL assim que um
select muda (`router.push('?...', { scroll: false })`), preservando os outros
parâmetros. "Ano inteiro" remove `month`.

- *Alternativa*: formulário com botão "Filtrar", como nas listagens.
  Descartada. São só dois selects, e num dashboard espera-se resposta
  imediata. Continua valendo o mesmo contrato: filtro na URL, restaurado ao
  recarregar.
- O seletor fica numa seção "Análise por período", abaixo dos 4 cards, e não
  no `PageHeader`. No cabeçalho ele daria a entender que os cards também
  mudam com o período. O cabeçalho recebe só o botão do relatório.

### 2. Opções de ano a partir da série anual

As opções de ano vêm de `GET /metrics/services/yearly`, que já vai do
primeiro ano com registros até o atual. A chave é a mesma do gráfico anual
(`['metrics', 'services-yearly']`), então é uma requisição só. A lista sempre
inclui o ano atual e o ano da URL, para o select ter valor enquanto a série
carrega ou se ela falhar. O diálogo do relatório usa as mesmas opções.

### 3. O frontend sempre envia o período completo

- Gráfico mensal: `year`.
- Gráfico diário: `year` e `month`. Sem mês no seletor, o frontend usa o mês
  atual (relógio do navegador), no ano selecionado. É o mesmo padrão da API,
  mas explícito, para que queryKey, requisição e rótulo ("Setembro de 2025")
  sempre casem.
- Rankings: `year` sempre e `month` quando houver. Como o seletor não tem
  "todo o histórico", os rankings nunca pedem o histórico inteiro.

### 4. Chaves do React Query

| queryKey | Função |
| --- | --- |
| `['metrics', 'services-yearly']` | `getServicesYearly` |
| `['metrics', 'services-monthly', year]` | `getServicesMonthly` |
| `['metrics', 'services-daily', year, month]` | `getServicesDaily` |
| `['metrics', 'top-lawyers', { year, month }]` | `getTopLawyers` (`limit: 10`) |
| `['metrics', 'top-agents', { year, month }]` | `getTopAgents` (`limit: 3`) |

`staleTime` padrão, como os cards. Os dados são só de leitura, então nada
precisa ser invalidado. A chave `['metrics', 'services-month-for-chart']`
deixa de existir. Trocar o período cria chaves novas: cada painel mostra seu
skeleton, e os períodos já vistos voltam do cache.

### 5. `DashboardPanel` e estilos de gráfico compartilhados

Um componente `DashboardPanel` (Card + título + descrição + ação opcional)
recebe `isLoading`, `isError` e a altura do conteúdo, e cuida do skeleton e
da mensagem de erro. Os 3 gráficos e os 2 rankings usam esse componente.
`chart-styles.ts` concentra as props de eixo, grade e tooltip com os tokens
do `ServiceChart` atual: `--chart-1`, `--border`, `--muted-foreground`,
`--popover` e `--brand-red` no ponto ativo.

- *Alternativa*: repetir a estrutura de Card do `ServiceChart` em cada painel.
  Descartada: seriam 5 cópias da lógica de loading e erro.
- Gráfico anual: todas as barras em `--chart-1`. As que não são do ano
  selecionado ficam com `fillOpacity` reduzido (mesma cor, sem depender de
  uma segunda cor para o destaque).
- Gráfico mensal: continua de linha, agora com `dataKey` `label`/`total`.
- Gráfico diário: barras, com o dia no eixo X e a data completa no tooltip.

### 6. Rankings como listas, não tabelas

Cada ranking é um `<ol>`: posição, nome, OAB em linha secundária (só
advogados), total e percentual alinhados à direita. Cabe em 400 px sem
esconder colunas.

- *Alternativa*: `<Table>` com colunas escondidas no mobile, como nas
  listagens. Descartada: em telas pequenas sumiriam OAB e percentual, que são
  obrigatórios.
- O percentual (`total / servicesInPeriod * 100`) usa uma casa decimal e
  ponto, o mesmo formato do `TrendBadge`. Com `servicesInPeriod = 0`, vale 0.
- O nome passa por `formatFullName`, como na listagem de atendimentos.
- O funcionário logado é comparado pelo `id` com o `sub` recebido por prop.
  O item dele ganha fundo `primary/5` e um badge "Você".

### 7. Download do relatório

- `downloadServicesReport({ year, month })` chama
  `API.get('/metrics/report', { params, responseType: 'blob' })` e devolve
  `{ file, fileName }`. O nome sai do `Content-Disposition` (`filename*=` ou
  `filename=`). Se o header não vier, usa
  `relatorio-atendimentos-<ano>[-<MM>].pdf`, o mesmo formato da API.
- `downloadFile(file, fileName)` (`src/utils`) cria a URL com
  `URL.createObjectURL`, clica num `<a download>` anexado ao `body`, remove o
  elemento e revoga a URL num `setTimeout`. Revogar no mesmo tick pode
  cancelar o download em alguns navegadores.
- Com `responseType: 'blob'`, o corpo do erro também chega como `Blob`. O
  toast usa `JSON.parse(await blob.text()).message`, com fallback genérico
  para corpo vazio, não-JSON ou falha de rede.
- `GenerateReport` guarda o `useMutation` e renderiza o botão do cabeçalho e
  o diálogo. Os dois mostram o spinner enquanto o PDF é gerado. Se o usuário
  fechar o diálogo nesse meio tempo, o download acontece do mesmo jeito. O
  formulário do diálogo (react-hook-form + zod) é resetado com o período da
  URL a cada abertura. Em caso de sucesso, o diálogo fecha e mostra um toast.

### 8. Variação percentual em `src/utils`

`calculateVariation(current, previous)` segue exatamente os ramos atuais
(`previous > 0` → razão; senão `current > 0` → 100; senão 0). Os 4 cards
passam a chamar essa função, sem mudar o resultado.

### 9. Remoção da chamada antiga

`src/api/dashboard/get-services-month-for-chart.ts` é removido. Nada mais
chama `GET /services/monthly`.

## Risks / Trade-offs

- [Publicar o frontend antes da API] → As rotas `/metrics` não existem em
  produção: os painéis novos mostrariam erro e o relatório falharia (o gráfico
  mensal também, já que deixa de usar a rota antiga). → Ordem de deploy
  registrada nas tarefas. O estado de erro por painel impede que o resto do
  dashboard quebre.
- [Retry padrão do React Query] → Uma consulta que falha tenta 3 vezes antes
  de mostrar o erro (alguns segundos a mais, somados ao atraso de 2 s do dev).
  → Aceito, é o mesmo comportamento dos cards atuais.
- [Relógio do navegador × UTC-3] → O ano e o mês "atuais" do frontend vêm do
  navegador, e a API conta no horário do Maranhão. → Os usuários estão no
  Maranhão. Fora do fuso, a diferença só aparece na virada de mês ou de ano,
  e o período é enviado explicitamente, então o que aparece na tela bate com
  o rótulo.
- [Percentuais do Top N somam menos de 100%] → É esperado (a base é o total do
  período). A descrição do card informa o total do período.
- [Mudança visível no gráfico mensal] → Deixa de somar todos os anos. É a
  correção desejada, registrada no proposal.

## Migration Plan

1. Implementar e testar contra a API local (`NEXT_PUBLIC_API_URL` apontando
   para ela).
2. Deploy da API (`api-lexhub`, change `dashboard-metrics-report`) em
   produção e conferência de `GET /metrics/services/yearly` com uma sessão
   válida.
3. Publicar o frontend.
4. Rollback: republicar a versão anterior do frontend. As rotas novas da API
   são aditivas, e `GET /services/monthly` continua existindo.

## Open Questions

- A diretoria vai querer o ranking de "todo o histórico"? A API já suporta
  (omitir `year` e `month`), mas o seletor desta change sempre tem ano.
