---
name: create-component
description: >
  Use this skill whenever you need to create a new React component in this project —
  whether the user asks to "build a card", "add a form", "create a component for X",
  or implement any UI feature that requires a new .tsx file. Also use it proactively
  when implementing a feature that will need new components, even if the user didn't
  say "create a component" explicitly. Covers: directory structure, export style,
  props interface, className composition, 'use client' rules, loading/empty states,
  accessibility, async patterns, and co-located test conventions.
---

# Criar componente React

Antes de começar, leia os componentes existentes na área em que você vai trabalhar — especialmente os primitivos de UI compartilhados — para evitar duplicar código e garantir consistência com o que já existe.

## Estrutura de diretório

Todo componente vive em sua própria pasta, nomeada igual ao arquivo:

```
src/components/<area>/<ComponentName>/
  ComponentName.tsx
  ComponentName.test.tsx
```

Nunca criar componentes como arquivo plano na raiz do diretório de área.

## Template

```tsx
// 'use client' somente quando necessário — ver tabela abaixo
'use client'

import { cn } from '@/lib/cn'

// Interface nomeada obrigatória — nunca inline anônima
interface ComponentNameProps {
  className?: string
}

// Named export obrigatório — nunca default export
export function ComponentName({ className }: ComponentNameProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* conteúdo */}
    </div>
  )
}
```

## Exports

| Situação | Export |
|---|---|
| Todo componente de UI/feature | `export function ComponentName` |
| `page.tsx` do Next.js | `export default` (requisito do framework) |

## Props

- Sempre `interface ComponentNameProps { ... }` — nunca inline anônima (`{ prop }: { prop: string }`)
- Aceitar `className?: string` quando o componente expõe um elemento raiz estilizável
- Para variantes, usar `type` union — nunca `enum`:

```ts
// ✅
type Variant = 'primary' | 'secondary' | 'outline'

// ❌ proibido
enum Variant { Primary = 'primary', ... }
```

## Composição de classes

Usar `cn()` **somente** quando houver lógica condicional no className:

```tsx
// ✅ condicional — use cn()
className={cn('base', isActive && 'active', className)}

// ✅ estático — string direta, sem cn()
className="base static"

// ❌ nunca template string com ternário
className={`base ${isActive ? 'active' : ''}`}
```

Para lookup tables de variantes:

```tsx
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: '...',
  secondary: '...',
}

className={cn('base', VARIANT_CLASSES[variant], className)}
```

## Tokens de design

`DESIGN.md` (na raiz do projeto) é a fonte primária de verdade para identidade visual: paleta de cores, tipografia, espaçamento, raios de borda e regras de uso. `tailwind.config.ts` e `globals.css` são a implementação desses tokens em código.

Antes de estilizar qualquer componente novo, consulte o `DESIGN.md`. Nunca hardcode cores, sombras ou espaçamentos fora de `tailwind.config.ts` / `globals.css`.

## 'use client'

| Precisa de | 'use client'? |
|---|---|
| `useState`, `useEffect`, `useRef` | Sim |
| `useRouter`, `usePathname`, `useSearchParams` | Sim |
| `useContext` / Context Provider | Sim |
| `localStorage` / `sessionStorage` | Sim |
| Bibliotecas com estado (Radix, etc.) | Sim |
| Só props + JSX estático | Não |
| Compõe apenas Server Components | Não |

## Loading state

Verificar se o projeto já tem componentes skeleton antes de criar loading states. Nunca usar spinners — o padrão do projeto é skeleton. Se existir um hook de delay (ex.: `useDelayedFlag`), usá-lo para evitar flash em carregamentos rápidos.

## Estados vazios e de erro

Verificar se o projeto já tem um componente compartilhado para estado vazio/erro (ex.: `EmptyState`). Nunca criar variações ad-hoc — usar o que existe com as props adequadas.

## Ícones

Verificar qual biblioteca o projeto usa e se há um wrapper (ex.: `<Icon name="..." />`). Preferir o wrapper ao importar ícones diretamente.

- Ícones decorativos: `aria-hidden`
- Ícones funcionais: `aria-label` no elemento pai ou no ícone

## A11y

- `role="alert"` em erros inline
- `role="status"` em estados informativos / vazios
- `aria-label` em botões icon-only
- `aria-current="page"` em links de navegação ativos
- `aria-pressed` em botões toggle
- `aria-invalid` + `aria-describedby` em inputs com erro
- Contraste mínimo 4.5:1 (WCAG AA)

## Async

Sempre `async/await` com `try/catch/finally` — nunca `.then().catch()`:

```tsx
useEffect(() => {
  async function load() {
    try {
      const data = await fetchSomething()
      setState(data)
    } catch (err) {
      // tratar erro
    } finally {
      setLoading(false)
    }
  }
  load()
}, [deps])
```

## Teste co-localizado

```tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders the main content', () => {
    render(<ComponentName />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<ComponentName variant="primary" />)
    expect(screen.getByRole('...')).toHaveClass('...')
  })
})
```

- `describe`/`it` sempre em **inglês**
- Named import: `import { ComponentName } from './ComponentName'`
- Testar comportamento visível, não implementação interna
- Atingir a cobertura mínima definida no projeto
