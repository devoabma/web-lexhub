# authentication Specification

## Purpose

Descreve como funcionários(as) acessam o LexHub: login com e-mail e senha,
manutenção da sessão via cookie JWT emitido pelo backend, encerramento de
sessão (logout) e o fluxo de recuperação de senha por código enviado por
e-mail. Rotas: `/`, `/forgot-password`, `/confirm-send-email`,
`/reset-password`.

## Requirements

### Requirement: Login com e-mail e senha
O sistema MUST permitir que um(a) funcionário(a) cadastrado(a) se autentique
informando e-mail e senha na rota `/`, enviando `POST /agents/sessions`. A
sessão MUST ser estabelecida pelo cookie httpOnly `@lexhub-auth` definido pelo
backend (a requisição usa `withCredentials`); o frontend não armazena o token
retornado no corpo da resposta.

#### Scenario: Credenciais válidas
- **WHEN** o usuário envia e-mail e senha válidos
- **THEN** o sistema exibe o toast "Acesso concedido." e redireciona para `/dashboard` usando `router.replace`

#### Scenario: Credenciais rejeitadas pela API
- **WHEN** a API responde com erro
- **THEN** o sistema limpa o formulário e exibe o toast "Acesso negado!" com a mensagem `response.data.message` retornada pela API

#### Scenario: Validação local do formulário
- **WHEN** o e-mail é inválido ou a senha tem menos de 8 caracteres
- **THEN** o sistema exibe a mensagem de erro abaixo do campo e desabilita o botão "Entrar no sistema"

### Requirement: Expiração da sessão
O sistema MUST considerar a sessão encerrada quando o campo `exp` do JWT no
cookie `@lexhub-auth` estiver no passado, removendo o cookie e redirecionando
para `/` em qualquer rota.

#### Scenario: Token expirado
- **WHEN** um usuário com cookie cujo `exp * 1000 < Date.now()` acessa qualquer rota
- **THEN** o middleware apaga o cookie `@lexhub-auth` e redireciona para `/`

### Requirement: Renovação do cookie em rotas privadas
O sistema MUST regravar o cookie `@lexhub-auth` a cada acesso a uma rota
privada com as opções `httpOnly`, `sameSite=lax`, `path=/`, `secure` apenas em
produção, `domain=NEXT_PUBLIC_DOMAIN` e `maxAge` de 1 dia.

#### Scenario: Navegação autenticada
- **WHEN** um usuário autenticado com token não expirado acessa `/dashboard`
- **THEN** a resposta inclui o cookie `@lexhub-auth` com o mesmo valor e validade de 24 horas

### Requirement: Logout
O sistema MUST permitir encerrar a sessão pelo botão de saída no perfil da
barra lateral, após confirmação em diálogo, chamando `POST /agents/logout`.

#### Scenario: Logout bem-sucedido
- **WHEN** o usuário confirma "Sair da conta"
- **THEN** o sistema exibe o toast "Sessão encerrada com sucesso!" e navega para `/?logout=true` com `router.replace`

#### Scenario: Falha no logout
- **WHEN** a chamada de logout falha
- **THEN** o sistema exibe o toast "Houve um erro ao se deslogar!" e mantém o usuário na página

### Requirement: Solicitação de recuperação de senha
O sistema MUST permitir que o usuário informe seu e-mail cadastrado em
`/forgot-password` para receber um código de redefinição, via
`POST /agents/password/recover`.

#### Scenario: Solicitação aceita
- **WHEN** o usuário envia um e-mail válido e a API responde com sucesso
- **THEN** o sistema redireciona para `/confirm-send-email?email=<e-mail codificado>`, que exibe "E-mail enviado" com o endereço informado e um link "Voltar para o login"

#### Scenario: Solicitação falha
- **WHEN** a API responde com erro
- **THEN** o sistema limpa o formulário e exibe o toast "Não foi possível redefinir a senha."

### Requirement: Redefinição de senha com código
O sistema MUST permitir definir uma nova senha em `/reset-password` informando
o código de verificação (mínimo 6 caracteres), a nova senha e a confirmação
(ambas com mínimo 8 caracteres e iguais), via `POST /agents/password/reset`.
O campo de código MUST ser pré-preenchido quando a URL contém `?code=`.

#### Scenario: Link com código
- **WHEN** o usuário abre `/reset-password?code=ABC123`
- **THEN** o campo "Código de verificação" já vem preenchido com `ABC123`

#### Scenario: Redefinição bem-sucedida
- **WHEN** o usuário envia código, senha e confirmação válidos
- **THEN** o sistema exibe o toast "Senha redefinida com sucesso!" e navega para `/?reset-password=true`

#### Scenario: Senhas diferentes
- **WHEN** a senha e a confirmação não coincidem
- **THEN** o formulário não é enviado (erro "As senhas não coincidem" associado ao campo de confirmação)
