---
name: create-api-service
description: >
  Use proativamente sempre que o usuário pedir para criar um service, integrar com um
  endpoint do backend, adicionar chamadas HTTP a um recurso da API, ou implementar
  qualquer funcionalidade que exija comunicação com o servidor. Usar também
  proativamente ao implementar features que precisarão de services de API, mesmo que
  o usuário não peça explicitamente — se a feature envolve buscar, criar, atualizar ou
  deletar dados no backend, esta skill deve ser usada. Gera
  src/services/api/[nome]Service.ts + [nome]Service.test.ts seguindo os padrões do
  projeto (http client tipado, typed errors, testes co-localizados). Não usar para
  editar services já existentes.
---

# Criar API service

Antes de gerar qualquer arquivo, leia os arquivos de referência abaixo para garantir alinhamento com os padrões atuais do projeto.

## Arquivos de referência obrigatórios

- `src/services/api/client.ts` — instância `http` compartilhada
- `src/lib/errors.ts` — classes de erro tipadas disponíveis
- `src/types/api.ts` — tipos de domínio existentes
- Um service existente similar (ex.: `groupService.ts` para recursos protegidos, `authService.ts` para rotas públicas)

Todos os tipos de domínio (interfaces de request, response, payloads e enums) devem ser declarados em `src/types/api.ts`. Se os tipos necessários ainda não existirem, crie-os lá antes de gerar o service.

## Passo 1 — Derivar informações do pedido

A partir da solicitação do usuário, derive:

- **Nome do recurso** (ex.: `payment`, `notification`, `product`) em camelCase → nomeia `[nome]Service.ts`
- **Lista de operações** que o service precisará expor
- **Tipo de rota**: protegida (maioria) ou pública (login, registro)

Se não ficar claro quais endpoints criar, liste suposições razoáveis antes de gerar os arquivos.

## Passo 2 — Gerar o arquivo do service

**Localização**: `src/services/api/[nome]Service.ts`

### Importações

```typescript
import type { MinhaResposta, MeuPayload } from '@/types/api'
import { http } from './client'
// Importar erros SOMENTE se houver remapeamento de domínio
import { NotFoundError, ConflictError } from '@/lib/errors'
```

### Funções

- Sempre funções exportadas nomeadas — nunca default export, nunca classe
- Retornam `Promise<T>` via `http<T>(url, options?)`
- GET simples: `return http<T>('/api/v1/recurso')`
- GET com query params: construir com `URLSearchParams`; usar `.append()` para arrays
- POST/PUT com body: `return http<T>(url, { method: 'POST', body: JSON.stringify(payload) })`
- DELETE: `return http<T>(url, { method: 'DELETE' })`

### Interface de params (quando houver 3+ parâmetros ou parâmetros opcionais)

Declare a interface em `src/types/api.ts`, depois importe no service:

```typescript
// src/types/api.ts
export interface ListRecursoParams {
  userId: string
  offset?: number
  limit?: number
}

// src/services/api/[nome]Service.ts
import type { ListRecursoParams } from '@/types/api'

export function listRecurso({ userId, offset = 0, limit = 15 }: ListRecursoParams): Promise<T> {
  // ...
}
```

### Remapeamento de erros de domínio

Use `try/catch` **apenas** quando precisar converter um erro HTTP genérico em um erro de domínio específico. Funções sem remapeamento deixam o interceptor tratar 401/403/404/500.

```typescript
export async function minhaFuncao(id: string): Promise<Resposta> {
  try {
    return await http<Resposta>(`/api/v1/recurso/${id}`)
  } catch (err) {
    if (err instanceof NotFoundError) throw new MeuErroDominio(err.message)
    throw err
  }
}
```

### Exemplos por método HTTP

```typescript
// GET sem params
export function getRecurso(id: string): Promise<Recurso> {
  return http<Recurso>(`/api/v1/recursos/${id}`)
}

// GET com query params e arrays
export function listRecursos({ userId, name, statuses = ['ATIVO'] }: ListRecursosParams): Promise<SearchResult> {
  const params = new URLSearchParams({ user_id: userId })
  if (name) params.set('name', name)
  statuses.forEach((s) => params.append('status', s))
  return http<SearchResult>(`/api/v1/recursos?${params.toString()}`)
}

// POST com body
export function createRecurso(payload: CreateRecursoPayload): Promise<Recurso> {
  return http<Recurso>('/api/v1/recursos', { method: 'POST', body: JSON.stringify(payload) })
}

// PUT com body
export function updateRecurso(id: string, payload: UpdateRecursoPayload): Promise<Recurso> {
  return http<Recurso>(`/api/v1/recursos/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

