# Contratos da API consumidos pelo frontend

Todas as chamadas usam a instância `API` de `src/lib/axios.ts`
(`baseURL = NEXT_PUBLIC_API_URL`, `withCredentials: true`). A autenticação é
feita pelo cookie `@lexhub-auth` enviado automaticamente pelo navegador.

Os tipos abaixo são os declarados no frontend (`src/api/**`) — são a
expectativa do cliente, não uma especificação do backend. Em caso de erro o
frontend lê `response.data.message` (string) para exibir ao usuário.

Paginação: `pageIndex` começa em **1** e o frontend assume **10 itens por
página**; a resposta traz `total` (quantidade total de registros).

## Funcionários e sessão — `src/api/agents/`

| Função | Método e rota | Corpo / query | Resposta |
| --- | --- | --- | --- |
| `singIn` | `POST /agents/sessions` | `{ email, password }` | `{ token }` + `Set-Cookie: @lexhub-auth` |
| `logout` | `POST /agents/logout` | — | — |
| `getProfile` | `GET /agents/profile` | — | `{ agent: Agent }` |
| `forgotPassword` | `POST /agents/password/recover` | `{ email }` | — |
| `resetPassword` | `POST /agents/password/reset` | `{ code, password }` | — |
| `getAll` | `GET /agents/all` | `?pageIndex&name&role` | `{ agents: AgentListItem[], total }` |
| `createAgent` | `POST /agents` | `{ name, email, password }` | — |
| `updateAgent` | `PUT /agents/update/:id` | `{ name, email, role }` | — |
| `inactiveAgent` | `PATCH /agents/inactive/:id` | — | — |
| `activeAgent` | `PATCH /agents/active/:id` | — | — |

```ts
type Role = 'ADMIN' | 'MEMBER'

interface Agent {
  id: string
  name: string
  email: string
  role: Role
}

interface AgentListItem extends Agent {
  inactive: string | null // ISO da data de desativação; null = ativo
}
```

## Atendimentos — `src/api/services/`

| Função | Método e rota | Corpo / query | Resposta |
| --- | --- | --- | --- |
| `getAllServices` | `GET /services/all` | `?pageIndex&oab&lawyerName&agentName&assistance&status` | `{ services: Service[], total }` |
| `consultLawyer` | `POST /services/consult/lawyer` | `{ oab }` | `{ name }` (erro com `message` se não puder ser atendido) |
| `createService` | `POST /services` | `{ oab, serviceTypeId: string[], assistance, observation? }` | — |
| `createServiceExternal` | `POST /services/external` | `{ oab, name, email, serviceTypeId: string[], assistance, observation? }` | — |
| `finishedService` | `PATCH /services/finished/:id` | — | — |
| `cancelService` | `DELETE /services/cancel/:id` | — | — |

```ts
interface Service {
  id: string
  assistance: 'PERSONALLY' | 'REMOTE'
  observation: string | null
  status: 'OPEN' | 'COMPLETED'
  createdAt: string        // ISO
  finishedAt: string | null
  lawyer: { id: string; name: string; oab: string; email: string }
  agent: { id: string; name: string; email: string; role: Role }
  serviceTypes: { serviceType: { id: string; name: string } }[]
}
```

Observações:
- `serviceTypes` é a tabela de junção N:N (atendimento ↔ tipo), por isso o
  aninhamento `serviceType`.
