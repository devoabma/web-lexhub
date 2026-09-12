## MODIFIED Requirements

### Requirement: Login com e-mail e senha
O sistema MUST permitir que um(a) funcionário(a) cadastrado(a) se autentique
informando e-mail e senha na rota `/`, enviando `POST /agents/sessions`. A
sessão MUST ser estabelecida pelo cookie httpOnly `@lexhub-auth` definido pelo
backend (a requisição usa `withCredentials`); o frontend não armazena o token
retornado no corpo da resposta. Após um login bem-sucedido, o sistema MUST
descartar todos os dados em cache de sessões anteriores antes de exibir a
área logada.

#### Scenario: Credenciais válidas
- **WHEN** o usuário envia e-mail e senha válidos
- **THEN** o sistema descarta o cache de dados, exibe o toast "Acesso concedido." e redireciona para `/dashboard` usando `router.replace`

#### Scenario: Troca de usuário na mesma aba
- **WHEN** um usuário sai da conta e outro usuário faz login na mesma aba, sem recarregar a página
- **THEN** a barra lateral e as listagens mostram os dados do novo usuário, e nenhum dado do usuário anterior

#### Scenario: Credenciais rejeitadas pela API
- **WHEN** a API responde com erro
- **THEN** o sistema limpa o formulário e exibe o toast "Acesso negado!" com a mensagem `response.data.message` retornada pela API

#### Scenario: Validação local do formulário
- **WHEN** o e-mail é inválido ou a senha tem menos de 8 caracteres
- **THEN** o sistema exibe a mensagem de erro abaixo do campo e desabilita o botão "Entrar no sistema"

### Requirement: Expiração da sessão
O sistema MUST considerar a sessão encerrada quando o JWT do cookie
`@lexhub-auth` não puder ser decodificado, não tiver `exp` ou tiver `exp` no
passado. Ao detectar a sessão encerrada, o sistema MUST remover o cookie com
o mesmo domínio (`NEXT_PUBLIC_DOMAIN`, igual ao `DOMAIN` da API) e caminho
(`/`) com que a API o grava, e também a variante sem domínio. Em rota
privada, o sistema MUST redirecionar uma única vez para `/`. Em rota
pública, a página MUST ser exibida sem redirecionamento.

#### Scenario: Token expirado em rota privada
- **WHEN** um usuário com cookie cujo `exp * 1000 < Date.now()` acessa `/dashboard`
- **THEN** o middleware remove o cookie `@lexhub-auth` e redireciona para `/`

#### Scenario: Token expirado em rota pública
- **WHEN** um usuário com cookie cujo `exp * 1000 < Date.now()` acessa `/`
- **THEN** o middleware remove o cookie `@lexhub-auth` e a tela de login é exibida sem redirecionamento

#### Scenario: Cookie gravado pela API com domínio
- **WHEN** a sessão expira e o cookie foi gravado pela API com `domain = DOMAIN`
- **THEN** o cookie é de fato removido do navegador e a próxima requisição chega sem `@lexhub-auth`

### Requirement: Logout
O sistema MUST permitir encerrar a sessão pelo botão de saída no perfil da
barra lateral, após confirmação em diálogo, chamando `POST /agents/logout`.
O sistema MUST descartar todos os dados em cache e sair da área logada
mesmo quando a chamada de logout falhar (por exemplo, com 401 porque a
sessão já expirou). O usuário não pode ficar preso na área logada.

#### Scenario: Logout bem-sucedido
- **WHEN** o usuário confirma "Sair da conta"
- **THEN** o sistema descarta o cache de dados, exibe o toast "Sessão encerrada com sucesso!" e navega para `/?logout=true` com `router.replace`

#### Scenario: Falha no logout
- **WHEN** a chamada de logout falha
- **THEN** o sistema descarta o cache de dados e navega para `/?logout=true` com `router.replace`, sem exibir toast de erro

#### Scenario: Logout com a sessão já expirada
- **WHEN** o JWT já expirou e o usuário confirma "Sair da conta"
- **THEN** o usuário vai para `/` e a tela de login é exibida, sem toast de erro, com o cookie removido pela API ou pelo middleware

#### Scenario: Perfil indisponível
- **WHEN** `GET /agents/profile` falha na área logada (por exemplo, `401` porque o funcionário foi inativado)
- **THEN** a barra lateral exibe a ação "Sair" no lugar do menu do usuário, e ela abre o diálogo de confirmação de logout

## REMOVED Requirements

### Requirement: Renovação do cookie em rotas privadas
**Reason**: Regravar o cookie a cada navegação fazia o cookie durar mais
que o JWT. A regravação também podia criar um segundo `@lexhub-auth` com um
domínio diferente do da API, que o logout não apagava. Os dois efeitos
contribuíam para o loop de redirecionamento após a expiração.
**Migration**: Nenhuma ação do usuário. A validade do cookie passa a ser
só a definida pela API no login (1 dia, igual ao `exp` do JWT). Cookies
antigos gravados sem domínio são removidos pelo middleware quando a sessão
fica inválida.
