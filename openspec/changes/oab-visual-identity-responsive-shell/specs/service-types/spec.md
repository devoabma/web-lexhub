## MODIFIED Requirements

### Requirement: Listagem de tipos de serviço
O sistema MUST listar os tipos de serviço via `GET /services/types/all`,
paginados em 10 itens por página, exibindo por linha o nome, o
identificador e a ação "Alterar". Abaixo de 768px, o identificador MUST
aparecer abaixo do nome.

#### Scenario: Lista com resultados
- **WHEN** a API retorna tipos de serviço
- **THEN** cada linha mostra o nome, o identificador em fonte monoespaçada e o botão "Alterar", e o rodapé mostra "Total de N serviço(s)"

#### Scenario: Lista vazia
- **WHEN** a API retorna nenhum tipo
- **THEN** a tabela exibe "Não encontramos nenhum tipo de serviço cadastrado." com a dica "Ajuste os filtros ou cadastre um novo serviço."

### Requirement: Copiar identificador e nome
O sistema MUST oferecer, ao lado do identificador e do nome, um botão que
copia o valor para a área de transferência. Quando a Clipboard API não
existir ou negar a permissão, o sistema MUST usar o método alternativo de
cópia. Após copiar, o ícone MUST mudar para "confirmado" por 2 segundos.

#### Scenario: Copiar identificador
- **WHEN** o usuário clica no botão de copiar do identificador
- **THEN** o identificador é copiado e o ícone muda para um check por 2 segundos

#### Scenario: Permissão negada
- **WHEN** o navegador nega a permissão de escrita na área de transferência
- **THEN** o valor é copiado pelo método alternativo e o ícone muda para um check

### Requirement: Criar tipo de serviço
O sistema MUST permitir criar um tipo de serviço informando um nome não
vazio no Drawer "Novo Serviço" (pela direita no desktop e por baixo no
celular), via `POST /services/types`.

#### Scenario: Criação bem-sucedida
- **WHEN** o administrador informa o nome e clica em "Criar Novo"
- **THEN** o Drawer é fechado, é exibido o toast "Novo serviço registrado com sucesso!" e a listagem é recarregada

#### Scenario: Nome vazio
- **WHEN** o administrador tenta criar sem informar o nome
- **THEN** o sistema exibe "O nome é obrigatório." e não envia a requisição

#### Scenario: Erro da API
- **WHEN** a API retorna erro (ex.: nome duplicado)
- **THEN** o sistema limpa o formulário e exibe o toast "Houve um erro ao registrar o novo serviço!" com a mensagem da API
