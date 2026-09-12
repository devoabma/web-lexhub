## 1. Dependências e componentes base

- [x] 1.1 Gerar numa sandbox `sidebar`, `dropdown-menu`, `tooltip`, `sonner` e `use-mobile` (o `breadcrumb` foi dispensado: o título da seção vem do `nav-config`) com a CLI do shadcn, copiar para o projeto trocando `import { cn } from "cn"` por `@/lib/utils`, e atualizar `button`, `input`, `separator` e `sheet` (design, decisão 1)
- [x] 1.2 Adicionar `next-themes` e `radix-ui` às dependências, sem adicionar o pacote `cn`
- [x] 1.3 Conferir que `badge.tsx` e os demais componentes customizados continuam intactos

## 2. Tokens de tema e tipografia

- [x] 2.1 Reescrever `src/app/globals.css`: `:root` claro, `.dark` escuro, tokens de marca (`brand-*`), `success`/`warning`, gráficos, sidebar, `--radius`, scrollbar com tokens e `@custom-variant dark` corrigido (design, decisão 4)
- [x] 2.2 Configurar Barlow e Montserrat via `next/font/google` em `src/app/layout.tsx` e expor `--font-sans` e `--font-heading` (design, decisão 5)
- [x] 2.3 Trocar todo `font-calsans` por `font-heading`; remover o `@font-face` e `public/fonts/CalSans-SemiBold.ttf`

## 3. Tema claro, escuro e sistema

- [x] 3.1 Adicionar `ThemeProvider` (`next-themes`, `defaultTheme="system"`) ao `ClientProvider` e `suppressHydrationWarning` no `<html>`
- [x] 3.2 Trocar o `Toaster` do `sonner` pelo `components/ui/sonner.tsx`, que segue o tema (mantendo `richColors` e `closeButton`)
- [x] 3.3 Criar o `ThemeToggle` (dropdown Claro, Escuro e Sistema, rótulo "Alternar tema", ícone trocado via CSS)

## 4. Marca: logo e elementos gráficos

- [x] 4.1 Criar `scripts/generate-logo-variants.py` e gerar `logo-oabma-light.png` e `logo-oabma-symbol.png`; conferir visualmente os dois arquivos
- [x] 4.2 Criar `BrandLogo` (variante por tema via CSS, modos `full`/`symbol`, largura mínima de 120px no modo completo)
- [x] 4.3 Criar `BrandWave` e `OabOutline` (SVG, `aria-hidden`)

## 5. Estrutura da área logada

- [x] 5.1 Criar `nav-config.ts` com grupos "Menu" e "Administração" (título, rota, ícone, `adminOnly`)
- [x] 5.2 Criar `AppSidebar` (`collapsible="icon"`, logo completo/símbolo, grupos por papel, `isActive` + `aria-current`, fechar no celular ao navegar, tooltips)
- [x] 5.3 Criar `NavUser` (dropdown com iniciais, nome, e-mail, cargo, opções de tema e "Sair") e `LogoutDialog`, reaproveitando a query `['profile']` e a mutação de logout atuais
- [x] 5.4 Criar `AppHeader` fixo no topo (`SidebarTrigger`, título da seção, `ThemeToggle`, onda decorativa a partir de `sm`)
- [x] 5.5 Reescrever `src/app/(private)/(app)/layout.tsx` com `SidebarProvider` (`defaultOpen` a partir do cookie `sidebar_state`) + `SidebarInset`
- [x] 5.6 Remover `dashboard/components/sidebar/` (`sidebar-menu.tsx`, `nav-item.tsx`, `profile.tsx`)

## 6. Telas de autenticação

- [x] 6.1 Reescrever `src/app/(public)/(auth)/layout.tsx`: painel institucional a partir do `lg` (logo, onda, contorno OAB, rodapé) e só o formulário com logo abaixo do `lg`; seletor de tema
- [x] 6.2 Ajustar `form-auth.tsx`, `password-recovery-form.tsx`, `reset-password-form.tsx` e `message-email-send.tsx`: remover larguras fixas e cores `sky`, usar `Button` padrão e tipografia `font-heading`

## 7. Páginas da área logada

