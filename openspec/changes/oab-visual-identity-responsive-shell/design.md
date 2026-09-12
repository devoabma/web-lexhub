## Context

- Layout privado atual:
  - `grid-cols-[280px_1fr]`, com a barra lateral (`SidebarMenu`, `NavItem`,
    `Profile`) sempre visível;
  - não há cabeçalho;
  - não há versão para celular.
- O tema atual é só escuro. Os tokens de escuro ficam direto em `:root`, não
  há `.dark`, e o `Toaster` é fixo em `theme="dark"`. Os componentes usam
  cores fixas (`bg-slate-800/60`, `text-white`, `bg-sky-700`, `text-slate-*`)
  em cerca de 45 lugares.
- Fontes atuais: Inter (corpo) e CalSans (`font-calsans`, títulos).
- Logo atual: `src/assets/logo-oabma.png` (1071×337, RGBA). Tem o símbolo
  OAB, "MARANHÃO" e o slogan "FORTE E AO SEU LADO", com o texto em branco,
  então só funciona em fundo escuro.
- Manual de Identidade Visual da OAB Nacional (PDF fornecido):
  - **Cores compostas**:
    - azul em gradiente: escuro `#003552` (C100 M75 Y40 K40) e claro
      `#65C1E3` (C55 M5 Y5 K0);
    - vermelho em gradiente: escuro `#910D11` e claro Pantone 485 C
      `#D71920`;
    - preto `#000`.
  - **Cores sólidas**: azul Pantone 301 C, vermelho Pantone 200 C e Pantone
    Black C.
  - **Complementos institucionais**: CMYK 100 60 10 10.
  - **Tipografia**: Barlow e Gotham HTF. Complementos da marca em Gotham
    Book. O nome do estado no logo em Barlow Semi Condensed Bold.
  - **Elementos**: onda azul/vermelha nos cantos das peças e "OAB" em
    contorno como marca d'água.
  - **Regras**: área de proteção ao redor do logo; proibido distorcer,
    rotacionar, reposicionar elementos ou trocar a tipografia do logo;
    redução mínima de 2,5 cm.
- Decisões do usuário: Montserrat no lugar da Gotham HTF; variante do logo
  com texto escuro para o tema claro; tema padrão "Sistema"; propor e
  implementar em seguida.

## Goals / Non-Goals

**Goals:**
- Área logada com a `Sidebar` do shadcn: recolhível para ícones,
  persistente, painel deslizante no celular, cabeçalho fixo.
- Temas claro, escuro e sistema, sem flash de tema, com tokens únicos para
  todos os componentes.
- Paleta e tipografia do manual aplicadas com contraste AA verificado.
- Todas as telas utilizáveis a partir de 360px.

**Non-Goals:**
- Trocar o logo ou redesenhar a marca.
- Mudar fluxos, textos de negócio, endpoints ou queryKeys do React Query.
  Nenhuma invalidação de cache é alterada.
- Corrigir os bugs funcionais listados em `docs/tech-debt.md` (itens 2 a
  13). Só entram os que atrapalham a responsividade.
- Atualizar o Next.js (fica para a change `upgrade-nextjs-security-patches`).
- Migrar os componentes antigos do shadcn para o pacote `radix-ui`. Só os
  componentes novos ou regenerados passam a usá-lo.

## Decisions

### 1. Sidebar do shadcn, com os arquivos passando por uma sandbox
A CLI atual (`shadcn@4.21`) gera imports de `cn` a partir do pacote npm
`cn` (novo, do próprio shadcn) e dos primitivos a partir de `radix-ui`.

- **Escolhido**: gerar os arquivos numa cópia isolada do projeto, copiar
  para o repositório e trocar o import de `cn` por `@/lib/utils`. Assim a
  dependência `cn` não entra e fica uma única função `cn` no projeto. O
  pacote `radix-ui` (oficial do Radix) é adicionado.
- **Arquivos**:
  - novos: `sidebar`, `dropdown-menu`, `tooltip`, `sonner` e
    `hooks/use-mobile`;
  - atualizados: `button`, `input`, `separator` e `sheet`. Eram shadcn sem
    customização, e a diff confirma que as versões novas só acrescentam
    variantes de tema escuro e novos tamanhos;
  - `badge.tsx`, que tem as variantes customizadas `open`/`closed`, **não**
    é regenerado.
