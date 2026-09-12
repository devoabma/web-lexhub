## 1. Funções da API (`src/api/dashboard/`)

- [x] 1.1 `get-services-yearly.ts`, `get-services-monthly.ts` (`year`) e `get-services-daily.ts` (`year`, `month`), tipando as respostas
- [x] 1.2 `get-top-lawyers.ts` e `get-top-agents.ts` (`year`, `month`, `limit`), tipando `servicesInPeriod` e as listas
- [x] 1.3 `download-services-report.ts`: `responseType: 'blob'`, nome do arquivo lido do `Content-Disposition` com fallback `relatorio-atendimentos-<ano>[-<MM>].pdf`
- [x] 1.4 Remover `get-services-month-for-chart.ts` e conferir que nada mais chama `GET /services/monthly`

## 2. Utilitários (`src/utils/`)

- [x] 2.1 `calculate-variation.ts` com os mesmos ramos de hoje e uso nos 4 cards; conferir 15/10 → `+50.0%`, 3/0 → `+100.0%`, 0/0 → `+0.0%` e 5/10 → `-50.0%` (conferido também contra a lógica antiga em 3.721 combinações, sem diferença)
- [x] 2.2 `calculate-share.ts` (percentual sobre o total do período, 0 quando o total é 0)
- [x] 2.3 `download-file.ts` (object URL + `<a download>` + revogação da URL)

## 3. Período

- [x] 3.1 `use-dashboard-period.ts`: lê e valida `year`/`month` da URL (padrão: ano atual, sem mês) e exporta os nomes dos meses em pt-BR
- [x] 3.2 `use-year-options.ts`: anos de `['metrics', 'services-yearly']`, sempre com o ano atual e o da URL, em ordem decrescente
- [x] 3.3 `period-filter.tsx`: selects de ano e mês ("Ano inteiro") gravando na URL com `router.push`, preservando os demais parâmetros

## 4. Painéis do período

- [x] 4.1 `dashboard-panel.tsx` (título, descrição, skeleton, erro com "Tentar novamente" e estado vazio) e `chart-styles.ts` (tokens do `ServiceChart`)
- [x] 4.2 `yearly-services-chart.tsx`: barras de `/metrics/services/yearly` com o ano selecionado destacado
- [x] 4.3 `service-chart.tsx`: trocar para `/metrics/services/monthly?year=` (`label`/`total`) com o total do ano na descrição e o mês selecionado marcado
- [x] 4.4 `daily-services-chart.tsx`: barras de `/metrics/services/daily` (mês selecionado ou mês atual do ano selecionado)
- [x] 4.5 `top-lawyers-card.tsx`: posição, nome, OAB, total e %, estado vazio
- [x] 4.6 `top-agents-card.tsx`: posição, nome, total e %, destaque "Você" pelo `sub` do JWT, estado vazio

## 5. Relatório em PDF

- [x] 5.1 `generate-report.tsx`: botão no `PageHeader`, diálogo com ano e mês opcional (padrão: período da URL), `useMutation`, spinner no botão, download e toast de sucesso
- [x] 5.2 Erro com corpo `Blob`: toast com `JSON.parse(await blob.text()).message` e fallback genérico

## 6. Página

- [x] 6.1 `page.tsx`: 4 cards como estão, seção "Análise por período" com o seletor, grade responsiva dos gráficos e rankings, e `idAgentAuthenticated` para o ranking de funcionários

## 7. Verificação (API local)

- [x] 7.1 Conferir cada painel contra as respostas das rotas `/metrics` e as queryKeys no React Query (período padrão, `?year=&month=`, parâmetros inválidos, troca de período sem recarregar os 4 cards). Feito com Chrome headless (puppeteer-core) contra o build de produção e a API local, conferindo parâmetros pelas requisições: ao trocar o mês, só os 2 rankings refazem requisição. Com `/metrics` em 404, os 5 painéis mostram erro e os 4 cards seguem funcionando
- [x] 7.2 Relatório: mensal, ano inteiro, loading e erro (toast com a `message`). Baixados `relatorio-atendimentos-2026-09.pdf` e `relatorio-atendimentos-2026.pdf`; os dois botões ficam desabilitados com spinner; um `400 { message }` simulado aparece no toast, sem download
- [x] 7.3 Layout em ~400 px, tablet e desktop, nos temas claro e escuro. Em 400 px, sem rolagem horizontal (`scrollWidth = 400`); abaixo de `xl`, os painéis ficam em uma coluna
- [x] 7.4 Rodar `pnpm biome check` sem erros novos. Resultado: `pnpm biome check src` com 1 erro, o de ordem de imports em `src/components/ui/alert.tsx`, que já existia. `pnpm biome check .` também acusa o `.next/` depois de um build, porque o `biome.json` não o ignora
- [x] 7.5 Rodar `pnpm build` com sucesso

## 8. Documentação

- [x] 8.1 `docs/api.md`: parâmetros de período, rotas `/metrics`, relatório e `/services/monthly` fora de uso
- [x] 8.2 `docs/architecture.md`: tabela de queryKeys e `src/utils`
- [x] 8.3 `docs/tech-debt.md`: tirar a variação percentual do item "Código duplicado"

## 9. Publicação

- [ ] 9.1 Publicar o frontend só depois do deploy da API em produção e de conferir `GET /metrics/services/yearly` lá
- [ ] 9.2 Depois de publicado, sincronizar a spec `dashboard-metrics` e arquivar a change (`/opsx:archive`)
