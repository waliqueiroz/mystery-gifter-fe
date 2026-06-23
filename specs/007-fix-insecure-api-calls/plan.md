# Implementation Plan: Correção de Chamadas de API Inseguras no Frontend

**Branch**: `007-fix-insecure-api-calls` | **Date**: 2026-06-22 | **Spec**: [spec.md](spec.md)

## Summary

Remoção da chamada ao endpoint `GET /api/v1/users/:id` no `MemberProfileSheet`, substituindo a busca assíncrona por exibição direta dos dados do membro já disponíveis no objeto do grupo. Remoção do parâmetro `user_id` da chamada a `GET /api/v1/groups`, visto que o backend passa a extrair o usuário autenticado diretamente do token. O frontend deve ser deployado antes do backend remover os endpoints.

## Technical Context

**Language/Version**: TypeScript (Next.js App Router)
**Primary Dependencies**: React, Next.js, jest + React Testing Library
**Storage**: N/A (somente chamadas REST)
**Testing**: Jest + React Testing Library
**Target Platform**: Navegador web (mobile-first)
**Project Type**: web-app (Next.js)
**Performance Goals**: Exibição de perfil de membro em < 50ms (sem chamada de rede)
**Constraints**: Deploy deve preceder o backend; zero regressões visuais ou de teste

## Constitution Check

Não há constituição formal no repositório frontend. As seguintes diretrizes foram aplicadas:

| Critério | Status | Observação |
|---|---|---|
| Remoção de dependência de endpoint inseguro | ✅ | `getUserById` removido de `userService.ts` |
| Sem regressão de testes | ✅ | Testes de `userService.test.ts` excluídos; testes de `groupService.test.ts` e componentes atualizados |
| Zero impacto visual ao usuário final | ✅ | Dados exibidos instantaneamente a partir do estado do grupo |
| Contrato de componente simplificado | ✅ | `MemberProfileSheet` perde estado assíncrono; prop muda de `userId: string` para `user: User` |

## Project Structure

### Documentation (this feature)

```text
specs/007-fix-insecure-api-calls/
├── plan.md              # Este arquivo
├── research.md          # Fase 0
├── contracts/
│   └── member-profile-sheet.md   # Contrato do componente refatorado
└── tasks.md             # Gerado por /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── services/api/
│   ├── userService.ts               # Excluir o arquivo (getUserById era a única função)
│   ├── userService.test.ts          # Excluir o arquivo (testava apenas getUserById)
│   ├── groupService.ts              # Remover user_id de listGroups e simplificar ListGroupsParams
│   └── groupService.test.ts         # Atualizar: remover assertion de user_id= na URL
├── types/
│   └── api.ts                       # Remover campo userId de ListGroupsParams
└── components/groups/
    ├── MemberProfileSheet/
    │   ├── MemberProfileSheet.tsx         # Refatorar: receber User | null por prop; remover fetch assíncrono
    │   └── MemberProfileSheet.test.tsx    # Atualizar: nova assinatura de props; remover testes de estado de loading/erro de rede
    └── MemberList/
        ├── MemberList.tsx                 # Alterar: selectedUserId → selectedUser (User | null); passar user ao Sheet
        └── MemberList.test.tsx            # Atualizar: novo estado e novo prop do Sheet
```
