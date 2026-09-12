## ADDED Requirements

### Requirement: Controle de acesso resistente a bypass do middleware
O sistema MUST aplicar as regras de autenticação e de papel a toda requisição
de rota privada, mesmo quando ela traz headers internos do Next.js
(`x-middleware-subrequest`, `RSC`, `Next-Router-Prefetch`,
`Next-Router-Segment-Prefetch`) que um cliente pode forjar. Nenhuma
combinação desses headers pode entregar conteúdo de rota privada a quem não
tem acesso.

#### Scenario: Visitante forja header de subrequest
- **WHEN** um cliente sem o cookie `@lexhub-auth` requisita `/dashboard` com o header `x-middleware-subrequest: middleware:middleware:middleware:middleware:middleware` (ou com `src/middleware` repetido)
- **THEN** a resposta é um redirecionamento para `/` e nenhum conteúdo do dashboard é retornado

#### Scenario: Membro forja header de subrequest em rota de administrador
- **WHEN** um usuário com `role = MEMBER` requisita `/agents` com o header `x-middleware-subrequest` forjado
- **THEN** a resposta é um redirecionamento para `/dashboard`

#### Scenario: Visitante requisita payload RSC ou prefetch de rota privada
- **WHEN** um cliente sem o cookie `@lexhub-auth` requisita `/services` com os headers `RSC: 1` e `Next-Router-Prefetch: 1`
- **THEN** o conteúdo da rota não é retornado e o cliente é redirecionado para `/`
