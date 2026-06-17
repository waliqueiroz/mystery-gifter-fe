# Diretrizes de Desenvolvimento — mystery-gifter-fe

Gerado automaticamente a partir dos planos das features. Última atualização: 2026-06-17 (constituição v2.0.0)

## Tecnologias Ativas

- **Language/Runtime**: TypeScript 5+, Node.js LTS
- **Framework**: Next.js 15.5.4 (App Router), React 19
- **UI / Styling**: **Tailwind CSS** com tokens customizados em `tailwind.config.ts` (namespace `mg`)
- **Componentes overlay**: `@radix-ui/react-dialog` (base de `ConfirmModal` e `BottomSheet`)
- **Skeletons**: `react-loading-skeleton` (única fonte; spinners proibidos)
- **Ícones**: `lucide-react` (tree-shakeable, React-first)
- **Tipografia**: Manrope + Noto Sans via `next/font/google` (self-hospedadas em build time)
- **Composição de classes**: `clsx` + `tailwind-merge` via helper `src/lib/cn.ts`
- **Auth**: JWT em `localStorage` (key: `mystery_gifter_token`); Bearer token nas chamadas
- **Testes**: Jest + jest-environment-jsdom + React Testing Library + ts-jest
- **Backend API**: `http://localhost:8080/api/v1` (proxy via Next.js rewrites em dev)

### Não usar (legado removido na feature 005)

- Bootstrap 4.6
- AdminLTE 3.2
- jQuery, popper.js
- `@fortawesome/fontawesome-free`

## Estrutura do Projeto

```text
tailwind.config.ts                # tokens do DESIGN.md sob namespace mg
postcss.config.mjs

src/
├── app/
│   ├── (public)/                 # Landing, login, register
│   ├── (protected)/              # Áreas autenticadas — envolvidas em <AppShell>
│   │   ├── groups/
│   │   │   ├── page.tsx          # Lista (tela inicial pós-login)
│   │   │   ├── new/page.tsx      # Criar grupo — rota dedicada (substitui modal)
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Detalhe do grupo
│   │   │       └── invite/page.tsx  # Convidar membro — rota dedicada
│   │   └── profile/page.tsx      # Perfil + botão "Sair"
│   ├── invite/[token]/page.tsx   # Aceite público de convite
│   ├── layout.tsx                # Root: carrega Manrope + Noto Sans
│   └── globals.css               # @tailwind + CSS vars dos tokens + reset + focus
├── components/
│   ├── ui/                       # Primitivas compartilhadas (todas com teste)
│   │   ├── AppShell/             # Container app-like com bottom tab bar
│   │   ├── BottomTabBar/         # Grupos + Perfil (sem Sair)
│   │   ├── BottomSheet/          # Visualização rápida read-only
│   │   ├── ConfirmModal/         # ÚNICO modal permitido (confirmação)
│   │   ├── Button/               # Variants pill/circular
│   │   ├── FormField/            # Input pill com inset shadow
│   │   ├── EmptyState/           # Vazio + erro (variant)
│   │   ├── Skeleton/             # SkeletonProvider + SkeletonBox/Text/Circle
│   │   ├── Icon/                 # Wrapper lucide-react
│   │   ├── Toast/                # Mensagem flutuante
│   │   └── ErrorAlert/           # Erro inline em formulários
│   ├── auth/                     # AuthGuard, GuestGuard ("use client")
│   ├── landing/, login/, register/
│   ├── groups/, profile/, invite/
├── services/api/                 # authService, groupService, inviteService, userService
├── lib/                          # cn.ts, useDelayedFlag.ts, session.ts
└── types/                        # api.ts, forms.ts
```

## Comandos

```bash
npm run dev           # Servidor de dev (porta 3000)
npm test              # Testes unitários Jest
npm run test:coverage # Relatório de cobertura (mínimo 80% em arquivos modificados)
npm run lint          # ESLint
npm run build         # Build de produção (precisa passar antes do PR)
```

## Guia de Estilo (Constituição v2.0.0 + DESIGN.md)

A identidade visual completa está em `DESIGN.md` na raiz. Resumo do invariável:

- **Modo escuro obrigatório**: `body` sempre `var(--mg-bg)` (`#121212`). Sem light mode.
- **Tokens em dois arquivos**: `tailwind.config.ts` (theme.extend, namespace `mg`) e
  `globals.css` (CSS vars `--mg-*`). Hardcode fora desses dois arquivos é violação.
- **Verde funcional**: `mg.green` (`#1ed760`) só em CTAs primários, estado ativo de
  navegação e botões de play/sortear. Decorativo é proibido.
