# Documentação do LexHub (web)

Frontend do **OAB Atende** — sistema de registro e gestão de atendimentos a
advogados(as) da OAB Seccional do Maranhão.

## Documentos

| Documento | Conteúdo |
| --- | --- |
| [architecture.md](./architecture.md) | Stack, estrutura de pastas, autenticação, cache do React Query, padrões de código, variáveis de ambiente, setup |
| [api.md](./api.md) | Todos os endpoints da API consumidos pelo frontend, com payloads e tipos de resposta |
| [domain.md](./domain.md) | Glossário, ciclo de vida do atendimento, regras de negócio e matriz de permissões |
| [tech-debt.md](./tech-debt.md) | Bugs e débitos técnicos conhecidos, priorizados, para guiar a atualização |

## Especificações (OpenSpec)

O comportamento esperado de cada funcionalidade está em
[`openspec/specs/`](../openspec/specs/), no formato requisito + cenários
(WHEN/THEN). Essas specs descrevem o sistema **como ele é hoje** e servem de
baseline para as mudanças.

| Capability | Escopo |
| --- | --- |
| [authentication](../openspec/specs/authentication/spec.md) | Login, sessão por cookie, expiração, logout, recuperação e redefinição de senha |
| [access-control](../openspec/specs/access-control/spec.md) | Rotas públicas/privadas/admin, menu por papel, perfil, permissões sobre atendimentos |
| [dashboard-metrics](../openspec/specs/dashboard-metrics/spec.md) | Cards de métricas, variação percentual, gráfico mensal |
| [service-management](../openspec/specs/service-management/spec.md) | Listagem, filtros, paginação, detalhes, novo atendimento, atendimento externo, concluir, cancelar |
| [service-types](../openspec/specs/service-types/spec.md) | Catálogo de tipos de serviço (listar, filtrar, copiar, criar, renomear) |
| [agent-management](../openspec/specs/agent-management/spec.md) | Funcionários (listar, filtrar, cadastrar, editar, revogar/restaurar acesso) |

O contexto do projeto enviado à IA ao criar artefatos fica em
[`openspec/config.yaml`](../openspec/config.yaml).

### Fluxo de trabalho para a atualização

```bash
# no Claude Code
/opsx:explore                         # investigar uma ideia antes de propor
/opsx:propose "atualizar Next.js e corrigir CVE do middleware"
/opsx:apply                           # implementar as tasks da change
/opsx:archive                         # aplicar os deltas nas specs principais

# na CLI
openspec list                         # changes em andamento
openspec list --specs                 # capabilities e nº de requisitos
openspec show <spec-ou-change>
openspec validate --specs --strict    # validar as specs
openspec view                         # dashboard interativo
```

Cada change gera `openspec/changes/<nome>/` com `proposal.md`, `design.md`,
`tasks.md` e specs delta (`## ADDED | MODIFIED | REMOVED Requirements`).
Ao arquivar, os deltas são mesclados nas specs principais — assim a
documentação acompanha o código.

**Manter a doc viva**: ao mudar comportamento, atualize a spec (via change);
ao mudar endpoint, atualize [api.md](./api.md); ao corrigir um item de
[tech-debt.md](./tech-debt.md), remova-o de lá.
