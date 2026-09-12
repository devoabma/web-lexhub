## 1. Preparação e linha de base

- [ ] 1.1 Criar a branch `fix/upgrade-nextjs-security-patches` a partir da `main` (não feito: a `main` tinha muitas alterações não commitadas de outras changes; fica para quem for commitar)
- [x] 1.2 Salvar o resultado de `pnpm audit` atual (esperado: 81 vulnerabilidades, 5 críticas) para comparação. Resultado: 81 (3 baixas, 38 moderadas, 35 altas, 5 críticas)
- [x] 1.3 Rodar `pnpm build && pnpm start` na versão atual e confirmar a CVE-2025-29927: `curl -sI http://localhost:3000/dashboard -H "x-middleware-subrequest: middleware:middleware:middleware:middleware:middleware"` sem cookie **não** deve redirecionar (vulnerável: a requisição chega à página), enquanto a mesma chamada sem o header retorna **307** para `/`. O valor precisa usar o nome do middleware em `.next/server/middleware-manifest.json`, que muda entre versões: `middleware` na 15.2.2 e `src/middleware` na 15.5.25. Com o nome errado, o Next ignora o header e o teste dá um falso "não vulnerável". Por isso, teste as duas grafias. Resultado na 15.2.2: com `middleware:...`, **500** (a página foi renderizada sem passar pelo middleware); sem o header, 307

## 2. Atualização das dependências

- [x] 2.1 Atualizar `next` para exatamente `15.5.25` no `package.json`
- [x] 2.2 Atualizar `axios` para `^1.20.0` (instalado 1.20.0)
- [x] 2.3 Atualizar as transitivas `lodash`, `nanoid`, `sharp`, `form-data` e `follow-redirects` no lockfile, dentro dos ranges existentes, e conferir com `pnpm why <pacote>` que chegaram às versões corrigidas (`lodash >=4.18.0`, `nanoid >=3.3.18`, `sharp >=0.35.4`, `form-data >=4.0.6`, `follow-redirects >=1.16.0`). Resultado: `lodash` 4.18.1 e `nanoid` 3.3.19 (via `pnpm update`), `sharp` 0.35.4, `form-data` 4.0.6 e `follow-redirects` 1.16.0. O `postcss` do `@tailwindcss/postcss`, que também estava vulnerável, foi para 8.5.28
- [x] 2.4 Adicionar `pnpm.overrides` com ranges seletivos só para as transitivas que não subirem na 2.3 (design, decisão 3). Não foi necessário: todas subiram dentro do range
- [x] 2.5 Rodar `pnpm audit` e confirmar que a única vulnerabilidade restante é o `postcss` via `next` (risco aceito, design decisão 4). Resultado: 4 (2 moderadas, 2 altas), todas em `next>postcss@8.4.31`

## 3. Build e verificação da correção

- [x] 3.1 Rodar `pnpm build` sem erros de tipo e versionar o `next-env.d.ts` se ele for regenerado (não foi regenerado)
- [x] 3.2 Com `pnpm start`, repetir o `curl` da 1.3 (as duas grafias) e confirmar **307** para `/` (spec access-control, cenário "Visitante forja header de subrequest")
- [x] 3.3 Com o cookie de um usuário MEMBER, requisitar `/agents` com o header forjado e confirmar **307** para `/dashboard`
- [x] 3.4 Sem cookie, requisitar `/services` com `RSC: 1` e `Next-Router-Prefetch: 1` e confirmar que nenhum payload da rota é retornado (redirecionamento para `/`)

## 4. Smoke test funcional (com a API rodando)

Executado com Chrome headless (puppeteer) contra o build de produção e a API local.

- [x] 4.1 Autenticação: login válido e inválido, logout, expiração (cookie com `exp` passado redireciona para `/`), "Esqueceu a senha?" e redefinição com `?code=`
- [x] 4.2 Controle de acesso: sem sessão, como MEMBER (menu com 2 itens, `/agents` e `/services-types` redirecionam) e como ADMIN (menu com 4 itens)
- [ ] 4.3 Atendimentos: filtros (incluindo "Todos", conferindo na aba Network que `status`/`assistance` **não** são enviados), paginação, detalhes, novo atendimento com consulta por OAB, atendimento externo, concluir e cancelar. **Parcial:** a listagem carrega e a query inicial não envia `status`/`assistance`; concluir e cancelar foram testados direto na API. Faltam pela interface: troca de filtros, paginação, detalhes, novo atendimento e atendimento externo (dependem do Protheus)
- [ ] 4.4 Tipos de serviço e funcionários: listar, filtrar, criar, editar, revogar e restaurar acesso. **Parcial:** as duas listagens carregam pela interface; criar, editar, revogar e restaurar foram testados direto na API. Faltam os formulários pela interface
- [ ] 4.5 Dashboard: os 4 cards e o gráfico carregam, e o logo (`next/image`) é exibido. **Parcial:** o logo carrega e a página abre sem erro de JavaScript; os cards e o gráfico não foram conferidos um a um

## 5. Documentação e finalização

- [x] 5.1 Atualizar `docs/tech-debt.md`: remover o item 1 (CVE) e registrar o risco residual do `postcss@8.4.31` e o aviso de deprecated do `next lint`
- [x] 5.2 Atualizar a versão do Next em `docs/architecture.md` (tabela de stack)
- [x] 5.3 Rodar `pnpm biome check .` sem erros novos
- [x] 5.4 Rodar `pnpm build` final com sucesso
