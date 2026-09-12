## MODIFIED Requirements

### Requirement: Gráfico mensal de atendimentos
O sistema MUST exibir um gráfico de linha "Atendimentos por mês" com os 12
meses do ano selecionado no seletor de período, usando
`GET /metrics/services/monthly?year=`, com o campo `label` no eixo X e `total`
no eixo Y. A descrição do gráfico MUST informar o ano e o total de
atendimentos dele. O sistema MUST NOT chamar `GET /services/monthly`
(depreciada na API).

#### Scenario: Ano selecionado
- **WHEN** o seletor de período está em 2025
- **THEN** o gráfico mostra os 12 meses de "Jan" a "Dez" de 2025 e a descrição informa o total de 2025

#### Scenario: Ano sem atendimentos em alguns meses
- **WHEN** a API retorna `total = 0` para os meses de outubro a dezembro do ano atual
- **THEN** esses meses aparecem no gráfico com valor zero

#### Scenario: Dados carregando
- **WHEN** a consulta do gráfico ainda está em andamento
- **THEN** um skeleton com a altura do gráfico é exibido no lugar dele

### Requirement: Estados de carregamento
Cada card de totais e cada painel de gráfico ou ranking MUST exibir skeletons
independentes enquanto sua consulta está em andamento, sem bloquear os demais.

#### Scenario: Consultas com tempos diferentes
- **WHEN** o total anual já carregou e o total diário ainda não
- **THEN** o card anual exibe os valores e o card de total exibe skeleton apenas na área de hoje/ontem

#### Scenario: Troca de período
- **WHEN** o usuário troca o período e o ranking de advogados ainda está carregando
- **THEN** só os painéis que dependem do período exibem skeleton e os 4 cards de totais continuam com seus valores

## ADDED Requirements

### Requirement: Seletor de período
O sistema MUST exibir no dashboard um seletor de período com ano
(obrigatório) e mês (opcional, opção "Ano inteiro"). O padrão MUST ser o ano
atual, sem mês. O período MUST ser guardado na URL (`year` e `month` nos
searchParams) e restaurado ao recarregar a página. Ele MUST controlar os
gráficos e os rankings; os 4 cards de totais MUST NOT depender dele. As
opções de ano MUST ir do primeiro ano com atendimentos até o ano atual. Um
`year` fora de 2000–2100 ou um `month` fora de 1–12 na URL MUST ser ignorado,
valendo o padrão para aquele campo.

#### Scenario: Abertura sem parâmetros
- **WHEN** o usuário abre `/dashboard` sem `year` nem `month` em 2026
- **THEN** o seletor mostra 2026 e "Ano inteiro", e os gráficos e rankings consultam 2026

#### Scenario: Período restaurado da URL
- **WHEN** o usuário abre `/dashboard?year=2025&month=3`
- **THEN** o seletor mostra 2025 e "Março", os painéis mostram esse período e, ao recarregar a página, o período se mantém

#### Scenario: Troca de período
- **WHEN** o usuário escolhe "Março" no seletor com o ano 2025
- **THEN** a URL passa a ter `year=2025&month=3` e os gráficos e rankings são atualizados, sem recarregar os 4 cards de totais

#### Scenario: Parâmetros inválidos na URL
- **WHEN** o usuário abre `/dashboard?year=1990&month=13` em 2026
- **THEN** o dashboard usa 2026 e "Ano inteiro"

### Requirement: Gráfico anual de atendimentos
O sistema MUST exibir um gráfico de barras "Atendimentos por ano" com todos
os anos retornados por `GET /metrics/services/yearly`, do primeiro ano com
atendimentos até o atual, incluindo anos sem registro com valor zero. A barra
do ano selecionado no seletor MUST aparecer destacada.

#### Scenario: Série com ano vazio
- **WHEN** a API retorna 2024 com 120, 2025 com 0 e 2026 com 300, e o seletor está em 2026
- **THEN** o gráfico mostra três barras, 2025 com zero, e a barra de 2026 destacada

### Requirement: Gráfico diário de atendimentos
O sistema MUST exibir um gráfico de barras "Atendimentos por dia" com todos
os dias do mês consultado em `GET /metrics/services/daily?year=&month=`. O mês
consultado MUST ser o mês selecionado ou, se o seletor estiver em "Ano
inteiro", o mês atual dentro do ano selecionado. A descrição MUST informar o
mês, o ano e o total do mês.

#### Scenario: Mês selecionado
- **WHEN** o seletor está em fevereiro de 2026
- **THEN** o gráfico mostra 28 barras e a descrição informa "Fevereiro de 2026" com o total do mês

