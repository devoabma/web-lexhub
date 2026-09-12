## Why

O dashboard mostra só os totais de hoje, do mês e do ano e um gráfico mensal
que, até a última versão da API, somava todos os anos da base. A diretoria da
OAB-MA precisa acompanhar a evolução por ano, mês e dia, saber quais
advogados(as) mais procuram a Seccional e quais funcionários(as) mais atendem,
e levar esses números às reuniões em PDF. A API (`api-lexhub`, change
`dashboard-metrics-report`) já expõe tudo isso em `/metrics`; falta a tela.

## What Changes

- Novas funções em `src/api/dashboard/`, uma por rota: séries anual, mensal e
  diária, rankings de advogados e de funcionários e download do relatório.
- Seletor de período no dashboard (ano obrigatório, mês opcional; padrão: ano
  atual) guardado na URL (`?year=&month=`). Ele controla os gráficos e os
  rankings novos. Os 4 cards de totais continuam como estão e não dependem do
  período.
- Gráficos:
  - novo "Atendimentos por ano" (barras, todos os anos, com destaque no ano
    selecionado);
  - "Atendimentos por mês" passa a usar `GET /metrics/services/monthly?year=`
    e deixa de usar `GET /services/monthly` (depreciada na API);
  - novo "Atendimentos por dia" (barras) do mês selecionado ou, sem mês, do
    mês atual no ano selecionado.
- Card "Top 10 advogados(as) mais atendidos(as)" e card "Top 3
  funcionários(as) que mais atenderam", com percentual sobre o total do
  período, estado vazio e destaque para o funcionário logado.
- Botão "Gerar relatório (PDF)" no cabeçalho da página: diálogo com ano e mês
  opcional que baixa o PDF gerado pela API.
- Painéis novos exibem mensagem de erro quando a consulta falha, em vez de
  ficarem vazios.
- Refatoração: o cálculo de variação percentual duplicado nos 4 cards vai para
  `src/utils`, sem mudar o resultado (item "Código duplicado" do tech-debt).
- Remoção de `src/api/dashboard/get-services-month-for-chart.ts`, que fica sem
  uso.

Nenhuma mudança **BREAKING**. Muda um comportamento visível: o gráfico mensal
mostra o ano selecionado (padrão: ano atual), e não mais a soma de todos os
anos.

Esta change é **somente frontend**. A API já está pronta, mas as rotas
`/metrics` ainda não estão em produção. O frontend só pode ser publicado
depois do deploy da API.

## Capabilities

### New Capabilities

Nenhuma. As novidades ampliam `dashboard-metrics`.

### Modified Capabilities

- `dashboard-metrics`: seletor de período na URL; gráficos anual e diário;
  gráfico mensal por ano a partir de `/metrics/services/monthly`; rankings de
  advogados e de funcionários; relatório em PDF; estados de carregamento e de
  erro por painel.

## Impact

- **Código**: `src/app/(private)/(app)/dashboard/` (página e componentes
  novos), `src/api/dashboard/` (6 funções novas, 1 removida),
  `src/utils/` (variação percentual e download de arquivo).
- **API consumida**: `GET /metrics/services/yearly|monthly|daily`,
  `GET /metrics/lawyers/top`, `GET /metrics/agents/top` e
  `GET /metrics/report` (PDF com `Content-Disposition`, exposto pelo CORS).
  `GET /services/monthly` deixa de ser chamada.
- **Cache (React Query)**: chaves novas em `['metrics', ...]` com os
  parâmetros de período; nenhuma invalidação (dados só de leitura).
- **Dependências**: nenhuma nova (`recharts`, `date-fns`, `react-hook-form`,
  `zod` e `sonner` já estão no projeto).
- **Documentação**: `docs/api.md` (rotas `/metrics` e relatório),
  `docs/architecture.md` (tabela de queryKeys) e `docs/tech-debt.md` (variação
  percentual deixa de ser código duplicado).
- **Deploy**: publicar o frontend só depois do deploy da API em produção.
  Antes disso, os painéis novos mostram erro e o relatório falha.
