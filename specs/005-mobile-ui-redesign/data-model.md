# Modelo de Dados / Tipos — 005-mobile-ui-redesign

**Data**: 2026-06-17

Esta feature é primariamente visual e não introduz entidades de domínio nem altera contratos de API. O "modelo" aqui consiste no **contrato de tipos públicos das novas primitivas de UI** que as histórias subsequentes vão consumir. Todos os tipos vivem em arquivos co-localizados ao componente; nada é centralizado em `types/api.ts`, que permanece dedicado a contratos REST.

---

## 1. Tokens de tema (`tailwind.config.ts`)

| Token | Tipo | Valor | Uso |
|-------|------|-------|-----|
| `colors.mg.bg` | hex | `#121212` | fundo de página |
| `colors.mg.surface` | hex | `#181818` | cartões, sidebar |
| `colors.mg.surface-2` | hex | `#1f1f1f` | botões dark pill, inputs |
| `colors.mg.surface-3` / `mg.surface-4` | hex | `#252525` / `#272727` | cartões elevados |
| `colors.mg.green` | hex | `#1ed760` | brand accent (CTAs, ativo) |
| `colors.mg.green-border` | hex | `#1db954` | bordas variant verde |
| `colors.mg.text` | hex | `#ffffff` | texto primário |
| `colors.mg.text-muted` | hex | `#b3b3b3` | texto secundário |
| `colors.mg.text-negative` | hex | `#f3727f` | erro |
| `colors.mg.text-warning` | hex | `#ffa42b` | aviso |
| `colors.mg.text-announcement` | hex | `#539df5` | info |
| `colors.mg.border` / `border-light` | hex | `#4d4d4d` / `#7c7c7c` | bordas |
| `borderRadius.pill` | px | `9999px` | botões pill pequenos, nav pills |
| `borderRadius.pill-lg` | px | `500px` | botões pill primários |
| `borderRadius.card` / `card-sm` | px | `8px` / `6px` | cartões |
| `boxShadow.mg-card` | css | `rgba(0,0,0,0.3) 0px 8px 8px` | cartões em hover/elevados |
| `boxShadow.mg-dialog` | css | `rgba(0,0,0,0.5) 0px 8px 24px` | ConfirmModal, BottomSheet |
| `boxShadow.mg-inset` | css | `rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset` | inputs |
| `maxWidth.app` | px | `480px` | container app-like em desktop |
| `fontFamily.sans` / `fontFamily.title` | array | `[var(--font-manrope), var(--font-noto-sans), ...]` | corpo / títulos |

Regra de uso: nenhum componente novo pode usar valores literais; tudo passa por essas chaves (FR-006).

---

## 2. Primitivas de UI — contratos públicos

### `<Button>`

```ts
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonShape = 'pill' | 'pill-lg' | 'circle'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant      // default 'primary' (verde)
  shape?: ButtonShape          // default 'pill'
  size?: ButtonSize            // default 'md'
  uppercase?: boolean          // default true (rótulos sistemáticos)
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean            // troca conteúdo por skeleton inline; nunca por spinner
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}
```

Restrições:
- `variant='primary'` aplica `bg-mg-green text-black` (verde só em controle funcional).
- Botões retangulares são proibidos (FR-009) — não existe `shape='rect'`.
- `loading=true` renderiza `<SkeletonText>` interno, mantendo a largura atual.

### `<FormField>`

```ts
type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'search'

interface FormFieldProps {
  id: string
  label: string                // sempre visível em pt-BR
  type?: FormFieldType         // default 'text'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string               // mensagem em pt-BR; usa text-negative
  helperText?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode']
}
```

Visual:
- Input com `rounded-pill-lg`, `bg-mg-surface-2`, `shadow-mg-inset`.
- Erro aplica `border-mg-text-negative` + mensagem `text-mg-text-negative` abaixo.
- Foco aplica anel verde (Q5 acessibilidade).

### `<EmptyState>`

```ts
type EmptyStateVariant = 'default' | 'error'

interface EmptyStateProps {
  variant?: EmptyStateVariant     // default 'default'
  icon: React.ReactNode           // <Icon name="..." /> obrigatório
  title: string                   // pt-BR, curto
  description?: string            // pt-BR, opcional
  cta?: {
    label: string
    onClick: () => void
    href?: string                 // se href, renderiza <Link> em vez de <button>
  }
  className?: string
}
```

