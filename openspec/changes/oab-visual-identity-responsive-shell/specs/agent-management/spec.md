## MODIFIED Requirements

### Requirement: Listagem de funcionários
O sistema MUST listar os funcionários via `GET /agents/all`, paginados em 10
itens por página, exibindo por linha: as iniciais em avatar, o nome e o
e-mail, o cargo (badge "Administrador", com ícone de escudo, ou "Membro"), a
situação e o menu "⋯" com as ações disponíveis. Abaixo de 768px, o cargo
MUST aparecer abaixo do e-mail; abaixo de 640px, a situação também.

#### Scenario: Funcionário ativo
- **WHEN** um funcionário com `inactive = null` é exibido
- **THEN** a situação mostra o badge "Ativo" com marcador verde, e o menu "⋯" oferece "Editar" e "Revogar acesso"

#### Scenario: Funcionário inativo
- **WHEN** um funcionário com `inactive` preenchido é exibido
- **THEN** o nome aparece em cor atenuada, a situação mostra o badge "Inativo" seguido de "há <tempo relativo>", e o menu "⋯" oferece "Editar" desabilitado e "Restaurar acesso"

#### Scenario: Lista vazia
- **WHEN** a API retorna nenhum funcionário
- **THEN** a tabela exibe "Não encontramos nenhum funcionário cadastrado." com a dica "Ajuste os filtros ou cadastre um novo funcionário."

### Requirement: Cadastrar funcionário
O sistema MUST permitir cadastrar um funcionário no Drawer "Novo
Funcionário" (pela direita no desktop e por baixo no celular), informando
nome completo, e-mail válido e senha provisória (mínimo 8 caracteres,
pré-preenchida com o valor padrão exibido no formulário), via
`POST /agents`. O backend envia as credenciais por e-mail ao novo
funcionário.

#### Scenario: Cadastro bem-sucedido
- **WHEN** o administrador preenche os campos e clica em "Criar Novo"
- **THEN** o Drawer é fechado, é exibido o toast "Funcionário registrado com sucesso!" e a listagem é recarregada

#### Scenario: E-mail já cadastrado
- **WHEN** a API retorna erro (ex.: e-mail duplicado)
- **THEN** o sistema limpa o formulário e exibe o toast "Houve um erro ao registrar o funcionário!" com a mensagem da API

### Requirement: Editar funcionário
O sistema MUST permitir alterar nome, e-mail e cargo (Administrador ou
Membro) de um funcionário ativo em um diálogo pré-preenchido, aberto pela
ação "Editar" do menu da linha, via `PUT /agents/update/:id`.

#### Scenario: Promover a administrador
- **WHEN** o administrador altera o cargo de um membro para "Administrador" e clica em "Salvar alterações"
- **THEN** o diálogo é fechado, é exibido o toast "Funcionário atualizado com sucesso!" e a listagem mostra o badge "Administrador"

### Requirement: Restaurar acesso
O sistema MUST permitir reativar um funcionário inativo, pela ação
"Restaurar acesso" do menu da linha e após confirmação em diálogo, via
`PATCH /agents/active/:id`.

#### Scenario: Reativação bem-sucedida
- **WHEN** o administrador confirma "Permitir Acesso"
- **THEN** o sistema exibe o toast "Ativação realizada com sucesso!" e a linha passa a exibir o badge "Ativo"