- **Alternativa descartada**: `shadcn add --overwrite` direto no
  repositório, porque adicionaria a dependência `cn` e poderia sobrescrever
  arquivos customizados.

### 2. Estrutura da área logada
```
SidebarProvider (defaultOpen ← cookie sidebar_state, lido no layout server)
├── AppSidebar (collapsible="icon")
│   ├── SidebarHeader  → BrandLogo (completo | símbolo quando recolhida)
│   ├── SidebarContent → grupo "Menu" + grupo "Administração" (se ADMIN)
│   └── SidebarFooter  → NavUser (DropdownMenu: perfil, tema, Sair → LogoutDialog)
└── SidebarInset
    ├── AppHeader (sticky): SidebarTrigger | título da seção | ThemeToggle
    └── <main> px-4 py-6 md:px-6 lg:px-8, max-w-screen-2xl
```
- `AppSidebar` recebe `hasPrivilegedAccess` do layout, que continua usando
  `checkAdminStatus()` no servidor.
- A lista de navegação (título, rota, ícone, `adminOnly`) fica num único
  arquivo `nav-config.ts`. A barra usa essa lista, e o `AppHeader` tira dela
  o título da seção (`getRouteTitle(usePathname())`).
- No celular, cada item chama `setOpenMobile(false)` ao ser clicado.
- `isActive` compara a rota atual com a do item e adiciona
  `aria-current="page"`.
- Os componentes novos ficam em `src/components/app/shell/`
  (`app-sidebar`, `app-header`, `nav-user`, `logout-dialog`,
  `nav-config`). São removidos `sidebar-menu.tsx`, `nav-item.tsx` e
  `profile.tsx` de `dashboard/components/sidebar/`.
- O `Profile` antigo usava `['profile']` com `staleTime: Infinity`. O
  `NavUser` mantém exatamente essa query (fora do escopo, ver
  `tech-debt.md` item 3).

### 3. Tema com `next-themes`
- `ThemeProvider` com `attribute="class"`, `defaultTheme="system"`,
  `enableSystem` e `disableTransitionOnChange`, dentro do `ClientProvider`.
  O `<html>` recebe `suppressHydrationWarning`.
- O `next-themes` injeta um script inline que aplica a classe antes da
  pintura, o que atende ao requisito de não piscar o tema.
- O `Toaster` passa a ser o `components/ui/sonner.tsx`, que lê o
  `resolvedTheme`, mantendo `richColors` e `closeButton`.
- O `ThemeToggle` é um `DropdownMenu` com Claro, Escuro e Sistema, e o
  ícone Sol/Lua é trocado via CSS (`dark:`), para não depender de montagem
  no cliente.
- **Alternativa descartada**: implementação própria com `localStorage`.
  Exigiria recriar o script anti-flash e a sincronização entre abas.

### 4. Tokens de tema
Valores em hex rastreáveis ao manual. Contraste calculado com a fórmula
WCAG 2.x: texto ≥ 4.5 e `input` ≥ 3.

