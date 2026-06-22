# Tasks: Correção de Chamadas de API Inseguras no Frontend

**Input**: Design documents from `/specs/007-fix-insecure-api-calls/`
**Branch**: `007-fix-insecure-api-calls`

## Format: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a tarefa pertence (US1, US2)

---

## Phase 1: Foundational — Nenhum setup necessário

Esta feature é exclusivamente uma refatoração em arquivos existentes. Nenhuma dependência nova ou configuração de ambiente é necessária. Prosseguir diretamente para as User Stories.

---

## Phase 2: User Story 1 — MemberProfileSheet via prop, sem chamada de API (Priority: P1) 🎯 MVP

**Goal**: Ao clicar num membro, o perfil é exibido instantaneamente com dados já disponíveis no grupo — sem nenhuma chamada de rede.

**Independent Test**: Abrir a tela de detalhes de um grupo, clicar em um membro e verificar no DevTools (aba Network) que nenhuma requisição para `/api/v1/users/` é disparada. O painel deve abrir em menos de 50ms.

- [ ] T001 [US1] Refatorar `src/components/groups/MemberProfileSheet/MemberProfileSheet.tsx`: alterar prop de `userId: string | null` para `user: User | null`; remover imports de `getUserById`, `useCallback`, `useEffect`, `useDelayedFlag`, `NotFoundError`; remover estados `loading`, `error`, `userData` e a função `fetchUser`; remover renderização de skeleton e estado de erro; renderizar `user.name`, `user.surname`, `user.email` diretamente da prop
- [ ] T002 [US1] Atualizar `src/components/groups/MemberList/MemberList.tsx`: renomear estado `selectedUserId: string | null` para `selectedUser: User | null`; alterar `setSelectedUserId(user.id)` para `setSelectedUser(user)` no onClick; adicionar guard de toast se `user` for falsy (defesa de runtime); atualizar `<MemberProfileSheet user={selectedUser} onClose={() => setSelectedUser(null)} />`
- [ ] T003 [P] [US1] Atualizar `src/components/groups/MemberProfileSheet/MemberProfileSheet.test.tsx`: adaptar testes para nova assinatura de props (`user: User | null` em vez de `userId`); remover testes de estados de loading, erro de rede e retry; adicionar testes para: sheet abre quando `user !== null`, exibe nome/sobrenome/email, fecha via `onClose`
- [ ] T004 [P] [US1] Atualizar `src/components/groups/MemberList/MemberList.test.tsx`: atualizar mocks e asserções para refletir que o clique no membro agora passa o objeto `User` completo ao `MemberProfileSheet` em vez do `userId`
- [ ] T005 [US1] Excluir `src/services/api/userService.ts` (arquivo inteiro — `getUserById` era a única função)
- [ ] T006 [US1] Excluir `src/services/api/userService.test.ts` (arquivo inteiro — testava apenas `getUserById`)
- [ ] T007 [US1] Executar `npx jest --testPathPattern="MemberProfileSheet|MemberList"` e corrigir qualquer falha antes de prosseguir

**Checkpoint**: Nenhuma referência a `getUserById` ou `/api/v1/users/:id` existe no codebase. Testes de `MemberProfileSheet` e `MemberList` passam. Abrir o perfil de um membro não gera chamada de rede.

---

## Phase 3: User Story 2 — Remoção de user_id do listGroups (Priority: P2)

**Goal**: A chamada `GET /api/v1/groups` não inclui `user_id` como query param. O backend usa o token JWT para filtrar.

**Independent Test**: Acessar a tela de grupos e verificar no DevTools (aba Network) que a URL da chamada não contém `user_id=`. Os grupos continuam sendo exibidos corretamente.

- [ ] T008 [US2] Remover o campo `userId: string` de `ListGroupsParams` em `src/types/api.ts`
- [ ] T009 [US2] Remover `user_id: userId` da construção de `URLSearchParams` em `src/services/api/groupService.ts`; remover `userId` do parâmetro `{ userId, offset, ... }` da função `listGroups`
- [ ] T010 [US2] Atualizar `src/components/groups/GroupList/GroupList.tsx`: remover `userId` do argumento passado a `listGroups`; substituir guard `if (!userId)` por `if (!user)` nas verificações de carregamento
- [ ] T011 [US2] Atualizar testes de `src/services/api/groupService.test.ts`: remover assertions que verificam `user_id=u1` na URL; atualizar chamadas de `listGroups({ userId: 'u1', ... })` para `listGroups({ offset: 0, limit: 15, ... })`
- [ ] T012 [US2] Executar `npx jest --testPathPattern="groupService|GroupList"` e corrigir qualquer falha antes de prosseguir

**Checkpoint**: Nenhuma referência a `userId` em `ListGroupsParams` ou na URL de `listGroups`. Testes de `groupService` passam. A tela de grupos carrega normalmente.

---

## Phase 4: Polish & Validação Final

**Propósito**: Confirmar ausência de regressões em toda a suite antes de abrir PR.

- [ ] T013 Executar `npx jest` (suite completa) e confirmar que todos os testes passam sem regressões

---

## Dependencies & Execution Order

### Dependências entre phases

- **Phase 2 (US1)**: Pode começar imediatamente — não há foundational bloqueante
- **Phase 3 (US2)**: Pode começar em paralelo com Phase 2 (arquivos completamente diferentes)
- **Phase 4 (Polish)**: Depende de Phase 2 e Phase 3 completos

### Dentro de cada User Story

- T001 deve preceder T002 (MemberList depende da nova assinatura de MemberProfileSheet)
- T003 e T004 podem rodar em paralelo com T001/T002 (testes em arquivos separados)
- T005 e T006 podem rodar em paralelo (T001 e T002 devem estar concluídos para garantir que não há mais imports de `getUserById`)
- T008 deve preceder T009 e T010 (remover do tipo antes de remover do uso)

### Oportunidades de paralelismo

```bash
# Phase 2 — após T001:
T002: Atualizar MemberList.tsx
T003: Atualizar MemberProfileSheet.test.tsx
T004: Atualizar MemberList.test.tsx

# Phase 3 — pode rodar junto com Phase 2:
T008: Remover userId de types/api.ts
T009: Remover user_id de groupService.ts
T010: Atualizar GroupList.tsx
T011: Atualizar groupService.test.ts
```

---

## Implementation Strategy

### MVP (US1 apenas)

1. Completar T001 → T002 → T003/T004 → T005/T006 → T007
2. **Validar**: Nenhuma chamada a `/api/v1/users/:id`; testes passam
3. Commitar

### Entrega Incremental

1. Phase 2 → Validar US1 → Commitar
2. Phase 3 → Validar US2 → Commitar
3. Phase 4 → Commitar e abrir PR (antes do backend remover os endpoints)

---

## Notes

- [P] = arquivos diferentes, sem dependências entre si
- T005 e T006 (exclusão de arquivos) só devem ser feitos após T001 e T002 garantirem que não há mais imports de `getUserById` em nenhum arquivo
- O deploy deste PR deve preceder o deploy do backend (`005-fix-user-endpoints-security`)
- Verificar no DevTools após cada checkpoint que nenhuma chamada indesejada é disparada
