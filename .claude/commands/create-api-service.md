---
description: Use proativamente sempre que o usuário pedir para criar um service, integrar com um endpoint do backend, adicionar chamadas HTTP a um recurso da API, ou implementar qualquer funcionalidade que exija comunicação com o servidor. Gera src/services/api/[nome]Service.ts + [nome]Service.test.ts seguindo os padrões do projeto (http client tipado, typed errors, testes co-localizados). Não usar para editar services já existentes.
---

## Input do usuário

```text
$ARGUMENTS
```

O argumento é uma descrição livre do service a ser criado. Pode incluir o nome do recurso e os endpoints desejados. Se o argumento estiver vazio, peça ao usuário antes de prosseguir.

## O que esta skill faz

Gera dois arquivos em `src/services/api/`:

1. `[nome]Service.ts` — funções puras que chamam o backend via `http`
2. `[nome]Service.test.ts` — testes unitários co-localizados cobrindo sucesso e erros

## Passo a passo

### 1. Extrair informações do argumento

A partir da descrição do usuário, derive:

- **Nome do recurso** (ex.: `payment`, `notification`, `product`) em camelCase → usado como `[nome]Service`
- **Lista de operações** que o serviço precisará expor

Se o argumento não deixar claro quais endpoints criar, faça suposições razoáveis baseadas no nome do recurso e liste-as antes de gerar os arquivos.

### 2. Ler os arquivos de referência

Leia estes arquivos para garantir alinhamento com os padrões atuais do projeto:

- `src/services/api/client.ts` — instância `http` compartilhada
- `src/lib/errors.ts` — classes de erro tipadas disponíveis
- `src/types/api.ts` — tipos de domínio existentes

Se os tipos necessários para o novo service já existirem em `src/types/api.ts`, use-os. Se não existirem, crie as interfaces diretamente no topo do arquivo do service (sem modificar `src/types/api.ts` a menos que o usuário peça explicitamente).

### 3. Gerar o arquivo do service

**Localização**: `src/services/api/[nome]Service.ts`

**Padrões obrigatórios**:

```typescript
// Importações de tipos vêm de @/types/api ou do topo do arquivo
import type { MinhaResposta, MeuPayload } from '@/types/api'
// Importar http do client local
import { http } from './client'
// Importar erros apenas se houver remapeamento de domínio
import { NotFoundError, ConflictError } from '@/lib/errors'
```

**Funções**:

- Sempre funções exportadas nomeadas (nunca default export, nunca classe)
- Retornam `Promise<T>` via `http<T>(url, options?)`
- GET simples: `return http<T>('/api/v1/recurso')`
- GET com query params: usar `URLSearchParams`, appender `?.append()` para arrays
- POST/PUT com body: `return http<T>(url, { method: 'POST', body: JSON.stringify(payload) })`
- DELETE: `return http<T>(url, { method: 'DELETE' })`

**Remapeamento de erros de domínio** (apenas quando necessário):

Quando um erro genérico do HTTP (ex.: `NotFoundError`, `ConflictError`) precisa ser convertido para um erro de domínio mais específico (ex.: `InvalidInviteError`), use `try/catch` na função individual:

```typescript
export async function minhaFuncao(id: string): Promise<Resposta> {
  try {
    return await http<Resposta>(`/api/v1/recurso/${id}`)
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new MeuErroDominio(err.message)
    }
    throw err
  }
}
```

Funções que não precisam remapear erros NÃO usam try/catch — deixam o interceptor cuidar de 401, 403, 404, 500.

**Params com interface** (quando houver 3+ parâmetros ou parâmetros opcionais):

```typescript
export interface ListRecursoParams {
  userId: string
  offset?: number
  limit?: number
  // ...
}

export function listRecurso({ userId, offset = 0, limit = 15 }: ListRecursoParams): Promise<T> {
  // ...
}
```

### 4. Gerar o arquivo de testes

**Localização**: `src/services/api/[nome]Service.test.ts`

**Estrutura obrigatória**:

