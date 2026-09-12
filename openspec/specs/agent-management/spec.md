# agent-management Specification

## Purpose

Descreve a "Gestão de Funcionários" (`/agents`), área exclusiva de
administradores para manter os usuários do sistema: listagem paginada com
filtros, cadastro com senha provisória, edição de nome, e-mail e cargo, e
revogação/restauração do acesso (desativação lógica). Não há exclusão de
funcionários.

## Requirements

### Requirement: Listagem de funcionários
O sistema MUST listar os funcionários via `GET /agents/all`, paginados em 10
itens por página, exibindo nome, e-mail, cargo (badge "ADMINISTRADOR" ou
"MEMBRO"), situação e as ações disponíveis.

#### Scenario: Funcionário ativo
- **WHEN** um funcionário com `inactive = null` é exibido
- **THEN** a situação mostra o badge animado "ATIVO" e as ações "Alterar" e "Revogar"

#### Scenario: Funcionário inativo
- **WHEN** um funcionário com `inactive` preenchido é exibido
- **THEN** a linha fica esmaecida, a situação mostra "Inativo há <tempo relativo>", o botão "Alterar" fica desabilitado e a ação disponível é "Permitir"

#### Scenario: Lista vazia
- **WHEN** a API retorna nenhum funcionário
- **THEN** a tabela exibe "Não encontramos nenhum funcionário cadastrado."

### Requirement: Filtros de funcionários
O sistema MUST permitir filtrar por nome e por cargo (Todos, Administrador,
Membro), persistindo os filtros na URL (`name`, `role`), enviando `ALL` à API
como ausência de filtro e voltando para a página 1 ao aplicar.

#### Scenario: Filtrar administradores
- **WHEN** o usuário seleciona "Administrador" e clica em "Filtrar resultados"
- **THEN** a URL passa a conter `role=ADMIN&page=1` e a lista mostra apenas administradores

### Requirement: Cadastrar funcionário
O sistema MUST permitir cadastrar um funcionário em um painel lateral "Novo
Funcionário" informando nome completo, e-mail válido e senha provisória (mínimo
8 caracteres, pré-preenchida com o valor padrão exibido no formulário), via
`POST /agents`. O backend envia as credenciais por e-mail ao novo
funcionário.

#### Scenario: Cadastro bem-sucedido
- **WHEN** o administrador preenche os campos e clica em "Criar Novo"
- **THEN** o painel é fechado, é exibido o toast "Funcionário registrado com sucesso!" e a listagem é recarregada

#### Scenario: E-mail já cadastrado
- **WHEN** a API retorna erro (ex.: e-mail duplicado)
- **THEN** o sistema limpa o formulário e exibe o toast "Houve um erro ao registrar o funcionário!" com a mensagem da API

### Requirement: Editar funcionário
O sistema MUST permitir alterar nome, e-mail e cargo (Administrador ou
Membro) de um funcionário ativo em um diálogo pré-preenchido, via
`PUT /agents/update/:id`.

#### Scenario: Promover a administrador
- **WHEN** o administrador altera o cargo de um membro para "Administrador" e clica em "Salvar alterações"
- **THEN** o diálogo é fechado, é exibido o toast "Funcionário atualizado com sucesso!" e a listagem mostra o badge "ADMINISTRADOR"

### Requirement: Revogar acesso
O sistema MUST permitir desativar um funcionário ativo, após confirmação em
diálogo, via `PATCH /agents/inactive/:id`, impedindo seu acesso à
plataforma.

#### Scenario: Revogação bem-sucedida
- **WHEN** o administrador confirma "Revogar Acesso"
- **THEN** o sistema exibe o toast "Desativação realizada com sucesso!" e a linha passa a exibir o funcionário como inativo

### Requirement: Restaurar acesso
O sistema MUST permitir reativar um funcionário inativo, após confirmação em
diálogo, via `PATCH /agents/active/:id`.

#### Scenario: Reativação bem-sucedida
- **WHEN** o administrador confirma "Permitir Acesso"
- **THEN** o sistema exibe o toast "Ativação realizada com sucesso!" e a linha passa a exibir o badge "ATIVO"