| Token | Claro | Escuro | Origem / contraste |
| --- | --- | --- | --- |
| `--background` | `#F6F8FB` | `#07121C` | neutro frio / navy derivado de `#003552` |
| `--foreground` | `#16191F` | `#E6EDF4` | 16.5 / 16.0 |
| `--card`, `--popover` | `#FFFFFF` | `#0C1A27` | |
| `--primary` | `#004B87` | `#65C1E3` | Pantone 301 C / azul claro do gradiente |
| `--primary-foreground` | `#FFFFFF` | `#002235` | 8.9 / 8.0 |
| `--secondary` | `#E9EEF5` | `#13263A` | |
| `--muted` | `#EEF2F6` | `#12212F` | |
| `--muted-foreground` | `#566173` | `#93A4B7` | 5.9 / 7.4 no background |
| `--accent` / `-foreground` | `#E6EEF7` / `#003552` | `#152A3F` / `#E6EDF4` | 11.0 / 12.4 |
| `--destructive` | `#BA0C2F` | `#F0555B` | Pantone 200 C / 5.2 no card |
| `--border` | `#DCE3EC` | `#1D3347` | divisória (decorativa) |
| `--input` | `#7B8AA0` | `#56758F` | 3.5 / 3.6 (componente de UI) |
| `--ring` | `#004B87` | `#65C1E3` | |
| `--brand-blue` | `#004B87` | `#004B87` | Pantone 301 C |
| `--brand-navy` | `#003552` | `#003552` | gradiente azul (escuro) |
| `--brand-sky` | `#65C1E3` | `#65C1E3` | gradiente azul (claro) |
| `--brand-red` | `#D71920` | `#D71920` | Pantone 485 C |
| `--brand-red-dark` | `#910D11` | `#910D11` | gradiente vermelho (escuro) |
| `--brand-black` | `#231F20` | `#231F20` | Pantone Black C |
| `--success` | `#047857` | `#34D399` | 5.5 / 9.2 |
| `--warning` | `#A34A08` | `#FBBF24` | 5.6 / 10.6; ≥ 4.9 no badge suave (decisão 12) |
| `--chart-1..5` | 301 C, 485 C, sky, navy, `#910D11` | sky, `#F0555B`, `#3B8FD0`, `#A8DCF0`, `#B8363B` | |
| `--sidebar` | `#FFFFFF` | `#051019` | |
| `--sidebar-primary` | `#004B87` | `#65C1E3` | |
| `--sidebar-accent` | `#EAF1F8` | `#11263A` | primary sobre accent: 7.8 / 7.6 |

- Os tokens de marca não mudam entre temas, porque são cores de identidade.
  São expostos no Tailwind como `bg-brand-red`, `text-brand-navy` e
  similares.
- `--radius` passa a `0.375rem` (6px, densidade compacta, decisão 10).
- **Estrutura do CSS**: `:root` com o tema claro, `.dark` com o escuro, e o
  `@custom-variant dark` ajustado para
  `(&:where(.dark, .dark *))`.
- A scrollbar usa os tokens em vez das cores `slate` fixas.
- **Uso do vermelho**: é cor de marca, não de erro. Aparece como
  indicador do item ativo na navegação, na onda e na 2ª série dos
  gráficos. Erros continuam em `--destructive` (Pantone 200 C), que é
  distinguível pelo contexto.

### 5. Tipografia
- `next/font/google`:
  - Barlow, pesos 400, 500, 600 e 700, na variável `--font-barlow`;
  - Montserrat, pesos 500, 600 e 700, na variável `--font-montserrat`;
  - ambas com `display: 'swap'` e subsets `latin` e `latin-ext`, para os
    acentos do português.
- As fontes são auto-hospedadas pelo Next no build, sem CDN em runtime.
- No `@theme`: `--font-sans: var(--font-barlow), ui-sans-serif,
  system-ui, sans-serif` e `--font-heading: var(--font-montserrat),
  var(--font-barlow), sans-serif`.
- Toda ocorrência de `font-calsans` vira `font-heading`. O `@font-face` e o
  arquivo CalSans são removidos.
- **Alternativa descartada**: Gotham HTF, por ser licenciada (decisão do
  usuário). A troca fica isolada em `layout.tsx`, no `next/font/local`, se
  a OAB-MA fornecer os arquivos.

### 6. Logo por tema
- `scripts/generate-logo-variants.py` (Pillow) gera, a partir do original,
  dois arquivos:
  - `logo-oabma-light.png`: os pixels brancos da **área do texto**
    ("MARANHÃO", com y ≥ 242, e o slogan, com x ≥ 560) são recoloridos para
    `#231F20`, preservando o alfa. O globo não entra no recorte, então a
    faixa "ORDEM DOS ADVOGADOS DO BRASIL" e as estrelas continuam brancas;
  - `logo-oabma-symbol.png`: recorte do símbolo (globo e "AB") sem o texto,
    usado na barra recolhida.
- O script fica versionado para regerar os arquivos se o logo mudar.
- O componente `BrandLogo` renderiza as duas imagens (`light` com
  `dark:hidden` e `dark` com `hidden dark:block`). A troca é feita por CSS,
  sem esperar a hidratação, o que evita flash.
- Atende ao manual: não distorce (mantém a proporção via `width` e
  `height`), preserva a área de proteção com padding e usa largura mínima
  de 120px (~2,5 cm a 96 dpi).
- **Alternativa descartada**: filtro CSS (`invert`, `brightness`), que
  alteraria também o vermelho e o azul da marca.

