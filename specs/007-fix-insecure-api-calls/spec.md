# Feature Specification: Correção de Chamadas de API Inseguras no Frontend

**Feature Branch**: `007-fix-insecure-api-calls`
**Created**: 2026-06-22
**Status**: Draft
**Input**: User description: "Corrigir consumo de endpoints inseguros no frontend: remover chamada ao GET /users/:id no MemberProfileSheet usando dados já disponíveis no grupo, e ajustar chamada ao GET /groups para não enviar user_id como query param"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visualizar perfil de membro sem chamada de API adicional (Priority: P1)

Ao clicar no nome de um membro na lista do grupo, o usuário vê as informações de perfil daquela pessoa (nome, sobrenome, e-mail). Esses dados já estão disponíveis no objeto do grupo carregado anteriormente — nenhuma nova chamada de API deve ser feita.

**Why this priority**: O frontend não deve mais depender do endpoint `GET /users/:id`, que será removido do backend. Além disso, eliminar a chamada reduz a latência da interação.

**Independent Test**: Pode ser testado clicando em qualquer membro na tela de detalhes do grupo e verificando que o painel de perfil exibe os dados imediatamente, sem nenhuma requisição de rede adicional.

**Acceptance Scenarios**:

1. **Given** o usuário está na tela de detalhes de um grupo, **When** ele clica no nome de um membro, **Then** o painel de perfil exibe nome, sobrenome e e-mail daquele membro imediatamente, sem chamada de rede.
2. **Given** o usuário está na tela de detalhes de um grupo com vários membros, **When** ele clica em diferentes membros sequencialmente, **Then** cada perfil é exibido instantaneamente com os dados corretos.
3. **Given** o painel de perfil de um membro está aberto, **When** a conexão de rede está indisponível, **Then** os dados ainda são exibidos corretamente (pois vêm do estado local).

---

### User Story 2 — Listagem de grupos não envia user_id como parâmetro (Priority: P2)

Ao acessar a tela de grupos, o frontend solicita a listagem de grupos ao backend sem enviar `user_id` como query param. O backend passa a ser responsável por filtrar automaticamente pelo usuário autenticado via token.

**Why this priority**: Enviar `user_id` explicitamente é redundante após a correção do backend e mantém o frontend acoplado a um detalhe que o backend resolve internamente.

**Independent Test**: Pode ser testado inspecionando as requisições de rede na tela de listagem de grupos e verificando que nenhuma delas inclui `user_id` como query param.

**Acceptance Scenarios**:

1. **Given** o usuário está autenticado, **When** ele acessa a tela de grupos, **Then** a requisição `GET /api/v1/groups` é enviada sem o parâmetro `user_id`.
2. **Given** o usuário está autenticado e pertence a grupos, **When** a listagem é carregada, **Then** os grupos do usuário são exibidos normalmente (comportamento visual não muda).
3. **Given** o usuário não pertence a nenhum grupo, **When** a listagem é carregada, **Then** o estado vazio é exibido normalmente.

---

### Edge Cases

- O que acontece se o objeto do grupo não contiver os dados do membro ao abrir o perfil? O painel não deve abrir, mas o usuário deve receber um feedback visível (ex: toast de erro).
- O que acontece com os demais filtros de grupos (`name`, `status[]`, paginação, ordenação)? Devem continuar funcionando exatamente como antes.
- A remoção de `getUserById` do `userService.ts` não deve quebrar nenhum outro componente ou hook que eventualmente a utilize.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O componente `MemberProfileSheet` DEVE exibir os dados do membro a partir do objeto de usuário recebido por prop, sem realizar nenhuma chamada de API.
- **FR-002**: O componente `MemberProfileSheet` DEVE receber os dados do usuário como prop do componente pai (que já possui esses dados do grupo carregado).
- **FR-003**: A função `getUserById` DEVE ser removida do `userService.ts`.
- **FR-004**: A chamada `GET /api/v1/groups` DEVE ser feita sem o parâmetro `user_id` na query string.
- **FR-005**: Todos os demais parâmetros de listagem de grupos (`name`, `status[]`, `limit`, `offset`, `sort_by`, `sort_direction`) DEVEM continuar sendo enviados normalmente.
- **FR-006**: Nenhuma regressão visual ou funcional deve ser introduzida nas telas de listagem de grupos, detalhes de grupo e perfil de membros.
- **FR-007**: Se os dados do membro estiverem ausentes no objeto do grupo ao tentar abrir o perfil, o painel NÃO DEVE abrir e o sistema DEVE exibir um feedback visível ao usuário (notificação de erro).

### Key Entities

- **MemberProfileSheet**: Componente que exibe o perfil de um membro. Passa a receber `User` como prop em vez de apenas o `id` para busca assíncrona.
- **GroupService**: Serviço de chamadas de API relacionadas a grupos. Perde o parâmetro `user_id` na listagem.
- **UserService**: Serviço de chamadas de API relacionadas a usuários. Perde a função `getUserById`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao clicar em um membro do grupo, zero chamadas de rede são realizadas para o endpoint de usuário — dados são exibidos em menos de 50ms.
- **SC-002**: Nenhuma requisição para `GET /api/v1/users/:id` é enviada pelo frontend em nenhum fluxo.
- **SC-003**: Nenhuma requisição para `GET /api/v1/groups` inclui `user_id` como query param.
- **SC-004**: A tela de grupos continua exibindo os grupos corretos do usuário autenticado sem regressões.
- **SC-005**: Todos os testes existentes continuam passando após as alterações.

## Clarifications

### Session 2026-06-22

- Q: Quando os dados do membro estiverem ausentes ao abrir o perfil, o painel não abre — mas há feedback para o usuário? → A: Sim, não abrir o painel E exibir notificação de erro visível ao usuário.
- Q: Qual a ordem de deploy entre frontend e backend? → A: Frontend primeiro — para de chamar o endpoint antes de ele ser removido, eliminando qualquer janela de falha.

## Assumptions

- O backend será atualizado após o deploy do frontend — os endpoints `GET /users` e `GET /users/:id` só serão removidos depois que o frontend deixar de chamá-los.
- O objeto de grupo retornado pelo `GET /api/v1/groups/:groupID` já contém todos os dados de membros necessários para exibir o perfil (nome, sobrenome, e-mail).
- Não há outro componente ou fluxo no frontend que chame `getUserById` além do `MemberProfileSheet`.
- A mudança na assinatura do `MemberProfileSheet` (de receber `id` para receber `User`) é compatível com todos os lugares que o renderizam.