Regras (FR-025):
- Sempre tem ícone + título.
- CTA é opcional; se omitido, EmptyState renderiza só ícone + texto (ver caso de borda).
- `variant='error'` usa cor de ícone `text-mg-text-negative` e título no mesmo tom.

### `<AppShell>`

```ts
interface AppShellProps {
  children: React.ReactNode
}
```

Comportamento:
- Aplica `min-h-dvh bg-mg-bg`.
- Centraliza children em `max-w-app mx-auto` (mobile-like em desktop).
- Renderiza `<BottomTabBar>` ao final.
- Aplica `pb-[calc(theme(spacing.20)+env(safe-area-inset-bottom))]` no conteúdo para não cobrir pela tab bar.

### `<BottomTabBar>`

```ts
interface BottomTabBarProps {
  /* sem props públicas — composição interna fixa */
}
```

Comportamento:
- Sempre dois tabs: Grupos (`/groups`) e Perfil (`/profile`).
- Estado ativo via `usePathname()`.
- Aplica `aria-current="page"` no item ativo.
- `fixed bottom-0 inset-x-0` com safe-area-inset-bottom.

### `<BottomSheet>`

```ts
interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string                     // anuncia para leitores de tela
  description?: string              // opcional, lido após o título
  children: React.ReactNode         // conteúdo READ-ONLY (FR-023)
  initialFocusRef?: React.RefObject<HTMLElement>
}
```

Restrições:
- Apenas para visualização rápida read-only.
- Bottom-up slide; backdrop com sombra `shadow-mg-dialog`.
- ESC e clique no backdrop fecham.

### `<ConfirmModal>` (único modal permitido)

```ts
interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  body: React.ReactNode
  confirmLabel: string              // ex.: "Confirmar sorteio"
  cancelLabel?: string              // default "Cancelar"
  destructive?: boolean             // default false; true muda confirm para variant 'outline' com text-mg-text-negative
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean               // desabilita botões enquanto promessa não resolve
}
```

### Skeletons (`<Skeleton*>`)

```ts
interface SkeletonBoxProps {
  width?: number | string
  height?: number | string
  className?: string
}

interface SkeletonTextProps {
  lines?: number                    // default 1
  width?: string | string[]
}

interface SkeletonCircleProps {
  size: number
}
```

Internamente usam `react-loading-skeleton` com `SkeletonTheme` configurado uma vez no `(protected)/layout.tsx` e em cada página pública. Spinners são proibidos (FR-024).

Hook auxiliar:

```ts
function useDelayedFlag(value: boolean, delayMs: number): boolean
```

Retorna `true` apenas após `delayMs` em que `value === true`. Cancela o timer se `value` voltar a `false`. Usado para evitar flash de skeleton em respostas rápidas.

### `<Icon>`

```ts
interface IconProps {
  name: LucideIconName              // tipo derivado de lucide-react
  size?: number                     // default 20
  className?: string
  'aria-hidden'?: boolean           // default true
  'aria-label'?: string             // se não decorativo
}
```

### `cn()` helper

```ts
function cn(...inputs: ClassValue[]): string
```

Wrapper de `clsx` + `tailwind-merge` para compor classes sem conflitos.

---

## 3. Tipos preservados

Os tipos em `src/types/api.ts` (`User`, `Group`, `GroupFilterParams`, `Member`, `Invite`, etc.) **NÃO mudam**. A feature não toca contratos REST.

---

## 4. Estado de UI

| Estado | Onde vive | Tipo |
|--------|-----------|------|
| Filtros da lista de grupos | `useState` em `GroupList` | `GroupFilterParams` (existente) |
| Sheet aberta (detalhes de membro) | `useState` em `MemberList` | `{ open: boolean; memberId?: string }` |
| Submissão de formulário (criar grupo, convidar) | `useFormState` na rota | local — sem store global |
| Sessão / token | `localStorage` via `lib/session.ts` | inalterado |
| Tema | fixo (`color-scheme: dark`) | sem store |

Nenhum store global novo (Zustand/Redux/etc) é introduzido — segue Princípio V da constituição.
