# service-types Specification

## Purpose

Descreve o "Controle de Serviços" (`/services-types`), área exclusiva de
administradores para manter o catálogo de tipos de serviço usados na
classificação dos atendimentos: listagem paginada com filtros, cópia rápida
de identificador e nome, criação e renomeação. Não há exclusão de tipos.

## Requirements

### Requirement: Listagem de tipos de serviço
O sistema MUST listar os tipos de serviço via `GET /services/types/all`,
paginados em 10 itens por página, exibindo o identificador e o nome de cada
tipo e uma ação "Alterar".

#### Scenario: Lista com resultados
- **WHEN** a API retorna tipos de serviço
- **THEN** cada linha mostra o identificador em fonte monoespaçada, o nome e o botão "Alterar", e o rodapé mostra "Total de N serviço(s)"

#### Scenario: Lista vazia
- **WHEN** a API retorna nenhum tipo
- **THEN** a tabela exibe "Não encontramos nenhum tipo de serviço cadastrado."

### Requirement: Filtros de tipos de serviço
O sistema MUST permitir filtrar por identificador e por nome, persistindo os
filtros na URL (`id`, `name`) e voltando para a página 1 ao aplicar.

#### Scenario: Filtrar por nome
- **WHEN** o usuário digita "Certidão" e clica em "Filtrar resultados"
- **THEN** a URL passa a conter `name=Certidão&page=1` e a lista é recarregada

#### Scenario: Remover filtros
- **WHEN** o usuário clica em "Remover filtros"
- **THEN** a URL passa a conter apenas `page=1` e os campos são limpos

### Requirement: Copiar identificador e nome
O sistema MUST oferecer, em cada célula de identificador e de nome, um botão
que copia o valor para a área de transferência, com fallback para navegadores
sem a Clipboard API, alternando o ícone para "confirmado" por 2 segundos.

#### Scenario: Copiar identificador
- **WHEN** o usuário clica no botão de copiar da célula de identificador
- **THEN** o identificador é copiado e o ícone muda para um check por 2 segundos

### Requirement: Criar tipo de serviço
O sistema MUST permitir criar um tipo de serviço informando um nome não vazio
em um painel lateral "Novo Serviço", via `POST /services/types`.

#### Scenario: Criação bem-sucedida
- **WHEN** o administrador informa o nome e clica em "Criar Novo"
- **THEN** o painel é fechado, é exibido o toast "Novo serviço registrado com sucesso!" e a listagem é recarregada

#### Scenario: Nome vazio
- **WHEN** o administrador tenta criar sem informar o nome
- **THEN** o sistema exibe "O nome é obrigatório." e não envia a requisição

#### Scenario: Erro da API
- **WHEN** a API retorna erro (ex.: nome duplicado)
- **THEN** o sistema limpa o formulário e exibe o toast "Houve um erro ao registrar o novo serviço!" com a mensagem da API

### Requirement: Renomear tipo de serviço
O sistema MUST permitir alterar o nome de um tipo de serviço em um diálogo
"Editar Tipo de Serviço" pré-preenchido, via
`PUT /services/types/update/:id`.

#### Scenario: Alteração bem-sucedida
- **WHEN** o administrador altera o nome e clica em "Salvar alterações"
- **THEN** o diálogo é fechado, é exibido o toast "Tipo de Serviço atualizado com sucesso!" e a listagem é recarregada
