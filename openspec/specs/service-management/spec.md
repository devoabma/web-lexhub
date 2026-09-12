# service-management Specification

## Purpose

Descreve a "Central de Atendimentos" (`/services`), núcleo do LexHub: listagem
paginada e filtrável de atendimentos, visualização de detalhes, registro de
novo atendimento a partir da consulta do(a) advogado(a) pela OAB, registro de
atendimento externo (advogado informado manualmente), conclusão e
cancelamento. Um atendimento tem status `OPEN` ou `COMPLETED`, forma
`PERSONALLY` (presencial) ou `REMOTE` (remoto) e um ou mais tipos de serviço.

## Requirements

### Requirement: Listagem de atendimentos
O sistema MUST listar os atendimentos em tabela via `GET /services/all`,
exibindo por linha: botão de detalhes, status ("Em andamento" com marcador
verde ou "Encerrado" com marcador vermelho), tempo relativo em pt-BR, badge da
forma de atendimento ("PRESENCIAL" ou "REMOTO"), número OAB, nome do(a)
advogado(a) formatado, nome do(a) funcionário(a) e as ações "Concluir" e
"Cancelar".

#### Scenario: Atendimento em andamento
- **WHEN** um atendimento com status `OPEN` criado há 2 horas é exibido
- **THEN** a linha mostra "Em andamento" e "há cerca de 2 horas" calculado a partir de `createdAt`

#### Scenario: Atendimento concluído
- **WHEN** um atendimento com status `COMPLETED` é exibido
- **THEN** a linha mostra "Encerrado", o tempo relativo calculado a partir de `finishedAt` e o botão "Concluído" desabilitado

#### Scenario: Lista vazia
- **WHEN** a API retorna nenhum atendimento
- **THEN** a tabela exibe "Não encontramos nenhum atendimento cadastrado."

### Requirement: Formatação do nome do advogado
O sistema MUST exibir o nome do(a) advogado(a) com todas as letras minúsculas
e a inicial maiúscula apenas nas palavras com mais de 2 caracteres.

#### Scenario: Nome em caixa alta
- **WHEN** a API retorna o nome "MARIA DA SILVA DE SOUSA"
- **THEN** o sistema exibe "Maria da Silva de Sousa"

### Requirement: Filtros de atendimentos
O sistema MUST permitir filtrar por número OAB, nome do(a) advogado(a), nome
do(a) funcionário(a), status (Todos, Em andamento, Concluído) e forma de
atendimento (Todos, Presencial, Remoto). Os filtros MUST ser persistidos na URL
(`oab`, `lawyerName`, `agentName`, `status`, `assistance`), a opção "Todos"
(`ALL`) MUST ser enviada à API como ausência de filtro e aplicar filtros MUST
voltar para a página 1.

#### Scenario: Aplicar filtro por status
- **WHEN** o usuário seleciona "Em andamento" e clica em "Filtrar resultados"
- **THEN** a URL passa a conter `status=OPEN&page=1` e a lista é recarregada com esse filtro

#### Scenario: Remover filtros
- **WHEN** o usuário clica em "Remover filtros"
- **THEN** a URL passa a conter apenas `page=1` e os campos do formulário são limpos

#### Scenario: Filtros preservados ao recarregar
- **WHEN** o usuário abre `/services?oab=12345&page=1`
- **THEN** o campo "Número OAB" vem preenchido com `12345`

### Requirement: Paginação
O sistema MUST paginar as listagens em páginas de 10 itens, controladas pelo
parâmetro `page` da URL (padrão 1), exibindo "Total de N atendimento(s)",
"Página X de Y" e botões de primeira, anterior, próxima e última página,
desabilitados nos limites.

#### Scenario: Primeira página
- **WHEN** o usuário está na página 1 de 5
- **THEN** os botões "Primeira página" e "Página anterior" ficam desabilitados

#### Scenario: Navegar de página
- **WHEN** o usuário clica em "Próxima página" estando na página 2
- **THEN** a URL passa a conter `page=3` mantendo os demais filtros

### Requirement: Detalhes do atendimento
O sistema MUST exibir, em diálogo, o ID, o status, os tipos de serviço, a
forma de atendimento, os dados do(a) advogado(a) (iniciais, nome, OAB e
e-mail ou "Sem e-mail cadastrado"), os dados do(a) funcionário(a) (nome,
função e e-mail), a observação e a data de criação no formato
`dd/MM/yyyy 'às' HH:mm`.

#### Scenario: Detalhes de atendimento concluído
- **WHEN** o usuário abre os detalhes de um atendimento `COMPLETED`
- **THEN** o diálogo também exibe "Finalizado em" e a "Duração total"

#### Scenario: Sem observação
- **WHEN** a observação do atendimento é uma string vazia
- **THEN** o diálogo exibe "Nenhuma observação adicionada"

