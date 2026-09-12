## ADDED Requirements

### Requirement: Temas claro, escuro e do sistema
O sistema MUST oferecer os temas "Claro", "Escuro" e "Sistema", sendo
"Sistema" o padrão, que acompanha a preferência `prefers-color-scheme` do
sistema operacional. A escolha MUST ficar salva no navegador e ser aplicada
antes da primeira pintura, sem piscar o tema errado.

#### Scenario: Primeiro acesso com sistema em modo escuro
- **WHEN** um usuário sem preferência salva abre o sistema com o sistema operacional em modo escuro
- **THEN** a interface é exibida no tema escuro

#### Scenario: Escolha manual persistida
- **WHEN** o usuário escolhe "Claro" no seletor de tema e recarrega a página
- **THEN** a interface continua no tema claro, independentemente da preferência do sistema operacional

#### Scenario: Sem flash de tema
- **WHEN** um usuário com o tema "Escuro" salvo carrega qualquer página
- **THEN** a página não é exibida no tema claro nem por um instante antes de ficar escura

### Requirement: Seletor de tema acessível
O sistema MUST disponibilizar o seletor de tema no cabeçalho da área logada,
no menu do usuário e nas telas públicas de autenticação. O seletor MUST
indicar a opção ativa e ter rótulo acessível ("Alternar tema").

#### Scenario: Troca de tema na tela de login
- **WHEN** um visitante na rota `/` escolhe "Escuro" no seletor de tema
- **THEN** a tela de login passa para o tema escuro

### Requirement: Paleta oficial da OAB
O sistema MUST usar como cores de marca as definidas no Manual de Identidade
Visual da OAB Nacional:
- azul Pantone 301 C como cor primária de ação;
- vermelho Pantone 485 C (`#D71920`) e 200 C como destaque;
- gradiente azul de `#003552` a `#65C1E3`;
- preto Pantone Black C.

Essas cores MUST ser expostas como tokens de tema. Os componentes MUST NOT
usar cores fixas que não se adaptam ao tema, como `text-white` sobre
superfícies que mudam de cor.

#### Scenario: Botão primário
- **WHEN** um botão de ação primária (ex.: "Novo Atendimento") é exibido no tema claro
- **THEN** seu fundo é o azul primário da marca e o texto é branco

#### Scenario: Componentes nos dois temas
- **WHEN** o usuário alterna entre os temas claro e escuro em qualquer tela
- **THEN** todos os textos, cards, tabelas, badges e diálogos continuam legíveis, sem texto claro sobre fundo claro nem texto escuro sobre fundo escuro

### Requirement: Contraste mínimo
O sistema MUST garantir contraste de pelo menos 4.5:1 (WCAG AA) entre o
texto e o fundo, e pelo menos 3:1 para ícones, bordas de campos e textos
grandes, nos dois temas.

#### Scenario: Texto secundário no tema escuro
- **WHEN** um texto com o token `muted-foreground` é exibido sobre `background` no tema escuro
- **THEN** a razão de contraste entre as duas cores é de pelo menos 4.5:1

### Requirement: Tipografia da marca
O sistema MUST usar a família Barlow no texto e nos componentes de interface,
e a família Montserrat (substituta da Gotham HTF) nos títulos de página, de
card e de diálogo. As fontes MUST ser servidas pelo próprio aplicativo, sem
depender de CDN externa em tempo de execução, e ter fallback sans-serif do
sistema.

#### Scenario: Título de página
- **WHEN** a página "Central de Atendimentos" é exibida
- **THEN** o título usa Montserrat e o texto da tabela usa Barlow

### Requirement: Logo da OAB Maranhão por tema
O sistema MUST continuar usando o logo atual da OAB Maranhão, sem
distorção, rotação ou alteração de proporções. No tema escuro MUST ser
usado o arquivo original (texto branco). No tema claro MUST ser usada a
variante do mesmo logo com o texto em preto da marca. O logo MUST ter
largura mínima de 120px quando exibido completo. Na barra lateral
recolhida MUST ser usado apenas o símbolo OAB.

#### Scenario: Logo no tema claro
- **WHEN** a tela de login é exibida no tema claro
- **THEN** o logo mostra "MARANHÃO" e o slogan em preto, legíveis sobre o fundo claro

#### Scenario: Logo no tema escuro
- **WHEN** a tela de login é exibida no tema escuro
- **THEN** o logo mostra "MARANHÃO" e o slogan em branco

#### Scenario: Barra lateral recolhida
- **WHEN** a barra lateral está recolhida em modo ícone
- **THEN** o topo da barra exibe apenas o símbolo OAB (globo e letras "AB"), sem cortar o desenho

### Requirement: Elementos gráficos da marca
O sistema MUST aplicar os elementos gráficos do manual de forma decorativa:
a onda azul e vermelha nos cantos e o contorno "OAB" da marca simplificada
como marca d'água. Esses elementos MUST ser ocultos para leitores de tela
(`aria-hidden`) e MUST NOT competir com o conteúdo.

#### Scenario: Painel da tela de login
- **WHEN** a tela de login é exibida em tela larga
- **THEN** o painel institucional exibe o logo, a onda azul e vermelha e o contorno "OAB" em marca d'água

### Requirement: Densidade compacta da interface
O sistema MUST usar densidade compacta, no estilo de consoles
administrativos: campos, selects e botões padrão com 32px de altura, texto
base de 14px e 13px nos controles e tabelas, raio de 6px, cards e tabelas
com borda fina e sombra mínima, e cabeçalho da área logada com 48px. Em
telas com menos de 768px, os campos de texto MUST usar 16px, para o
navegador do celular não ampliar a página ao focar o campo.

#### Scenario: Controles no desktop
- **WHEN** a "Central de Atendimentos" é aberta numa tela de 1440px
- **THEN** os campos de filtro e o botão "Filtrar resultados" têm 32px de altura, o cabeçalho da tabela tem 36px e o cabeçalho da área logada tem 48px

#### Scenario: Campo focado no celular
- **WHEN** o usuário toca num campo de filtro numa tela de 390px
- **THEN** o texto do campo tem 16px e a página não é ampliada

### Requirement: Badges com significado além da cor
Todo badge de status MUST ter texto e, quando indicar um estado, um ícone
ou marcador, para a cor não ser o único meio de distinção. As variantes
suaves (`success`, `warning`, `danger`, `info`, `sky`, `neutral`) MUST ter
contraste de pelo menos 4.5:1 entre o texto e o fundo do badge nos dois
temas, inclusive sobre a linha da tabela em hover.

#### Scenario: Status lado a lado
- **WHEN** um atendimento em andamento e um concluído aparecem na mesma tabela
- **THEN** o primeiro mostra um marcador pulsante e "Em andamento" em âmbar, e o segundo um ícone de check e "Concluído" em verde

#### Scenario: Movimento reduzido
- **WHEN** o sistema operacional pede movimento reduzido
- **THEN** o marcador de "Em andamento" fica estático
