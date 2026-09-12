## Why

A interface do LexHub tem três problemas:

- A barra lateral é fixa em 280px e o layout não se adapta a telas menores,
  então o sistema fica inutilizável em tablets e celulares.
- Só existe um tema escuro, e ele usa cores fixas (`slate-800`, `text-white`,
  `sky-700`) espalhadas pelos componentes.
- A identidade visual (fontes CalSans e Inter, azul `sky`) não segue o Manual
  de Identidade Visual da OAB Nacional.

Como a atualização do sistema vai mexer em todas as telas, é o momento de
padronizar a identidade visual antes das próximas mudanças.

## What Changes

- **Nova barra lateral** com o componente `Sidebar` do shadcn/ui:
  - pode ser recolhida para mostrar só ícones, com tooltips;
  - lembra o estado aberto/recolhido entre visitas (cookie);
  - atalho de teclado `Ctrl/Cmd + B`;
  - no celular vira um painel deslizante (sheet);
  - os itens de administrador ficam num grupo próprio, "Administração".
- **Cabeçalho da área logada**, fixo no topo, com botão de abrir/recolher a
  barra lateral, título da página atual e seletor de tema.
- **Menu do usuário** no rodapé da barra lateral, que reúne perfil, troca de
  tema e "Sair". O diálogo de confirmação de logout continua.
- **Tema claro, escuro e "seguir o sistema"**, com `next-themes`. O padrão é
  seguir o sistema, e a escolha fica salva no navegador.
- **Identidade visual do Manual da OAB**, que substitui toda a paleta atual:
  - cores oficiais: azul Pantone 301 C, vermelho Pantone 485 C / 200 C,
    gradiente azul (`#003552` → `#65C1E3`) e preto Pantone Black C, como
    tokens de tema;
  - tipografia: Barlow no corpo e na interface, Montserrat nos títulos. A
    Montserrat é a substituta gratuita da Gotham HTF, que é licenciada.
    **BREAKING** (visual): CalSans e Inter deixam de ser usadas;
  - elementos gráficos do manual: a onda azul/vermelha e o contorno "OAB" da
    marca simplificada, usados na tela de login e nos cabeçalhos.
- **Logo**: continua o atual (OAB Maranhão). Adiciona-se uma variante do
  mesmo arquivo com o texto em preto para fundos claros, e um recorte só do
  símbolo para a barra lateral recolhida.
- **Responsividade em todas as telas** (login e recuperação de senha,
  dashboard, atendimentos, tipos de serviço, funcionários, diálogos,
  filtros, tabelas e paginação), a partir de 360px de largura.
- **Fim das cores fixas**: todos os componentes passam a usar os tokens de
  tema, para funcionar nos dois temas.
- **Densidade compacta** (acrescentada durante a implementação, a pedido do
  usuário, no estilo de consoles como o do Neon): controles de 32px, texto de
  13–14px, raio de 6px, cards planos, cabeçalho da área logada com 48px e
  cabeçalho de página enxuto (título + descrição + ações).
- **Drawer no lugar do Sheet**: "Novo Funcionário" e "Novo Serviço" passam a
  abrir num Drawer (`vaul`), pela direita no desktop e por baixo no celular.
  O Sheet continua só dentro da barra lateral do shadcn, no celular.
- **Tabelas repaginadas**:
  - cabeçalho em caixa alta miúda, linhas mais baixas e sem divisórias
    verticais;
  - badges com ícone ou marcador;
  - ações em "⋯", com a ação principal visível;
  - estado vazio ilustrado e paginação no rodapé do card;
  - no celular, as colunas secundárias vão para a primeira célula.

  Status "Encerrado" (vermelho) passa a "Concluído" (verde), igual ao filtro
  e aos detalhes.

Mudança **somente de frontend**. Nenhuma alteração de API.

## Capabilities

### New Capabilities

- `visual-identity`: temas claro/escuro/sistema, paleta e tipografia do
  Manual da OAB, uso do logo por tema e contraste mínimo.
- `app-shell`: estrutura da área logada, com barra lateral recolhível e
  responsiva, cabeçalho, menu do usuário e comportamento em celular e tablet.

### Modified Capabilities

- `access-control`: o requisito "Menu lateral por papel" passa a exigir o
  grupo "Administração" e a navegação na barra recolhida e no celular. O
  requisito "Perfil do usuário logado" passa a valer para o menu do usuário
  com a barra expandida ou recolhida. "Permissões sobre atendimentos" deixa
  de exibir "Concluir" em atendimentos concluídos.
- `service-management`: nova composição da linha da listagem (nome clicável
  com a OAB abaixo, status "Concluído", ações em "⋯").
- `agent-management`: listagem com avatar, badges "Administrador"/"Membro" e
  "Ativo"/"Inativo" e menu "⋯"; cadastro em Drawer.
- `service-types`: nome antes do identificador, cópia com fallback também
  quando a permissão é negada, e cadastro em Drawer.

## Impact

- **Dependências novas**: `next-themes`, `radix-ui` (pacote unificado do
  Radix, usado pelos componentes novos do shadcn) e `vaul` (base do Drawer). As fontes Barlow e
  Montserrat vêm do `next/font/google`, servidas pelo próprio app, sem CDN
  em tempo de execução.
- **Componentes shadcn**: `sidebar`, `dropdown-menu`, `tooltip`, `sonner` e
  o hook `use-mobile` são adicionados. `button`, `input`,
  `separator` e `sheet` são atualizados para a versão atual, com ajustes de
  tema escuro.
- **Código**:
  - `src/app/globals.css`: tokens de tema reescritos;
  - `src/app/layout.tsx`: fontes, `ThemeProvider` e `Toaster` com tema;
  - `src/app/(private)/(app)/layout.tsx`: nova estrutura;
  - `src/app/(public)/(auth)/layout.tsx`: nova tela de login;
  - todos os componentes de página que usam cores fixas ou o `font-calsans`
    (cerca de 45 ocorrências).
- **Removidos**: `public/fonts/CalSans-SemiBold.ttf` e os componentes
  antigos da barra lateral (`sidebar-menu.tsx`, `nav-item.tsx`,
  `profile.tsx`), substituídos.
- **Assets novos**: `src/assets/logo-oabma-light.png` (texto em preto) e
  `src/assets/logo-oabma-symbol.png` (só o símbolo), os dois derivados do
  logo atual.
- **Specs**: `openspec/specs/access-control`, `service-management`,
  `agent-management` e `service-types`, e as novas `visual-identity` e
  `app-shell`.
- **Relação com outras changes**: independente de
  `upgrade-nextjs-security-patches`. Aquela change continua pendente e deve
  ser aplicada logo depois desta, porque o Next 15.2.2 continua vulnerável.