#### Scenario: Só o ano selecionado
- **WHEN** hoje é 11/09/2026 e o seletor está em 2025, "Ano inteiro"
- **THEN** o gráfico mostra os 30 dias de setembro de 2025

### Requirement: Ranking de advogados(as) mais atendidos(as)
O sistema MUST exibir o card "Top 10 advogados(as) mais atendidos(as)" com o
resultado de `GET /metrics/lawyers/top` (`limit=10`) para o período
selecionado, na ordem recebida da API. Cada item MUST mostrar a posição, o
nome, o número da OAB, o total de atendimentos e o percentual
`total / servicesInPeriod * 100` com uma casa decimal. Sem advogados no
período, o card MUST exibir um estado vazio.

#### Scenario: Percentual sobre o período
- **WHEN** `servicesInPeriod = 200` e o primeiro advogado tem `total = 12`
- **THEN** o primeiro item mostra a posição 1, o nome, a OAB, `12` e `6.0%`

#### Scenario: Período sem atendimentos
- **WHEN** a API retorna `lawyers = []` para o período selecionado
- **THEN** o card mostra a mensagem de que não houve atendimentos no período

### Requirement: Ranking de funcionários(as) que mais atenderam
O sistema MUST exibir o card "Top 3 funcionários(as) que mais atenderam" com
o resultado de `GET /metrics/agents/top` (`limit=3`) para o período
selecionado, na ordem recebida da API e incluindo funcionários inativos. Cada
item MUST mostrar a posição, o nome, o total e o percentual
`total / servicesInPeriod * 100` com uma casa decimal. O item do funcionário
logado (o `sub` do JWT) MUST aparecer destacado quando ele estiver na lista.
Sem funcionários no período, o card MUST exibir um estado vazio.

#### Scenario: Funcionário logado no ranking
- **WHEN** o funcionário logado é o segundo da lista
- **THEN** o segundo item aparece destacado e identificado como "Você"

#### Scenario: Funcionário logado fora do ranking
- **WHEN** o funcionário logado não está entre os três
- **THEN** nenhum item aparece destacado

#### Scenario: Período sem atendimentos
- **WHEN** a API retorna `agents = []` para o período selecionado
- **THEN** o card mostra a mensagem de que não houve atendimentos no período

### Requirement: Relatório de atendimentos em PDF
O sistema MUST exibir no cabeçalho do dashboard o botão "Gerar relatório
(PDF)". Ele abre um diálogo com ano e mês opcional, preenchidos com o período
do seletor. Ao confirmar, o sistema MUST chamar
`GET /metrics/report?year=&month=` (sem `month`, relatório do ano inteiro) e
baixar o PDF com o nome do header `Content-Disposition`. Se o header não
estiver disponível, o nome MUST ser
`relatorio-atendimentos-<ano>[-<mês com dois dígitos>].pdf`. Enquanto o PDF é
gerado, o botão MUST mostrar carregamento e não permitir um novo envio. Em
caso de erro, o sistema MUST exibir um toast com a `message` retornada pela
API ou, na falta dela, uma mensagem genérica.

#### Scenario: Relatório mensal
- **WHEN** o usuário gera o relatório de setembro de 2026
- **THEN** a requisição leva `year=2026&month=9` e o navegador baixa `relatorio-atendimentos-2026-09.pdf`

#### Scenario: Relatório do ano inteiro
- **WHEN** o usuário gera o relatório de 2025 com "Ano inteiro"
- **THEN** a requisição leva só `year=2025` e o navegador baixa `relatorio-atendimentos-2025.pdf`

#### Scenario: Diálogo abre com o período do seletor
- **WHEN** a URL do dashboard tem `year=2025&month=3` e o usuário abre o diálogo
- **THEN** o diálogo mostra 2025 e "Março"

#### Scenario: Geração em andamento
- **WHEN** o usuário confirma e a API ainda não respondeu
- **THEN** o botão fica desabilitado com indicador de carregamento

#### Scenario: Erro da API
- **WHEN** a API responde `400` com `{ "message": "Mês inválido." }`
- **THEN** o sistema exibe um toast de erro com "Mês inválido." e nenhum arquivo é baixado

### Requirement: Erro ao carregar métricas do período
Cada painel de gráfico ou ranking MUST exibir uma mensagem de erro no próprio
painel quando sua consulta falha, sem afetar os demais painéis e cards.

#### Scenario: Rotas de métricas indisponíveis
- **WHEN** a API responde `404` às rotas `/metrics`
- **THEN** os gráficos e rankings mostram "Não foi possível carregar os dados." e os 4 cards de totais continuam funcionando
