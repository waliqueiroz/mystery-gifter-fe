# Skill: Criar componente React

Use esta skill sempre que precisar criar um novo componente React neste projeto.

Antes de começar, leia os componentes existentes para entender os padrões em uso — especialmente os primitivos de UI compartilhados. Isso evita criar código duplicado e garante consistência.

## Estrutura de diretório

Todo componente vive em sua própria pasta, com o mesmo nome do arquivo:

```
src/components/<area>/<ComponentName>/
  ComponentName.tsx
  ComponentName.test.tsx
```

**Nunca** criar componentes como arquivo plano na raiz do diretório de área.

## Template de componente

```tsx
// Adicionar 'use client' SOMENTE quando necessário (ver seção abaixo)
'use client'

// Importar utilitário de composição de classes do projeto
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

## Composição de classes

Usar o helper `cn()` do projeto **somente** quando houver lógica condicional no className:

```tsx
// ✅ Usar cn() — há condicional
className={cn('base-class', isActive && 'active-class', className)}

// ✅ String estática — não precisa de cn()
className="base-class static-class"

// ❌ Não usar template string com ternário
className={`base-class ${isActive ? 'active-class' : ''}`}
```

Para lookup tables de variantes:

```tsx
const VARIANT_CLASSES: Record<ComponentVariant, string> = {
  primary: 'token-de-destaque',
  secondary: 'token-secundario',
}

// No JSX:
className={cn('base', VARIANT_CLASSES[variant], className)}
```

## Tokens de design

Usar sempre os tokens do design system definidos em `tailwind.config.ts` e `globals.css`. **Nunca** hardcodar cores, espaçamentos ou sombras fora desses dois arquivos — consulte-os antes de estilizar um componente novo.

## 'use client' — quando usar

| Precisa de | Usar 'use client'? |
|---|---|
| `useState`, `useEffect`, `useRef` | Sim |
| `useRouter`, `usePathname`, `useSearchParams` | Sim |
| `useContext` / Context Provider | Sim |
| `localStorage` / `sessionStorage` | Sim |
| Bibliotecas de UI com estado (Radix, etc.) | Sim |
| Apenas props + JSX estático | Não |
| Componentes que só compõem outros Server Components | Não |

## Loading state

Verificar se o projeto já tem componentes skeleton antes de criar loading states. Nunca usar spinners — o padrão do projeto é skeleton.

Para evitar flash de skeleton em carregamentos rápidos, verificar se o projeto tem um hook de delay (ex.: `useDelayedFlag`) e usá-lo.

## Estados vazios e de erro

Antes de criar um estado vazio ou de erro, verificar se o projeto já tem um componente compartilhado para isso (ex.: `EmptyState`). **Nunca** criar variações ad-hoc — usar o componente existente com as props adequadas.

## Ícones

Verificar qual biblioteca de ícones o projeto usa e se há um componente wrapper (ex.: `<Icon name="..." />`). Preferir sempre o wrapper ao invés de importar ícones diretamente da biblioteca.

Ícones decorativos: sempre `aria-hidden`. Ícones funcionais: sempre `aria-label` no elemento pai ou no próprio ícone.

## A11y

- `role="alert"` em mensagens de erro inline
- `role="status"` em estados vazios / informativos
- `aria-label` em botões que só têm ícone (sem texto visível)
- `aria-current="page"` em links de navegação ativos
- `aria-pressed` em botões toggle
- `aria-invalid` + `aria-describedby` em inputs com erro
- Contraste mínimo 4.5:1 (WCAG AA)

## Async em handlers e useEffect

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

## Template de teste co-localizado

```tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders the main content', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<ComponentName variant="primary" />)
    expect(screen.getByRole('...')).toHaveClass('...')
  })
})
```

Regras de teste:
- Descrições (`describe`/`it`) sempre em **inglês**
- Importar o componente com named import: `import { ComponentName } from './ComponentName'`
- Usar `@testing-library/react` + `@testing-library/user-event`
- Testar comportamento (o que o usuário vê), não implementação interna
- Atingir a cobertura mínima definida no projeto
