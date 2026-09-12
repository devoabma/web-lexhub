# access-control Specification

## Purpose

Define quem pode acessar cada rota e funcionalidade do LexHub. O controle é
feito no frontend pelo middleware do Next.js (`src/middleware.ts`) e pelos
helpers de `src/auth.ts`, a partir do papel (`role`) contido no JWT do cookie
`@lexhub-auth`. Existem dois papéis: `ADMIN` (Administrador) e `MEMBER`
(Membro). A autorização definitiva é responsabilidade do backend.

## Requirements

### Requirement: Rotas públicas
O sistema MUST tratar `/`, `/forgot-password`, `/reset-password` e
`/confirm-send-email` como rotas públicas, acessíveis sem autenticação.

#### Scenario: Visitante acessa rota pública
- **WHEN** um usuário sem o cookie `@lexhub-auth` acessa `/forgot-password`
- **THEN** a página é exibida normalmente

#### Scenario: Usuário autenticado acessa rota pública
- **WHEN** um usuário com cookie válido acessa `/` ou qualquer outra rota pública
- **THEN** o middleware redireciona para `/dashboard`

### Requirement: Rotas privadas exigem autenticação
O sistema MUST redirecionar para `/` qualquer acesso a rota não pública feito
sem o cookie `@lexhub-auth`. O middleware MUST ignorar `api`, `_next/static`,
`_next/image`, `fonts`, `favicon.ico`, `sitemap.xml` e `robots.txt`.

#### Scenario: Visitante acessa o dashboard
- **WHEN** um usuário sem cookie acessa `/dashboard`
- **THEN** o middleware redireciona para `/`

### Requirement: Rotas exclusivas de administrador
O sistema MUST permitir o acesso a `/services-types` e `/agents` apenas a
usuários com `role = ADMIN`. A rota `/services` MUST ser acessível a qualquer
usuário autenticado.

#### Scenario: Membro tenta acessar gestão de funcionários
- **WHEN** um usuário com `role = MEMBER` acessa `/agents`
- **THEN** o middleware redireciona para `/dashboard`

#### Scenario: Administrador acessa tipos de serviço
- **WHEN** um usuário com `role = ADMIN` acessa `/services-types`
- **THEN** a página é exibida

#### Scenario: Membro acessa atendimentos
- **WHEN** um usuário com `role = MEMBER` acessa `/services`
- **THEN** a página é exibida

### Requirement: Menu lateral por papel
O sistema MUST exibir na barra lateral os itens "Dashboard" e "Atendimentos"
para todos os usuários autenticados, e os itens "Controle de Serviços" e
"Funcionários" somente para administradores. O item da rota atual MUST ser
destacado com um indicador visual.

#### Scenario: Menu de um membro
- **WHEN** um usuário com `role = MEMBER` visualiza a barra lateral
- **THEN** apenas "Dashboard" e "Atendimentos" são exibidos

#### Scenario: Menu de um administrador
- **WHEN** um usuário com `role = ADMIN` visualiza a barra lateral
- **THEN** "Dashboard", "Atendimentos", "Controle de Serviços" e "Funcionários" são exibidos

### Requirement: Perfil do usuário logado
O sistema MUST exibir no rodapé da barra lateral o nome, o cargo
("Cargo: Administrador" ou "Cargo: Membro") e o e-mail do usuário logado,
obtidos em `GET /agents/profile`, com skeleton durante o carregamento.

#### Scenario: Perfil carregado
- **WHEN** a barra lateral é renderizada e o perfil é retornado pela API
- **THEN** nome, cargo e e-mail do funcionário são exibidos junto ao botão de sair

### Requirement: Permissões sobre atendimentos
O sistema MUST permitir concluir ou cancelar um atendimento apenas ao
funcionário que o registrou ou a um administrador. Atendimentos concluídos
MUST ter as ações de concluir e cancelar desabilitadas para todos.

#### Scenario: Membro vê atendimento de outro funcionário
- **WHEN** um membro visualiza um atendimento em andamento registrado por outro funcionário
- **THEN** os botões "Concluir" e "Cancelar" ficam desabilitados

#### Scenario: Administrador vê atendimento de outro funcionário
- **WHEN** um administrador visualiza um atendimento em andamento registrado por outro funcionário
- **THEN** os botões "Concluir" e "Cancelar" ficam habilitados
