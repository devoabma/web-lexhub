## MODIFIED Requirements

### Requirement: Menu lateral por papel
O sistema MUST exibir na barra lateral o grupo "Menu", com os itens
"Dashboard" e "Atendimentos", para todos os usuários autenticados. O grupo
"Administração", com os itens "Controle de Serviços" e "Funcionários", MUST
aparecer somente para administradores. O item da rota atual MUST ser
destacado visualmente e marcado como página atual para tecnologias
assistivas (`aria-current="page"`), com a barra expandida, recolhida ou
aberta como painel no celular.

#### Scenario: Menu de um membro
- **WHEN** um usuário com `role = MEMBER` visualiza a barra lateral
- **THEN** apenas o grupo "Menu", com "Dashboard" e "Atendimentos", é exibido

#### Scenario: Menu de um administrador
- **WHEN** um usuário com `role = ADMIN` visualiza a barra lateral
- **THEN** são exibidos o grupo "Menu" ("Dashboard", "Atendimentos") e o grupo "Administração" ("Controle de Serviços", "Funcionários")

#### Scenario: Item ativo com a barra recolhida
- **WHEN** um usuário está em `/services` com a barra recolhida
- **THEN** o ícone de "Atendimentos" aparece destacado e tem `aria-current="page"`

### Requirement: Perfil do usuário logado
O sistema MUST exibir no rodapé da barra lateral o menu do usuário logado,
com dados de `GET /agents/profile` e skeleton durante o carregamento:
- com a barra expandida, iniciais, nome e e-mail;
- com a barra recolhida, só as iniciais.

Ao ser aberto, o menu MUST mostrar nome, e-mail e cargo ("Administrador" ou
"Membro"), as opções de tema e a ação "Sair".

#### Scenario: Perfil carregado com a barra expandida
- **WHEN** a barra lateral está expandida e o perfil é retornado pela API
- **THEN** o rodapé mostra as iniciais, o nome e o e-mail do funcionário

#### Scenario: Abrir o menu do usuário
- **WHEN** o usuário clica no seu perfil no rodapé da barra lateral
- **THEN** abre um menu com nome, e-mail, cargo, as opções de tema "Claro", "Escuro" e "Sistema" e a ação "Sair"

#### Scenario: Sair pelo menu do usuário
- **WHEN** o usuário escolhe "Sair" no menu do usuário
- **THEN** o diálogo "Você realmente quer sair?" é exibido antes de encerrar a sessão

### Requirement: Permissões sobre atendimentos
O sistema MUST permitir concluir ou cancelar um atendimento apenas ao
funcionário que o registrou ou a um administrador. Atendimentos concluídos
MUST NOT oferecer essas ações: o botão "Concluir" não é exibido e
"Cancelar atendimento" fica desabilitado no menu da linha.

#### Scenario: Membro vê atendimento de outro funcionário
- **WHEN** um membro visualiza um atendimento em andamento registrado por outro funcionário
- **THEN** o botão "Concluir" e o item "Cancelar atendimento" do menu ficam desabilitados

#### Scenario: Administrador vê atendimento de outro funcionário
- **WHEN** um administrador visualiza um atendimento em andamento registrado por outro funcionário
- **THEN** o botão "Concluir" e o item "Cancelar atendimento" ficam habilitados

#### Scenario: Atendimento concluído
- **WHEN** qualquer usuário visualiza um atendimento concluído
- **THEN** a linha não exibe "Concluir" e o item "Cancelar atendimento" fica desabilitado