// DELETE
export function deleteRecurso(id: string): Promise<void> {
  return http<void>(`/api/v1/recursos/${id}`, { method: 'DELETE' })
}

// POST sem body (ação sobre recurso)
export function activateRecurso(id: string): Promise<Recurso> {
  return http<Recurso>(`/api/v1/recursos/${id}/activate`, { method: 'POST' })
}
```

## Passo 3 — Gerar o arquivo de testes

**Localização**: `src/services/api/[nome]Service.test.ts`

### Estrutura base para rotas protegidas (maioria)

```typescript
import { funcao1, funcao2 } from './[nome]Service'
import { ApiRequestError, SessionExpiredError, /* outros */ } from '@/lib/errors'
import type { MeuTipo } from '@/types/api'

const mockX: MeuTipo = { /* campos obrigatórios com valores mínimos válidos */ }

beforeEach(() => {
  global.fetch = jest.fn()
  localStorage.setItem('mystery_gifter_token', 'test-token')
})

afterEach(() => {
  jest.resetAllMocks()
  localStorage.clear()
})

function mockFetch(status: number, body: unknown) {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}
```

Para rotas **públicas** (ex.: login, registro): omitir o `localStorage.setItem` do `beforeEach`.

### Casos de teste por função

Para cada função, crie um `describe` aninhado com:

| Cenário | Assertion |
|---------|-----------|
| Chamada HTTP correta | `expect(global.fetch).toHaveBeenCalledWith('/api/v1/path', expect.objectContaining({ method: 'POST' }))` |
| URL com path param | `expect(global.fetch).toHaveBeenCalledWith('/api/v1/path/id', expect.any(Object))` |
| Query params | `const url = (global.fetch as jest.Mock).mock.calls[0][0]; expect(url).toContain('param=valor')` |
| Retorno no sucesso | `expect(result).toEqual(mockX)` |
| 401 em rota protegida | `rejects.toBeInstanceOf(SessionExpiredError)` + `expect(localStorage.getItem('mystery_gifter_token')).toBeNull()` |
| 403 | `toBeInstanceOf(ForbiddenError)` com `.message` do backend |
| 404 | `toBeInstanceOf(NotFoundError)` |
| 409 com remapeamento | Testar cada ramificação do `catch` separadamente |
| 500 genérico | `toBeInstanceOf(ApiRequestError)` com `.status === 500` |

**Não testar** o que já é coberto em `client.test.ts`:
- Que o header `Authorization` é enviado (comportamento do interceptor)
- Que `Content-Type: application/json` é definido (comportamento do interceptor)

A exceção é `authService.test.ts` que testa ausência do `Authorization` em rotas públicas — faça o mesmo quando relevante.

### Nomenclatura

- `describe` e `it` SEMPRE em inglês
- `describe('[nome]Service')` → `describe('funcaoEspecifica')` (aninhado)
- `it('calls METHOD /api/v1/path ...')` para verificar chamada HTTP
- `it('returns X on success')` para retorno
- `it('throws XError on STATUS')` para erros

## Passo 4 — Verificar e reportar

1. Execute `npx tsc --noEmit` — sem erros de tipo
2. Execute `npx jest src/services/api/[nome]Service.test.ts --no-coverage` — todos os testes passam
3. Corrija eventuais falhas antes de reportar como concluído

Reporte ao usuário:
- Caminho dos dois arquivos criados
- Assinaturas das funções geradas
- Cenários cobertos pelos testes
- Decisões de design não-óbvias (ex.: por que remapeou determinado erro)

## Referência de erros disponíveis

| Classe | Status HTTP | Quem lança |
|--------|------------|------------|
| `ApiRequestError` | qualquer | Base — raramente instanciada diretamente |
| `SessionExpiredError` | 401 | Interceptor (rotas protegidas) — não instanciar no service |
| `UnauthorizedError` | 401 | Interceptor (rotas públicas) — não instanciar no service |
| `ForbiddenError` | 403 | Interceptor — não instanciar no service |
| `NotFoundError` | 404 | Interceptor; remapear se precisar de erro de domínio |
| `ConflictError` | 409 | Interceptor; remapear se precisar de erro de domínio |
| `InviteError` | base | Superclasse para erros de convite — raramente instanciada diretamente |
| `InvalidInviteError` | 404 ou 409 | Erro de domínio — crie análogos para outros domínios |
| `DrawCompletedError` | 409 | Erro de domínio específico de sorteio |
