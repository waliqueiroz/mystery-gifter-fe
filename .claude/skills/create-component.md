# Skill: Criar componente React

Use esta skill sempre que precisar criar um novo componente React no projeto mystery-gifter-fe.

## Estrutura de diretório

Todo componente vive em sua própria pasta, com o mesmo nome do arquivo:

```
src/components/<area>/<ComponentName>/
  ComponentName.tsx
  ComponentName.test.tsx
```

Exemplos de `<area>`: `ui/`, `groups/`, `profile/`, `invite/`, `auth/`, `landing/`, `login/`, `register/`.

**Nunca** criar componentes como arquivo plano na raiz do diretório de área.

## Template de componente

```tsx
// Adicionar 'use client' SOMENTE quando necessário:
// - hooks de browser (useRouter, usePathname, useSearchParams, useState, useEffect, useRef)
// - context providers / consumers
// - event handlers definidos no componente
// - leitura de localStorage
'use client'

import { cn } from '@/lib/cn'

// Props: sempre interface nomeada — NUNCA inline anônima
interface ComponentNameProps {
  // propriedades...
  className?: string
}

// Exportação nomeada — NUNCA default export
export function ComponentName({ prop, className }: ComponentNameProps) {
  return (
    <div className={cn('classes-base', className)}>
      {/* conteúdo */}
    </div>
  )
}
```

## Regras de export

- **Sempre** `export function ComponentName` (named export)
- **Nunca** `export default function ComponentName`
- Exceção: arquivos `page.tsx` do Next.js DEVEM ser `export default` (requisito do framework)

## Regras de props

- Interface nomeada: `interface ComponentNameProps { ... }` — sempre
- Nunca usar inline anônima: `{ prop }: { prop: string }` — proibido
- Aceitar `className?: string` quando o componente renderiza um elemento raiz estilizável
- Para variants/shapes/sizes, usar `type` union, não `enum`:
  ```ts
  // ✅ Correto
  type ComponentVariant = 'primary' | 'secondary' | 'outline'

  // ❌ Proibido
  enum ComponentVariant { Primary = 'primary', ... }
  ```

## Composição de classes com cn()

Usar `cn()` de `@/lib/cn` **somente** quando houver lógica condicional no className:

```tsx
// ✅ Usar cn() — há condicional
className={cn('base-class', isActive && 'active-class', className)}

// ✅ String estática — não precisa de cn()
className="base-class static-class"

// ❌ Não usar template string com ternário
className={`base-class ${isActive ? 'active-class' : ''}`}
```

Para lookup tables de variantes (padrão de Button, GroupStatusBadge):

```tsx
const VARIANT_CLASSES: Record<ComponentVariant, string> = {
  primary: 'bg-mg-green text-black',
  secondary: 'bg-mg-surface-2 text-mg-text',
}

// No JSX:
className={cn('base', VARIANT_CLASSES[variant], className)}
```

## Tokens de design

Usar sempre os tokens do design system. **Nunca** hardcodar cores ou espaçamentos fora de `tailwind.config.ts` ou `globals.css`.

| Categoria | Tokens disponíveis |
|---|---|
| Cores de fundo | `bg-mg-bg`, `bg-mg-surface`, `bg-mg-surface-2`, `bg-mg-surface-3` |
| Texto | `text-mg-text`, `text-mg-text-muted`, `text-mg-text-negative` |
| Verde funcional | `text-mg-green`, `bg-mg-green` — apenas em CTAs e estados ativos |
| Borda | `border-mg-border-light` |
| Bordas arredondadas | `rounded-pill`, `rounded-pill-lg`, `rounded-full`, `rounded-card`, `rounded-card-sm` |
| Sombras | `shadow-mg-inset`, `shadow-mg-card`, `shadow-mg-dialog` |

## 'use client' — quando usar

| Precisa de | Usar 'use client'? |
|---|---|
| `useState`, `useEffect`, `useRef` | Sim |
| `useRouter`, `usePathname`, `useSearchParams` | Sim |
| `useContext` / Context Provider | Sim |
| `localStorage` / `sessionStorage` | Sim |
| `@radix-ui` (Dialog, etc.) | Sim |
| Apenas props + JSX estático | Não |
| Componentes que só compõem outros Server Components | Não |

## Loading state

Usar `react-loading-skeleton` via `<SkeletonBox>`, `<SkeletonText>`, `<SkeletonCircle>` — **nunca spinners**.

Para evitar flash de skeleton em carregamentos rápidos:

```tsx
import { useDelayedFlag } from '@/hooks/useDelayedFlag'

const showSkeleton = useDelayedFlag(loading, 150)
```

## Estados vazios e de erro

Usar o componente compartilhado `<EmptyState>`:

```tsx
import { EmptyState } from '@/components/ui/EmptyState/EmptyState'

// Estado vazio
<EmptyState
  icon={<Icon name="Inbox" size={28} />}
  title="Nenhum item encontrado"
  description="Crie o primeiro item para começar."
  cta={{ label: 'Criar item', href: '/items/new' }}
/>

// Estado de erro
<EmptyState
  variant="error"
  icon={<Icon name="CircleAlert" size={28} />}
  title="Erro ao carregar"
  description={errorMessage}
  cta={{ label: 'Tentar novamente', onClick: handleRetry }}
/>
```

**Nunca** criar variações ad-hoc de estado vazio/erro.

## Ícones

Usar o wrapper `<Icon>` de `@/components/ui/Icon/Icon`:

```tsx
import { Icon, type IconName } from '@/components/ui/Icon/Icon'

<Icon name="Gift" size={24} aria-hidden />
```

Ícones decorativos: sempre `aria-hidden`. Ícones funcionais: sempre `aria-label` no elemento pai ou no próprio ícone.

## A11y

- `role="alert"` em mensagens de erro inline
- `role="status"` em estados vazios / informativos
- `aria-label` em botões que só têm ícone (sem texto visível)
- `aria-current="page"` em links de navegação ativos
- `aria-pressed` em botões toggle
- `aria-invalid` + `aria-describedby` em inputs com erro
- Contraste mínimo 4.5:1 (WCAG AA) — os tokens do design system já garantem isso

## Async em handlers e useEffect

Sempre `async/await` com `try/catch/finally` — nunca `.then().catch()`:

```tsx
useEffect(() => {
  async function load() {
    try {
      const data = await fetchSomething()
      setState(data)
    } catch (err) {
      showToast({ message: err instanceof Error ? err.message : 'Erro.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }
  load()
}, [deps])
```

## Template de teste co-localizado

```tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

// Mocks necessários aqui

describe('ComponentName', () => {
  it('renders the main content', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<ComponentName variant="primary" />)
    expect(screen.getByRole('...')).toHaveClass('bg-mg-green')
  })
})
```

Regras de teste:
- Descrições (`describe`/`it`) sempre em **inglês**
- Importar o componente com named import: `import { ComponentName } from './ComponentName'`
- Cobertura mínima: 80% de linhas em arquivos modificados
- Usar `@testing-library/react` + `@testing-library/user-event`
- Testar comportamento (o que o usuário vê), não implementação interna

## Strings de UI

Sempre em **pt-BR**. URLs e paths em inglês (`/register`, não `/registro`).