### Requirement: Cálculo da duração do atendimento
O sistema MUST calcular a duração como a diferença entre `finishedAt` e
`createdAt`, exibindo `Xh Ymin` quando houver horas e `Ymin` caso contrário,
com mínimo de 1 minuto.

#### Scenario: Duração com horas
- **WHEN** um atendimento foi criado às 09:00 e finalizado às 10:25
- **THEN** a duração exibida é `1h 25min`

#### Scenario: Duração menor que um minuto
- **WHEN** um atendimento foi finalizado 30 segundos após a criação
- **THEN** a duração exibida é `1min`

### Requirement: Novo atendimento com consulta por OAB
O sistema MUST registrar um novo atendimento em duas etapas no diálogo "Novo
Atendimento": (1) consultar o(a) advogado(a) pelo número OAB via
`POST /services/consult/lawyer`; (2) somente após consulta bem-sucedida,
informar a forma de atendimento, um ou mais tipos de serviço e uma observação
opcional, enviando `POST /services` com `oab`, `serviceTypeId[]`,
`assistance` e `observation`.

#### Scenario: Advogado encontrado
- **WHEN** o usuário informa uma OAB e clica em "Buscar Advogado(a)" e a API retorna o nome
- **THEN** o sistema exibe o nome formatado em destaque verde e libera o formulário da segunda etapa

#### Scenario: Consulta recusada pela API
- **WHEN** a consulta da OAB retorna erro (ex.: advogado inexistente ou inadimplente)
- **THEN** o sistema exibe a mensagem `response.data.message` em um alerta vermelho e não libera a segunda etapa

#### Scenario: Atendimento registrado
- **WHEN** o usuário preenche forma e tipos de serviço e clica em "Criar Atendimento"
- **THEN** o sistema fecha o diálogo, exibe o toast "Atendimento registrado com sucesso!" e recarrega a listagem

#### Scenario: Validação da segunda etapa
- **WHEN** o usuário envia sem selecionar forma de atendimento ou tipo de serviço
- **THEN** o formulário não é enviado ("Selecione a forma de atendimento" / "Selecione pelo menos um tipo de serviço")

#### Scenario: Fechar o diálogo
- **WHEN** o usuário fecha o diálogo "Novo Atendimento"
- **THEN** a consulta, o nome encontrado e as mensagens de erro são descartados

### Requirement: Seleção de tipos de serviço
O sistema MUST oferecer a seleção múltipla de tipos de serviço em um diálogo
com busca por nome, alternando a seleção a cada clique, com a lista obtida de
`GET /services/types/all-wp` (sem paginação). O botão MUST exibir
"N serviço(s) selecionado(s)" quando houver seleção.

#### Scenario: Buscar e selecionar tipos
- **WHEN** o usuário digita parte do nome e seleciona dois tipos
- **THEN** ambos aparecem marcados e o botão exibe "2 serviço(s) selecionado(s)"

#### Scenario: Desmarcar tipo
- **WHEN** o usuário clica em um tipo já selecionado
- **THEN** o tipo é removido da seleção

### Requirement: Atendimento externo
O sistema MUST permitir registrar um atendimento sem consulta prévia pela OAB
no diálogo "Novo Atendimento Externo", informando OAB, nome completo, e-mail
válido, forma de atendimento, um ou mais tipos de serviço e observação
opcional, enviando `POST /services/external`.

#### Scenario: Atendimento externo registrado
- **WHEN** o usuário preenche todos os campos obrigatórios e clica em "Criar Atendimento"
- **THEN** o sistema fecha o diálogo, exibe o toast "Atendimento registrado com sucesso!" e recarrega a listagem

#### Scenario: Erro da API
- **WHEN** a API retorna erro ao registrar o atendimento externo
- **THEN** o sistema limpa o formulário e exibe o toast "Houve um erro ao registrar o atendimento externo!" com a mensagem da API

### Requirement: Concluir atendimento
O sistema MUST permitir concluir um atendimento em andamento, após
confirmação em diálogo, via `PATCH /services/finished/:id`.

#### Scenario: Conclusão bem-sucedida
- **WHEN** o usuário autorizado confirma "Concluir"
- **THEN** o sistema fecha o diálogo, exibe o toast "Atendimento concluído com sucesso!" e recarrega a listagem

#### Scenario: Falha na conclusão
- **WHEN** a API retorna erro
- **THEN** o sistema exibe o toast "Erro ao concluir atendimento"

### Requirement: Cancelar atendimento
O sistema MUST permitir cancelar um atendimento em andamento, após
confirmação em diálogo, via `DELETE /services/cancel/:id`. O cancelamento é
irreversível.

#### Scenario: Cancelamento bem-sucedido
- **WHEN** o usuário autorizado confirma "Cancelar"
- **THEN** o sistema fecha o diálogo, exibe o toast de aviso "Atendimento cancelado com sucesso!" com a descrição "Essa ação é irreversível." e recarrega a listagem
