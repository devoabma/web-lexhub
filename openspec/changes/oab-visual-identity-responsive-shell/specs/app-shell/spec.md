## ADDED Requirements

### Requirement: Barra lateral recolhível
O sistema MUST exibir a navegação da área logada numa barra lateral que o
usuário pode alternar entre "expandida" (ícones e rótulos) e "recolhida"
(somente ícones). A alternância MUST funcionar pelo botão do cabeçalho e
pelo atalho `Ctrl+B` (ou `Cmd+B` no macOS).

#### Scenario: Recolher a barra
- **WHEN** o usuário, com a barra expandida numa tela de 1280px, clica no botão de alternar a barra lateral
- **THEN** a barra passa a mostrar só os ícones, e o conteúdo principal ocupa a largura liberada

#### Scenario: Tooltip na barra recolhida
- **WHEN** a barra está recolhida e o usuário passa o mouse ou foca o ícone "Atendimentos"
- **THEN** um tooltip com o texto "Atendimentos" é exibido

#### Scenario: Atalho de teclado
- **WHEN** o usuário pressiona `Ctrl+B` em qualquer página da área logada
- **THEN** a barra lateral alterna entre expandida e recolhida

### Requirement: Persistência do estado da barra lateral
O sistema MUST lembrar entre visitas se a barra lateral está expandida ou
recolhida (cookie `sidebar_state`, 7 dias). O estado MUST ser aplicado já
na renderização no servidor, sem a barra "pular" ao carregar.

#### Scenario: Recarregar com a barra recolhida
- **WHEN** o usuário recolhe a barra e recarrega a página
- **THEN** a página já é renderizada com a barra recolhida

### Requirement: Navegação em celulares
Em telas com menos de 768px de largura, o sistema MUST ocultar a barra
lateral e oferecer no cabeçalho um botão que a abre como painel
deslizante sobre o conteúdo. O painel MUST fechar ao escolher um item de
navegação, ao tocar fora dele ou ao pressionar `Esc`.

#### Scenario: Abrir o menu no celular
- **WHEN** o usuário, numa tela de 390px, toca no botão de menu do cabeçalho
- **THEN** a barra lateral abre como painel deslizante pela esquerda

#### Scenario: Navegar pelo menu no celular
- **WHEN** com o painel aberto, o usuário toca em "Atendimentos"
- **THEN** o sistema navega para `/services` e fecha o painel

### Requirement: Cabeçalho da área logada
O sistema MUST exibir no topo de toda página da área logada um cabeçalho
fixo (visível durante a rolagem) com: o botão de alternar a barra lateral,
o título da seção atual e o seletor de tema.

#### Scenario: Rolagem longa
- **WHEN** o usuário rola até o fim da listagem de atendimentos
- **THEN** o cabeçalho continua visível no topo, com o botão de menu e o seletor de tema

#### Scenario: Título da seção
- **WHEN** o usuário está em `/services-types`
- **THEN** o cabeçalho exibe "Controle de Serviços"

### Requirement: Layout responsivo das páginas
Todas as páginas MUST ser utilizáveis a partir de 360px de largura, sem
rolagem horizontal da página. Tabelas largas MAY rolar horizontalmente
dentro do próprio contêiner. Em telas estreitas, os títulos com botões de
ação MUST empilhar, os filtros MUST ocupar a largura total e a paginação
MUST quebrar em linhas.

#### Scenario: Listagem de atendimentos no celular
- **WHEN** a "Central de Atendimentos" é aberta numa tela de 360px
- **THEN** a página não rola na horizontal, os botões "Atendimento Externo" e "Novo Atendimento" ficam visíveis abaixo do título, os filtros ocupam a largura total e a tabela mostra o nome, a OAB, o status e as ações sem rolagem horizontal

#### Scenario: Dashboard no tablet
- **WHEN** o dashboard é aberto numa tela de 768px
- **THEN** os cards de métricas aparecem em duas colunas e o gráfico ocupa a largura total

#### Scenario: Diálogos no celular
- **WHEN** o diálogo "Detalhes do Atendimento" é aberto numa tela de 360px
- **THEN** o diálogo cabe na largura da tela e seu conteúdo rola verticalmente, com o botão "Fechar" alcançável

### Requirement: Telas de autenticação responsivas
O sistema MUST exibir nas telas públicas (login, recuperação e redefinição de
senha, confirmação de e-mail) um painel institucional ao lado do formulário
em telas de 1024px ou mais. Em telas menores, MUST exibir só o formulário,
com o logo acima dele.

#### Scenario: Login no celular
- **WHEN** a tela de login é aberta numa tela de 390px
- **THEN** o logo aparece acima do formulário, o formulário ocupa a largura disponível com margens laterais e não há rolagem horizontal

#### Scenario: Login no desktop
- **WHEN** a tela de login é aberta numa tela de 1440px
- **THEN** o painel institucional aparece à esquerda e o formulário à direita

### Requirement: Formulários de cadastro em Drawer
Os formulários "Novo Funcionário" e "Novo Serviço" MUST abrir num Drawer:
pela direita em telas de 768px ou mais e por baixo em telas menores. O
Drawer MUST ter cabeçalho, conteúdo com rolagem própria e rodapé com
"Cancelar" e a ação principal, e MUST fechar com `Esc`, com "Cancelar",
tocando fora dele ou, na versão lateral, pelo botão de fechar.

#### Scenario: Cadastro no desktop
- **WHEN** o administrador clica em "Novo Funcionário" numa tela de 1440px
- **THEN** o formulário abre num painel pela direita, com "Cancelar" e "Criar Novo" no rodapé

#### Scenario: Cadastro no celular
- **WHEN** o administrador toca em "Novo Serviço" numa tela de 390px
- **THEN** o formulário abre por baixo, com a alça de arraste no topo

#### Scenario: Erro de validação no Drawer
- **WHEN** o administrador envia o formulário com o nome vazio
- **THEN** a mensagem "O nome é obrigatório." aparece em vermelho (`--destructive`) abaixo do campo

### Requirement: Padrão das tabelas de listagem
As listagens (atendimentos, tipos de serviço e funcionários) MUST seguir um
padrão único:
- tabela num card com borda, cabeçalho em caixa alta miúda e sem divisórias
  verticais;
- ações da linha à direita: a ação principal visível e as demais num menu
  "⋯";
- estado vazio com ícone, mensagem e uma dica de próximo passo;
- paginação no rodapé do card.

Em telas estreitas, as colunas secundárias MUST ser ocultadas e seus dados
essenciais MUST ir para a primeira célula, mantendo as ações visíveis sem
rolagem horizontal a partir de 360px.

#### Scenario: Lista vazia
- **WHEN** um filtro não retorna nenhum atendimento
- **THEN** a tabela exibe um ícone, "Não encontramos nenhum atendimento cadastrado." e a dica "Ajuste os filtros ou registre um novo atendimento."

#### Scenario: Ações no celular
- **WHEN** a lista de funcionários é aberta numa tela de 390px
- **THEN** cargo e situação aparecem como badges abaixo do e-mail, e o menu "⋯" de cada linha fica visível sem rolar a tabela