### 7. Elementos gráficos
- `BrandWave`: SVG com duas faixas (navy e vermelho em gradiente
  `#D71920` → `#910D11`) e um traço fino vermelho, como no canto das
  peças do manual.
- `OabOutline`: SVG com círculo, triângulo e "B" em contorno, como na
  "aplicação simplificada" do manual.
- Os dois ficam em `src/components/app/brand/`, com `aria-hidden` e
  `pointer-events-none`.
- **Uso**:
  - onda e contorno no painel institucional da tela de login;
  - onda discreta no canto superior direito do cabeçalho da área logada,
    oculta abaixo de `sm`.

### 8. Responsividade
- **Breakpoints do Tailwind**: `sm` 640, `md` 768 (limite do celular na
  sidebar) e `lg` 1024 (painel da tela de login).
- **Cabeçalho de página**: `flex-col gap-3 sm:flex-row sm:items-center
  sm:justify-between`. Títulos em `text-2xl md:text-3xl`. Botões com
  `flex-wrap`.
- **Filtros**: grid de 1 coluna no celular, 2 no `sm` e em linha a partir
  do `lg`. Inputs e selects com `w-full` e largura fixa só a partir do
  `lg`.
- **Tabelas**: continuam no contêiner com `overflow-x-auto` (já existe no
  `table.tsx`) e ganham `min-w` para não espremer as colunas. Colunas
  secundárias (funcionário e tempo relativo nos atendimentos, e-mail nos
  funcionários) ficam ocultas abaixo de `md` e o conteúdo continua
  acessível pelo diálogo de detalhes.
- **Paginação**: `flex-col gap-3 sm:flex-row`.
- **Diálogos**: `max-h-[90dvh] overflow-y-auto` e `w-[calc(100%-2rem)]`.
- **Dashboard**: cards em `grid gap-4 sm:grid-cols-2 xl:grid-cols-4` e
  gráfico em largura total com `ResponsiveContainer`.
- **Autenticação**: `lg:grid-cols-2`. Abaixo do `lg`, só o formulário, com
  o `BrandLogo` acima. Removida a largura fixa `max-md:w-[27rem]` do card
  de login, que causava rolagem horizontal em 360px.

### 9. Cores fixas por semântica
- Botões `bg-sky-700 hover:bg-sky-600 text-white` passam a usar
  `<Button>` padrão (primary).
- Cards do dashboard (`bg-slate-800/60 text-white`) passam a usar `<Card>`
  padrão, com borda superior da marca no hover.
- Badges: substituídos pelas variantes suaves da decisão 12.
- Variação percentual do dashboard: badge `success`/`danger` com seta de
  tendência.
- Gráfico: `stroke="var(--chart-1)"`, eixos com `var(--muted-foreground)`
  e tooltip com os tokens de `popover`.

### 10. Densidade compacta (estilo console)
Pedida depois da primeira entrega ("mais compacto, estilo Neon"). A
referência é a densidade do console do Neon, mas com a paleta e as fontes da
OAB.
- **Controles**: `Button` padrão `h-8` (32px, `text-[13px]`), `sm` `h-7`,
  `icon` `size-8` e `icon-sm` `size-7`. `Input`, `SelectTrigger` e
  `Textarea` com 32px e `px-2.5`.
- **Texto**: 14px de base (`text-sm` no `body`) e 13px em controles,
  tabelas e descrições. Os campos mantêm 16px abaixo de 768px, porque o
  iOS amplia a página ao focar campos com menos de 16px. O `SelectTrigger`
  acompanha os campos, para os filtros não misturarem tamanhos.
- **Superfícies**: `--radius` de 6px. `Card` com `py-4 px-4`, `gap-4`,
  `rounded-lg` e `shadow-xs`. `Dialog` com `p-5`.
- **Estrutura**: cabeçalho da área logada e topo da barra lateral com 48px
  (alinhados). Conteúdo com `py-5`. As páginas trocam o `h1` grande e o
  `Separator` pelo `PageHeader` (título `text-xl`, descrição e ações).
- **Formulários**: `FormItem` com `gap-1.5`, `FormDescription` e
  `FormMessage` em 12px.

