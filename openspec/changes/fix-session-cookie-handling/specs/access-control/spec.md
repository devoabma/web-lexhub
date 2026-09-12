## MODIFIED Requirements

### Requirement: Rotas públicas
O sistema MUST tratar `/`, `/forgot-password`, `/reset-password` e
`/confirm-send-email` como rotas públicas, acessíveis sem autenticação. Um
usuário com sessão válida MUST ser redirecionado para `/dashboard`. Uma
sessão inválida (cookie `@lexhub-auth` malformado, sem `exp` ou com o JWT
expirado) MUST NOT impedir o acesso: a página é exibida, sem
redirecionamento, e a resposta remove o cookie.

#### Scenario: Visitante acessa rota pública
- **WHEN** um usuário sem o cookie `@lexhub-auth` acessa `/forgot-password`
- **THEN** a página é exibida normalmente

#### Scenario: Usuário autenticado acessa rota pública
- **WHEN** um usuário com sessão válida acessa `/` ou qualquer outra rota pública
- **THEN** o middleware redireciona para `/dashboard`

#### Scenario: Cookie com valor inválido na tela de login
- **WHEN** um usuário com o cookie `@lexhub-auth` contendo um valor que não é um JWT acessa `/`
- **THEN** a tela de login é exibida sem erro 500 e a resposta remove o cookie

#### Scenario: Cookie expirado na tela de login
- **WHEN** um usuário com o cookie `@lexhub-auth` contendo um JWT expirado acessa `/`
- **THEN** a tela de login é exibida diretamente, sem nenhum redirecionamento, e a resposta remove o cookie

### Requirement: Rotas privadas exigem autenticação
O sistema MUST redirecionar para `/` qualquer acesso a rota não pública feito
sem sessão válida. Sessão válida é um cookie `@lexhub-auth` com um JWT que
pode ser decodificado e cujo `exp` está no futuro. A verificação da
assinatura e do papel é responsabilidade da API. Quando o cookie existe mas é
inválido, o redirecionamento MUST removê-lo com o mesmo domínio e caminho com
que a API o grava, e também a variante sem domínio. A navegação MUST NOT
entrar em redirecionamento em loop. O middleware MUST ignorar `api`,
`_next/static`, `_next/image`, `fonts`, `favicon.ico`, `sitemap.xml` e
`robots.txt`.

#### Scenario: Visitante acessa o dashboard
- **WHEN** um usuário sem cookie acessa `/dashboard`
- **THEN** o middleware redireciona para `/`

#### Scenario: Sessão expirada em rota privada
- **WHEN** um usuário com o cookie `@lexhub-auth` contendo um JWT expirado acessa `/dashboard`
- **THEN** há um único redirecionamento para `/`, a resposta remove o cookie e a tela de login é exibida sem novos redirecionamentos

#### Scenario: Cookie malformado em rota privada
- **WHEN** um usuário com o cookie `@lexhub-auth` contendo um valor que não é um JWT acessa `/services`
- **THEN** o middleware redireciona para `/` removendo o cookie, sem erro 500

### Requirement: Rotas exclusivas de administrador
O sistema MUST permitir o acesso a `/services-types` e `/agents`, e a
qualquer subrota delas (ex.: `/agents/123`), apenas a usuários com
`role = ADMIN`. A rota `/services` MUST ser acessível a qualquer usuário
autenticado.

#### Scenario: Membro tenta acessar gestão de funcionários
- **WHEN** um usuário com `role = MEMBER` acessa `/agents`
- **THEN** o middleware redireciona para `/dashboard`

#### Scenario: Membro tenta acessar subrota de administrador
- **WHEN** um usuário com `role = MEMBER` acessa `/agents/qualquer-coisa`
- **THEN** o middleware redireciona para `/dashboard`

#### Scenario: Rota com prefixo parecido não é de administrador
- **WHEN** um usuário com `role = MEMBER` acessa `/agentsx`
- **THEN** o middleware não aplica a regra de administrador a essa rota

#### Scenario: Administrador acessa tipos de serviço
- **WHEN** um usuário com `role = ADMIN` acessa `/services-types`
- **THEN** a página é exibida

#### Scenario: Membro acessa atendimentos
- **WHEN** um usuário com `role = MEMBER` acessa `/services`
- **THEN** a página é exibida