```typescript
import { funcao1, funcao2 } from './[nome]Service'
import { ApiRequestError, SessionExpiredError, /* outros erros usados */ } from '@/lib/errors'
import type { MeuTipo } from '@/types/api'  // ou do service se definido lá

// Fixtures — objetos mínimos mas válidos
const mockX: MeuTipo = { /* campos obrigatórios */ }

beforeEach(() => {
  global.fetch = jest.fn()
  // SOMENTE se o service usa rotas protegidas (quase todos):
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

**Casos de teste por função**:

Para cada função do service, gere um `describe` com os seguintes `it` (adapte ao que faz sentido):

| Cenário | O que testar |
|---------|--------------|
| Chamada HTTP correta | URL exata, method correto (`expect.objectContaining({ method: 'POST' })`) |
| Retorno no sucesso | `expect(result).toEqual(mockX)` |
| Query params (GET com filtros) | `const url = mock.calls[0][0]; expect(url).toContain('param=valor')` |
| Erro 401 em rota protegida | `rejects.toBeInstanceOf(SessionExpiredError)` + `localStorage.getItem(token) === null` |
| Erro 403 | `toBeInstanceOf(ForbiddenError)` com `.message` do backend |
| Erro 404 | `toBeInstanceOf(NotFoundError)` |
| Erro 409 com remapeamento | Testar cada ramificação do catch |
| Erro 500 genérico | `toBeInstanceOf(ApiRequestError)` com `.status === 500` |

**Regras de nomenclatura dos testes**:

- `describe` e `it` SEMPRE em inglês
- `describe('nomeService')` → `describe('funcaoEspecifica')` (aninhado)
- `it('calls METHOD /api/v1/path with ...')` para chamada HTTP
- `it('returns X on success')` para retorno
- `it('throws XError on STATUS')` para erros

**NÃO testar** o que já é coberto em `client.test.ts`:
- Que o header `Authorization` é enviado (comportamento do interceptor)
- Que `Content-Type: application/json` é definido (comportamento do interceptor)

### 5. Verificar e reportar

Após gerar os arquivos:

1. Execute `npx tsc --noEmit` para confirmar que não há erros de tipo
2. Execute `npx jest src/services/api/[nome]Service.test.ts --no-coverage` para confirmar que os testes passam
3. Se houver falhas, corrija antes de reportar como concluído

Reporte ao usuário:
- Caminho dos dois arquivos criados
- Lista das funções geradas com suas assinaturas
- Cobertura de testes (cenários testados)
- Qualquer decisão de design não-óbvia (ex.: por que remapeou tal erro)

## Referência rápida de erros disponíveis

| Classe | Status | Quando usar no service |
|--------|--------|------------------------|
| `ApiRequestError` | qualquer | Base — raramente instanciada diretamente |
| `SessionExpiredError` | 401 | Lançada pelo interceptor em rotas protegidas — não instanciar no service |
| `UnauthorizedError` | 401 | Lançada pelo interceptor em rotas públicas — não instanciar no service |
| `ForbiddenError` | 403 | Lançada pelo interceptor — não instanciar no service |
| `NotFoundError` | 404 | Lançada pelo interceptor; remapear se precisar de erro de domínio |
| `ConflictError` | 409 | Lançada pelo interceptor; remapear se precisar de erro de domínio |
| `InviteError` | base | Para erros de convite específicos do domínio |
| `InvalidInviteError` | 404/409 | Exemplo de erro de domínio — crie análogos conforme necessário |
| `DrawCompletedError` | 409 | Exemplo de erro de domínio |

## Exemplos de padrões para cada método HTTP

### GET sem parâmetros

```typescript
export function getRecurso(id: string): Promise<Recurso> {
  return http<Recurso>(`/api/v1/recursos/${id}`)
}
```

### GET com query params e parâmetros opcionais

```typescript
export interface ListRecursosParams {
  userId: string
  offset?: number
  limit?: number
  name?: string
  statuses?: RecursoStatus[]
}

export function listRecursos({
  userId,
  offset = 0,
  limit = 15,
  name,
  statuses = ['ATIVO'],
}: ListRecursosParams): Promise<RecursoSearchResult> {
  const params = new URLSearchParams({
    user_id: userId,
    limit: String(limit),
    offset: String(offset),
  })
  if (name) params.set('name', name)
  statuses.forEach((s) => params.append('status', s))
  return http<RecursoSearchResult>(`/api/v1/recursos?${params.toString()}`)
}
```

### POST com body

```typescript
export function createRecurso(payload: CreateRecursoPayload): Promise<Recurso> {
  return http<Recurso>('/api/v1/recursos', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
```

### PUT com body

```typescript
export function updateRecurso(id: string, payload: UpdateRecursoPayload): Promise<Recurso> {
  return http<Recurso>(`/api/v1/recursos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
```

### DELETE

```typescript
export function deleteRecurso(id: string): Promise<void> {
  return http<void>(`/api/v1/recursos/${id}`, {
    method: 'DELETE',
  })
}
```

### POST sem body (ação sobre recurso)

```typescript
export function activateRecurso(id: string): Promise<Recurso> {
  return http<Recurso>(`/api/v1/recursos/${id}/activate`, {
    method: 'POST',
  })
}
```