- [x] 7.1 Dashboard: cards com `Card` padrão e tokens (sem `slate`/`text-white`), variação com `text-success`/`text-destructive`, grid `sm:grid-cols-2 xl:grid-cols-4`, gráfico com `var(--chart-1)` e eixos/tooltip com tokens
- [x] 7.2 Atendimentos: cabeçalho da página responsivo, filtros em grid responsivo, colunas secundárias ocultas abaixo de `md`, diálogos (novo, externo, detalhes, concluir, cancelar) com `max-h-[90dvh]` e sem cores fixas
- [x] 7.3 Tipos de serviço: cabeçalho, filtros, tabela e diálogos responsivos e com tokens
- [x] 7.4 Funcionários: cabeçalho, filtros, tabela (e-mail oculto abaixo de `md`), sheet e diálogos responsivos e com tokens; badges de cargo e situação com tokens
- [x] 7.5 Componentes compartilhados: `Pagination` responsiva, `AssistanceBadge` e variantes `open`/`closed` do `badge.tsx` com tokens, `404` e `CopyContentField` sem cores fixas
- [x] 7.6 Buscar e eliminar as cores fixas restantes (`slate-`, `sky-`, `text-white`, `bg-white`, hex nos componentes) fora dos tokens de marca intencionais

## 8. Documentação

- [x] 8.1 Atualizar `docs/architecture.md` (stack, estrutura de pastas do shell, seção "Identidade visual" com tokens, fontes e logo)
- [x] 8.2 Atualizar `docs/tech-debt.md`: remover o item 14 (layout sem mobile) e registrar a convivência de `@radix-ui/react-*` com `radix-ui`

## 9. Verificação

- [x] 9.1 Rodar `pnpm biome check .` sem erros novos
- [x] 9.2 Rodar `pnpm build` com sucesso
- [x] 9.3 Screenshots de login, dashboard, atendimentos, detalhes do atendimento, tipos de serviço e funcionários nos temas claro e escuro, em 360, 768 e 1440px; conferir que não há rolagem horizontal da página nem texto ilegível
- [x] 9.4 Conferir a barra lateral: recolher/expandir, persistência após recarregar, `Ctrl+B`, tooltips, painel no celular fechando ao navegar, grupo "Administração" só para ADMIN
- [x] 9.5 Conferir o tema: padrão "Sistema", escolha persistida, sem flash ao recarregar no escuro, toasts seguindo o tema

## 10. Densidade compacta, Drawer e tabelas (extensão pedida na revisão)

- [x] 10.1 Gerar o `drawer` na sandbox, adicionar `vaul`, ajustar o componente (cn local, `bg-card`, alça, X nas laterais) (design, decisão 11)
- [x] 10.2 Densidade nos primitivos: `button`, `input`, `select`, `textarea`, `label`, `form`, `card`, `dialog`; `--radius` 6px e `text-sm` no `body` (design, decisão 10)
- [x] 10.3 Corrigir `FormMessage`/`FormLabel` com erro, que usavam `text-destructive-foreground` (branco)
- [x] 10.4 `table.tsx` e `badge.tsx` repaginados; variantes suaves e `BadgeDot`; contraste medido e `--warning` claro ajustado para `#A34A08` (design, decisão 12)
- [x] 10.5 Componentes: `PageHeader`, `TableEmptyState`, `FilterInput`, `ServiceStatusBadge`, `RoleBadge`, `AssistanceBadge` com ícone, `CopyContentField` embutido e com fallback, `Pagination` compacta
- [x] 10.6 Atendimentos: linha nova (nome clicável + OAB, status, forma, funcionário, tempo com data no hover, "Concluir" + menu "⋯"), skeleton, filtros, detalhes reorganizados, confirmações com "Voltar"
- [x] 10.7 Funcionários: linha com avatar, badges de cargo e situação, menu "⋯"; "Novo Funcionário" em Drawer; diálogos compactos (e `DialogTitle` do projeto)
- [x] 10.8 Tipos de serviço: nome antes do identificador, cópia embutida, "Novo Serviço" em Drawer, diálogo compacto
- [x] 10.9 Dashboard: `PageHeader`, `MetricCard` com ícone e badge de tendência, gráfico compacto
- [x] 10.10 Celular: colunas secundárias ocultas e dados na primeira célula; "Concluir" só com ícone abaixo de `sm`
- [x] 10.11 Cabeçalho da área logada e topo da barra lateral com 48px; logo no mínimo de 120px
- [x] 10.12 Specs: `visual-identity` e `app-shell` (densidade, badges, Drawer, padrão de tabelas) e deltas de `service-management`, `agent-management`, `service-types` e `access-control`
- [x] 10.13 Verificação: `tsc`, Biome, screenshots nos dois temas e em 3 larguras, 55 checagens automáticas (puppeteer + mock)