### 11. Drawer (`vaul`) no lugar do Sheet
- Componente gerado na sandbox pela CLI do shadcn (`drawer`), com o `cn`
  trocado por `@/lib/utils`. Ajustes feitos: fundo `bg-card`, alça menor,
  título em `font-heading` e botão "Fechar" (X) nas direções laterais, que
  não têm alça de arraste.
- Direção: `right` a partir de 768px e `bottom` abaixo disso, pelo
  `useIsMobile()` que a barra lateral já usa. O estado inicial do hook é
  `false`, mas o Drawer começa fechado, então não há salto visível.
- Estrutura do formulário: cabeçalho com borda, corpo com
  `overflow-y-auto` e rodapé fixo com "Cancelar" (`DrawerClose`) e a ação
  principal.
- O Sheet continua só dentro de `sidebar.tsx`: é o menu da barra lateral no
  celular, e trocá-lo exigiria reescrever o componente do shadcn.

### 12. Tabelas, badges e ações
- **Primitivos** (`table.tsx`): cabeçalho `bg-muted/60`, `h-9`, 11px,
  caixa alta e `tracking-wider`; célula `px-3 py-2`; hover `bg-muted/40`;
  sem `border-r` entre colunas. A tabela fica num card
  (`rounded-lg border bg-card`) com a paginação no rodapé (`border-t`).
- **Badges** (`badge.tsx`): variantes suaves com o token a 10% no fundo e a
  25% na borda (`success`, `warning`, `danger`, `info`, `sky`, `neutral`),
  e `BadgeDot` (marcador, pulsante opcional, estático com
  `prefers-reduced-motion`). Os badges de domínio ficam em componentes:
  `ServiceStatusBadge`, `AssistanceBadge` e `RoleBadge`.
- **Contraste medido** do texto sobre o badge (card e hover da linha):
  success 4.6–4.8; danger 5.3–5.5; info 7.2–7.5; sky 11+; neutral 5.6. O
  warning original (`#B45309`) dava 4.2–4.4, abaixo do mínimo, e foi
  escurecido para `#A34A08` (4.9–5.1). No tema escuro, todos ficam ≥ 4.5.
- **Status de atendimento**: "Em andamento" em âmbar com marcador pulsante,
  pois espera uma ação, e "Concluído" em verde com check. Antes era
  "Encerrado" com um ponto vermelho, divergente do filtro e dos detalhes,
  que já diziam "Concluído".
- **Ações**: a ação principal fica visível ("Concluir", "Alterar") e as
  demais vão para um `DropdownMenu` "⋯" com `modal={false}`, para o menu
  fechar antes de abrir o diálogo, sem disputa de foco nem
  `pointer-events` presos no `body`. Os diálogos ficam fora do menu,
  controlados por estado.
- **Composição das linhas**:
  - atendimentos: nome clicável (abre os detalhes) com a OAB em
    monoespaçada abaixo;
  - funcionários: avatar com iniciais, nome e e-mail;
  - tipos: nome primeiro e identificador em `<code>`, com botões de copiar
    embutidos em vez de sobrepostos.
- **Celular**: as colunas secundárias somem e os dados vão para a primeira
  célula. Status ao lado da OAB, cargo e situação abaixo do e-mail,
  identificador abaixo do nome. "Concluir" vira ícone com rótulo
  `sr-only`. Resultado: nenhuma tabela rola a 390px.
- **Estado vazio** (`TableEmptyState`): ícone, a mensagem que as specs já
  usavam e uma dica de próximo passo. Substitui o `TableCaption`.
- **Filtros**: `FilterInput`, um campo com ícone que repassa `id`,
  `aria-*` e `ref` ao `<input>`, então funciona dentro de `FormControl`.
  Em Atendimentos, o nome ocupa a sobra (`flex-1` com mínimo de 224px): a
  barra cabe numa linha a 1440px e quebra naturalmente abaixo disso.

## Risks / Trade-offs

- **Dois estilos de import do Radix** (`@radix-ui/react-*` nos componentes
  antigos e `radix-ui` nos novos) → funciona, porque os primitivos não
  compartilham contexto entre componentes distintos. O custo é um pequeno
  aumento de bundle. A unificação fica anotada em `docs/tech-debt.md`.
- **Recolorir o logo por região** depende do layout do PNG atual → o
  script valida as dimensões (1071×337) e falha se o arquivo mudar, e o
  resultado é conferido visualmente na tarefa de verificação.
