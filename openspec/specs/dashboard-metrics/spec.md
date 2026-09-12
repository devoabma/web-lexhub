# dashboard-metrics Specification

## Purpose

Descreve a página `/dashboard`, que apresenta indicadores de volume de
atendimentos: produção do funcionário logado, total geral com comparação
diária, totais mensal e anual com variação percentual, e um gráfico de linha
com a evolução mensal. Todos os dados vêm de endpoints agregados do backend.

## Requirements

### Requirement: Cálculo de variação percentual
O sistema MUST calcular a variação entre um período atual e o anterior como
`((atual - anterior) / anterior) * 100`, considerando `100%` quando o período
anterior é zero e o atual é maior que zero, e `0%` quando ambos são zero. O
valor MUST ser exibido com uma casa decimal, prefixo `+` quando não negativo,
em verde quando `>= 0` e em vermelho quando negativo.

#### Scenario: Crescimento
- **WHEN** o período atual tem 15 atendimentos e o anterior tem 10
- **THEN** o card exibe `+50.0%` em verde

#### Scenario: Período anterior sem registros
- **WHEN** o período atual tem 3 atendimentos e o anterior tem 0
- **THEN** o card exibe `+100.0%`

#### Scenario: Queda
- **WHEN** o período atual tem 5 atendimentos e o anterior tem 10
- **THEN** o card exibe `-50.0%` em vermelho

### Requirement: Formatação dos totais
O sistema MUST exibir os totais dos cards com no mínimo dois dígitos e sem
separador de milhar (ex.: `07`, `1250`), usando `0` quando o dado não está
disponível.

#### Scenario: Total de um dígito
- **WHEN** o total retornado é 7
- **THEN** o card exibe `07`

### Requirement: Card de atendimentos por funcionário
O sistema MUST exibir, para o funcionário logado, o nome (via
`GET /agents/profile`), o total geral de atendimentos, o total do mês atual
com variação em relação ao mês anterior e o total do mês anterior, usando
`GET /services/general/agent/:id` onde `:id` é o `sub` do JWT. Os nomes dos
meses MUST ser exibidos em pt-BR com inicial maiúscula.

#### Scenario: Funcionário com atendimentos
- **WHEN** o funcionário logado tem `totalGeneral=40`, `totalOnMonth=12` e `totalOnPreviousMonth=8`
- **THEN** o card mostra o nome do funcionário, `40`, o mês atual com `12` e `+50.0%`, e o mês anterior com `08`

### Requirement: Card de total de atendimentos
O sistema MUST exibir o total geral de atendimentos cadastrados
(`GET /services/general`) e os totais de hoje e ontem com a variação diária
(`GET /services/general/agent/day`).

#### Scenario: Comparação diária
- **WHEN** a API retorna `totalTheDay=6` e `totalLastDay=3`
- **THEN** o card exibe "Hoje" com `06` e `+100.0%`, e "Ontem" com `03`

### Requirement: Cards mensal e anual
O sistema MUST exibir o total do mês atual comparado ao mês anterior
(`GET /services/general/month`) e o total do ano atual comparado ao ano
anterior (`GET /services/general/year`), com o texto
"vs N atendimento(s) em <período anterior>".

#### Scenario: Card anual
- **WHEN** a API retorna `totalCurrentYear=300` e `totalPreviousYear=250` em 2026
- **THEN** o card exibe `300`, `+20.0%` e "vs 250 atendimento(s) em 2025"

### Requirement: Gráfico mensal de atendimentos
O sistema MUST exibir um gráfico de linha "Atendimentos por mês" com os dados
de `GET /services/monthly`, usando o campo `data` como eixo X e `services`
como eixo Y.

#### Scenario: Dados carregando
- **WHEN** a consulta do gráfico ainda está em andamento
- **THEN** um skeleton de 300px de altura é exibido no lugar do gráfico

### Requirement: Estados de carregamento
Cada card MUST exibir skeletons independentes enquanto sua consulta está em
andamento, sem bloquear os demais cards.

#### Scenario: Consultas com tempos diferentes
- **WHEN** o total anual já carregou e o total diário ainda não
- **THEN** o card anual exibe os valores e o card de total exibe skeleton apenas na área de hoje/ontem
