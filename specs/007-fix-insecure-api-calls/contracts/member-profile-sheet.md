# Component Contract: MemberProfileSheet

**Feature**: `007-fix-insecure-api-calls` | **Date**: 2026-06-22

## Antes

```typescript
interface MemberProfileSheetProps {
  userId: string | null   // ID do membro; null fecha o sheet
  onClose: () => void
}
```

O componente fazia fetch de `GET /api/v1/users/:userId` internamente, gerenciando estados de loading, error e dados assíncronos.

## Depois

```typescript
interface MemberProfileSheetProps {
  user: User | null   // Objeto do membro já carregado; null fecha o sheet
  onClose: () => void
}
```

O componente é puramente de apresentação — renderiza os dados recebidos por prop diretamente, sem chamadas de rede.

## Comportamentos

| Situação | Comportamento |
|----------|--------------|
| `user !== null` | Sheet abre e exibe `user.name`, `user.surname`, `user.email` |
| `user === null` | Sheet permanece fechado |
| Usuário fecha o sheet | Chama `onClose()` |

## Contrato de Integração com MemberList

O componente pai (`MemberList`) é responsável por:
- Manter estado `selectedUser: User | null`
- Definir `selectedUser` ao clicar em um membro da lista
- Passar `user={selectedUser}` ao `MemberProfileSheet`
- Limpar o estado via `onClose={() => setSelectedUser(null)}`
- Exibir toast de erro se por algum motivo o click ocorrer com dado ausente (defesa de runtime)

## Tipo User

```typescript
interface User {
  id: string
  name: string
  surname: string
  email: string
  created_at: string
  updated_at: string
}
```
