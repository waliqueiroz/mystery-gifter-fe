# Research: Correção de Chamadas de API Inseguras no Frontend

**Branch**: `007-fix-insecure-api-calls` | **Date**: 2026-06-22

## Decisão 1: Abordagem de refatoração do MemberProfileSheet

**Decisão**: Alterar a prop de `userId: string | null` para `user: User | null`. Remover toda a lógica assíncrona (fetch, estados de loading/erro, skeleton). O componente passa a ser puramente de apresentação.

**Justificativa**: Os dados do membro já estão no objeto do grupo carregado em memória pelo componente pai (`MemberList`). Re-fetchá-los é redundante e acoplado a um endpoint que será removido. A simplificação também melhora a performance (< 50ms vs. tempo de rede) e elimina estados de loading e erro desnecessários.

**Alternativas consideradas**:
- Manter o fetch mas trocar o endpoint para um contexto de grupo (ex: `GET /groups/:id/users/:userId`): descartado — o backend não tem e não precisa ter esse endpoint; os dados já existem no cliente.
- Cache local com SWR/React Query para evitar refetch: descartado — over-engineering para dados que o pai já possui.

---

## Decisão 2: Escopo da remoção em userService.ts

**Decisão**: Excluir `userService.ts` e `userService.test.ts` inteiramente, pois `getUserById` era a única função do arquivo.

**Justificativa**: Um arquivo de serviço vazio ou com apenas imports não acrescenta valor. Manter o arquivo causaria confusão sobre se ele ainda tem uso. Princípio YAGNI aplicado.

---

## Decisão 3: Remoção de userId de ListGroupsParams

**Decisão**: Remover o campo `userId` de `ListGroupsParams` em `src/types/api.ts` e remover a linha `user_id: userId` da construção de URLSearchParams em `groupService.ts`.

**Justificativa**: O backend passará a ignorar o `user_id` e usar o token JWT. Enviar o parâmetro seria ao mesmo tempo redundante e potencialmente confuso (poderia dar a impressão de que o backend ainda depende dele). Remover do tipo TypeScript garante que nenhum outro caller tente usar o campo.

**Alternativas consideradas**:
- Manter o campo mas marcá-lo como `deprecated` ou opcional sem enviar: descartado — optional fields não utilizados inflam o tipo sem benefício.

---

## Decisão 4: Comportamento de fallback no MemberProfileSheet

**Decisão**: O painel não abre quando `user === null` (comportamento já garantido por `open = user !== null`). Se por algum motivo o clique ocorrer com dado ausente no `MemberList`, um toast de erro deve ser exibido antes de chamar `setSelectedUser`.

**Justificativa**: Clarificação Q3 da spec definiu: não abrir o painel E exibir notificação de erro. Como o TypeScript garante que `user` nos items de `group.users` nunca é null, o toast é uma defesa de runtime para casos imprevistos (ex: mutação incorreta de estado).