- O e-mail do advogado pode vir vazio (o detalhe mostra "Sem e-mail
  cadastrado").
- O nome do advogado costuma vir em caixa alta; o frontend formata com
  `formatFullName`.

## Tipos de serviço — `src/api/services-types/`

| Função | Método e rota | Corpo / query | Resposta |
| --- | --- | --- | --- |
| `getAll` | `GET /services/types/all` | `?pageIndex&id&name` | `{ servicesTypes: ServiceType[], total }` |
| `getAllWithoutPagination` | `GET /services/types/all-wp` | — | `{ servicesTypes: ServiceType[] }` |
| `createServiceType` | `POST /services/types` | `{ name }` | — |
| `updateServiceType` | `PUT /services/types/update/:id` | `{ name }` | — |

```ts
interface ServiceType {
  id: string // cuid — o formulário de edição valida com z.string().cuid()
  name: string
}
```

## Dashboard — `src/api/dashboard/`

### Totais dos cards

| Função | Método e rota | Resposta |
| --- | --- | --- |
| `getAllQuantityServices` | `GET /services/general` | `{ total }` |
| `getAllQuantityPerDay` | `GET /services/general/agent/day` | `{ totalTheDay, totalLastDay }` |
| `getAllQuantityByAgent` | `GET /services/general/agent/:id` | `{ totalGeneral, totalOnMonth, totalOnPreviousMonth }` |
| `getAllQuantityServicesMonth` | `GET /services/general/month` | `{ totalCurrentMonth, totalPreviousMonth }` |
| `getAllQuantityServicesYear` | `GET /services/general/year` | `{ totalCurrentYear, totalPreviousYear }` |

Observações:
- Apesar da rota, `/services/general/agent/day` é usada como total **geral**
  do dia (hoje vs. ontem), não por funcionário.
- `/services/general/agent/:id` recebe o `sub` do JWT; se não houver token o
  valor enviado é `false` (a página já estaria bloqueada pelo middleware).

### Métricas por período — `/metrics`

Todas exigem sessão. Contam os atendimentos pela data de registro, no horário
do Maranhão (UTC-3), com qualquer status.

Parâmetros de período, opcionais: `year` (2000–2100) e `month` (1–12). Fora da
faixa, a API responde `400 { message }`. O dashboard sempre envia o período
do seletor (ver a spec `dashboard-metrics`).

| Função | Método e rota | Query | Resposta |
| --- | --- | --- | --- |
| `getServicesYearly` | `GET /metrics/services/yearly` | — | `{ years: { year, total }[] }` |
| `getServicesMonthly` | `GET /metrics/services/monthly` | `year` (padrão: ano atual) | `{ year, total, months: { month, label, total }[] }` |
| `getServicesDaily` | `GET /metrics/services/daily` | `year`, `month` (padrão: atuais) | `{ year, month, total, days: { day, date, total }[] }` |
| `getTopLawyers` | `GET /metrics/lawyers/top` | `year`, `month`, `limit` (1–50, padrão 10) | `{ servicesInPeriod, lawyers: { id, name, oab, total }[] }` |
| `getTopAgents` | `GET /metrics/agents/top` | `year`, `month`, `limit` (1–20, padrão 3) | `{ servicesInPeriod, agents: { id, name, total }[] }` |
| `downloadServicesReport` | `GET /metrics/report` | `year`, `month` | PDF (`responseType: 'blob'`) → `{ file, fileName }` |

Observações:
- `yearly` vai do primeiro ano com registros até o atual; anos sem registro
  vêm com `total: 0`.
- `monthly` sempre traz os 12 meses, com `label` de `'Jan'` a `'Dez'`.
- `daily` traz de 28 a 31 dias, com `date` no formato `'YYYY-MM-DD'`. Sem
  `month`, a API usa o mês atual do ano informado.
- Rankings: sem `year` e sem `month`, a API considera todo o histórico;
  `month` sem `year` usa o ano atual. Vêm ordenados por `total` (desc) e, no
  empate, por nome. `servicesInPeriod` é o total de atendimentos do período,
  base do percentual exibido. O ranking de funcionários inclui inativos.
- Relatório: sem `month`, cobre o ano inteiro. Responde `200
  application/pdf` com `Content-Disposition: attachment;
  filename="relatorio-atendimentos-2026-09.pdf"`, e o CORS expõe esse header.
  Se o header não vier, `downloadServicesReport` usa
  `relatorio-atendimentos-<ano>[-<MM>].pdf`. Como a resposta é `blob`, o corpo
  de erro também chega como `Blob`: o frontend lê a mensagem com
  `JSON.parse(await blob.text()).message`.

### Rota fora de uso

`GET /services/monthly` (o gráfico mensal antigo) está depreciada na API e
agora conta só o ano atual. O frontend deixou de chamá-la: o gráfico mensal
usa `GET /metrics/services/monthly?year=`.