- **Vermelho da marca confundido com erro** → uso restrito a indicadores
  e decoração, nunca em textos de status.
- **Mudança visual grande de uma vez** → verificação com screenshots das 8
  telas nos dois temas e em 3 larguras (360, 768 e 1440) antes do
  arquivamento.
- **`next-themes` e a hidratação** → `suppressHydrationWarning` só no
  `<html>`. O seletor não depende de `mounted` porque os ícones trocam via
  CSS.
- **Next 15.2.2 continua vulnerável durante esta change** → a change de
  segurança deve ser aplicada logo em seguida (registrado na proposta).

## Migration Plan

1. Implementar na branch da change e validar com `pnpm build` e
   `pnpm biome check`.
2. Fazer os screenshots de verificação (tarefa 9).
3. O deploy é um deploy comum do frontend. O cookie `sidebar_state` é
   criado sob demanda. Não há migração de dados.
4. **Rollback**: reverter o commit.

## Notas de implementação

Pontos em que a implementação se afastou ou detalhou o plano acima:

- **`breadcrumb` dispensado**: o título da seção vem do `nav-config.ts`.
- **Colunas secundárias a partir do `lg`, e não do `md`**: em 768px a
  barra expandida ocupa 256px e sobram ~500px para a tabela.
- **`SidebarInset` com `min-w-0`**: sem isso, as tabelas alargavam a página
  em 256px no tablet. Isso foi detectado pela medição de `scrollWidth` nos
  screenshots.
- **`DialogContent` base**: corrigida a classe inválida `w-[full]` para
  `w-full`, e adicionados `max-h-[calc(100dvh-2rem)] overflow-y-auto` e
  fundo `bg-card`. `CardTitle`, `DialogTitle` e `SheetTitle` recebem
  `font-heading` na base, em vez de em cada uso.
- **Textos acessíveis do shadcn traduzidos** (`sr-only`, títulos do sheet no
  celular): "Alternar barra lateral", "Menu de navegação" e "Fechar".
- **Correções pequenas feitas nos arquivos reescritos**:
  - o campo "Confirmar senha" exibia o erro do campo de código. A spec
    `authentication` já exigia o comportamento correto; era o antigo item 5
    do tech-debt;
  - o logout navegava duas vezes;
  - removido o import não usado `getAllServices` no gráfico.
- **Correções feitas junto com a densidade compacta**:
  - `FormMessage` e o `FormLabel` com erro usavam `text-destructive-foreground`,
    que é branco: as mensagens de validação ficavam invisíveis no tema
    claro. Agora usam `text-destructive`;
  - `update-agent-dialog.tsx` importava o `DialogTitle` direto do
    `@radix-ui/react-dialog`, sem o estilo do projeto;
  - `PasswordInput` montava a classe como `` ` ${className}` ``, que gerava a
    classe literal `undefined`, e o botão do olho não tinha rótulo
    acessível;
  - `CopyContentField` não fazia fallback quando `writeText` rejeitava
    (permissão negada), e o botão não fazia nada.
- **Verificação**:
  - 30 screenshots (5 telas × 2 temas × 3 larguras), mais detalhes, barra
    recolhida, menu no celular e menu do usuário;
  - 20 checagens automáticas de comportamento (puppeteer), usando um mock
    da API com dados fictícios;
  - nenhuma página com rolagem horizontal;
  - depois da densidade compacta: 24 screenshots (4 telas × 2 temas × 3
    larguras), mais Drawer (desktop e celular, dois temas), detalhes, menus
    e estado vazio. São 55 checagens automáticas, que cobrem:
    - alturas;
    - menus, detalhes e permissões de MEMBER;
    - Drawer, incluindo a mensagem de validação em vermelho;
    - tabelas sem rolagem a 390px;
    - cópia com permissão negada.
- **Atraso de 2s em dev**: `src/lib/axios.ts` atrasa as requisições em
  desenvolvimento. Os scripts de verificação esperam os skeletons sumirem
  antes de medir.

## Open Questions

- Se a OAB-MA tiver a Gotham HTF licenciada para web, basta trocar a
  Montserrat em `layout.tsx` (decisão 5).
- O slogan "FORTE E AO SEU LADO" faz parte do logo atual, que é da gestão.
  Se ele mudar, basta substituir o PNG e rodar o script de variantes de
  novo.
