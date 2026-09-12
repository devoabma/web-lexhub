## MODIFIED Requirements

### Requirement: Listagem de atendimentos
O sistema MUST listar os atendimentos em tabela via `GET /services/all`,
exibindo por linha:
- o nome do(a) advogado(a) formatado, que abre os detalhes ao ser clicado,
  com o número OAB logo abaixo;
- o status: "Em andamento" (âmbar, com marcador pulsante) ou "Concluído"
  (verde, com ícone de check);
- o badge da forma de atendimento: "Presencial" ou "Remoto", com ícone;
- o nome do(a) funcionário(a);
- o tempo relativo em pt-BR, com a data completa ao passar o mouse;
- as ações: o botão "Concluir" nos atendimentos em andamento e o menu "⋯"
  com "Ver detalhes" e "Cancelar atendimento".

Abaixo de 640px, o status MUST aparecer ao lado da OAB, e o botão
"Concluir" MUST mostrar só o ícone, mantendo o rótulo para leitores de
tela.

#### Scenario: Atendimento em andamento
- **WHEN** um atendimento com status `OPEN` criado há 2 horas é exibido
- **THEN** a linha mostra "Em andamento", "há cerca de 2 horas" calculado a partir de `createdAt` e o botão "Concluir"

#### Scenario: Atendimento concluído
- **WHEN** um atendimento com status `COMPLETED` é exibido
- **THEN** a linha mostra "Concluído", o tempo relativo calculado a partir de `finishedAt`, nenhum botão "Concluir", e o menu "⋯" com "Cancelar atendimento" desabilitado

#### Scenario: Abrir detalhes pelo nome
- **WHEN** o usuário clica no nome do(a) advogado(a) numa linha
- **THEN** o diálogo "Detalhes do Atendimento" daquele atendimento é aberto

#### Scenario: Lista vazia
- **WHEN** a API retorna nenhum atendimento
- **THEN** a tabela exibe "Não encontramos nenhum atendimento cadastrado." com a dica "Ajuste os filtros ou registre um novo atendimento."