- **Geometria de botões**: pill (`rounded-pill` / `rounded-pill-lg`) ou circular
  (`rounded-full`). Botões retangulares são proibidos.
- **Rótulos de botão**: uppercase + `tracking-btn` (~ 0.1em).
- **Carregamentos**: skeletons via `react-loading-skeleton` envolvidos em
  `<SkeletonProvider>`. Use `useDelayedFlag(loading, 150)` para evitar flash.
- **Estados vazios**: componente compartilhado `EmptyState` (variants `default | error`).
  Variações ad-hoc proibidas.
- **Modais**: apenas `ConfirmModal` para confirmar ações destrutivas/irreversíveis. Outros
  fluxos vão para rota dedicada (formulários) ou `BottomSheet` (read-only).
- **Navegação**: bottom tab bar persistente com apenas **Grupos** e **Perfil**. "Sair"
  vive dentro de Perfil como botão.
- **Composição de classes**: sempre `cn(...)` de `src/lib/cn.ts`. Proibido concatenar
  classes com template strings + ternários.
- **A11y**: `:focus-visible` com anel verde global; `aria-hidden="true"` em decorativos;
  contraste mínimo 4.5:1 (WCAG AA).

## Estilo de Código Assíncrono

- **Sempre `async/await` com `try/catch/finally`** em `useEffect` e event handlers — nunca
  cadeias `.then().catch().finally()`.
- Padrão para `useEffect` assíncrono: inner `async function` chamada em seguida.

```typescript
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

## Regras Essenciais (Constituição v2.0.0)

- Todo componente React e função utilitária DEVE ter teste unitário co-localizado.
- Toda string de UI DEVE estar em pt-BR. URLs em inglês (`/register`, não `/registro`).
- **Todos os artefatos speckit (spec.md, plan.md, tasks.md, research.md, etc.) DEVEM ser
  redigidos em pt-BR.**
- `"use client"` é obrigatório para: auth guards, formulários, hooks de browser API e
  qualquer componente que leia `localStorage`.
- Auth guard: lê `localStorage.getItem('mystery_gifter_token')` no mount; redireciona se ausente.
- Guest guard: se token presente → redirecionar para `/groups`.
- 401 do backend → limpar token → redirecionar para `/login`.
- API calls passam pelo proxy de rewrites do Next (`/api/v1/*` → backend).
- Auto-login pós-cadastro = duas chamadas: `POST /api/v1/users` → `POST /api/v1/login`.
- Rota `/dashboard` foi eliminada — qualquer link interno para ela é violação.

## Fluxo de Branches Empilhadas (INEGOCIÁVEL)

Cada task ou fase tem sua branch empilhada na dependência direta. Mantém PRs pequenos
(200–400 LOC alvo) e permite review em paralelo.

### Nomenclatura de branches

```
###-short-description            ← branch base da feature (nome idêntico ao diretório specs/###-...)
task/###-phase-N-...             ← agrupa uma fase inteira (Setup, Foundation, Governance...)
task/###-T###-description        ← granular, opcional para tasks isoladas dentro de uma fase
```

Branches `fix/`, `hotfix/` e `release/` mantêm seus prefixos Gitflow. Feature base **NÃO**
usa prefixo `feature/` — o nome bate diretamente com o diretório `specs/###-...`.

### Criando um stack

```bash
git checkout 005-mobile-ui-redesign
git checkout -b task/005-phase-1-setup

# Outra branch stacked em cima:
git checkout task/005-phase-1-setup
git checkout -b task/005-phase-2-foundation
```

### Depois que uma branch dependente é merged

```bash
git checkout task/005-phase-2-foundation
git rebase --onto 005-mobile-ui-redesign task/005-phase-1-setup
```

### Regras

- Cada task branch toca SOMENTE os arquivos listados na task correspondente.
- Tasks paralelas (`[P]` em `tasks.md`) NÃO compartilham arquivos.
- Título do PR: `feat(T###): descrição` ou `feat(005-PhaseN): ...`.
- Cada PR aponta para sua **parent branch**, não para `develop` ou `main`.
- Ordem de merge segue o grafo de dependências em `specs/###/tasks.md`.
- Depois que todos os PRs de task mergeiam na base da feature, abre um PR único da
  base da feature → `develop`.

## Mudanças Recentes

- **005-mobile-ui-redesign**: Adotado Tailwind CSS + react-loading-skeleton + lucide-react +
  @radix-ui/react-dialog; removidos Bootstrap 4.6, AdminLTE 3.2, jQuery, Font Awesome.
  Constituição → v2.0.0. Política de pt-BR para todos os artefatos speckit.
- 004-groups-profile-features: GroupCard com badge owner, filtros multiselect, profile page.
- 003-group-management: gestão completa de grupos.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
