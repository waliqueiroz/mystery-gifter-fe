<!--
SYNC IMPACT REPORT
==================
Version change: 1.2.0 → 2.0.0  (MAJOR — backward-incompatible redefinition)
Modified principles:
  - Principle III (UX Consistency): Bootstrap 4 + AdminLTE 3.2 são REMOVIDOS como
    base obrigatória; a base de design vigente passa a ser DESIGN.md + Tailwind CSS.
Modified sections:
  - Frontend Standards: reescrita para refletir a nova stack (Tailwind, sem
    Bootstrap/AdminLTE/jQuery; ícones via lucide-react; tokens via
    tailwind.config.ts).
  - Style Guide: reescrita por completo — adota paleta near-black + verde
    Spotify, tipografia Manrope/Noto Sans via next/font/google, geometria pill/
    circular, regras de modais e skeletons.
  - Development Workflow: nova regra de idioma — TODOS os artefatos speckit
    (specs, checklists, planos, tasks) DEVEM ser redigidos em pt-BR a partir
    desta versão.
Added sections: N/A
Removed sections:
  - Style Guide §"Landing Page Hero" (mg-hero/mg-hero-title/mg-feature-card):
    removido — pertencia ao tema roxo de glassmorphism que foi descontinuado.
Templates updated:
  ✅ .specify/memory/constitution.md (este arquivo)
  ✅ plan-template.md — Constitution Check é genérico; sem mudança.
  ✅ tasks-template.md — sem mudança.
Follow-up TODOs:
  - Os scripts de speckit ainda só pré-resolvem `###-...` (sem prefixo
    Gitflow); decisão desta amenda é manter as branches de feature SEM o
    prefixo `feature/` (usar diretamente o nome da spec, ex.: `005-...`).
    A regra Gitflow para `fix/` e `hotfix/` permanece como antes.
-->

# Mystery Gifter Frontend Constitution

## Core Principles

### I. Code Quality

All code in this project MUST be clean, readable, and maintainable.
Specifically:

- Every file and module MUST have a single, clear responsibility (Single Responsibility Principle).
- Functions and components MUST be small and focused — prefer composing small pieces over large,
  multi-purpose implementations.
- Magic numbers and inline strings MUST be extracted into named constants.
- Dead code, unused imports, and commented-out blocks MUST NOT be committed.
- TypeScript MUST be used throughout; `any` types are forbidden unless explicitly justified with
  an inline comment.
- Linting and formatting rules (ESLint + Prettier) MUST pass on every commit — no exceptions.

**Rationale**: Consistent, high-quality code reduces onboarding friction, prevents subtle bugs,
and ensures the codebase remains maintainable as the team and feature set grow.

### II. Unit Testing (NON-NEGOTIABLE)

Every React component and every utility function in this project MUST have a corresponding
unit test. This is a non-negotiable constraint that applies to all new and modified code.

- Tests MUST be co-located with source files in the same directory
  (e.g., `Button.tsx` + `Button.test.tsx`); `__tests__` subdirectories MUST NOT be used.
- Tests MUST use React Testing Library and Jest (or Vitest if configured).
- Each component test MUST cover: render without crashing, primary interactive behavior,
  and any conditional rendering branches.
- Tests MUST be written before or alongside implementation (test-first preferred, test-alongside
  acceptable; test-after is NOT acceptable).
- A PR MUST NOT be merged if test coverage for modified components drops below the project
  threshold (minimum 80% line coverage).
- Tests MUST NOT use implementation details (no direct access to internal state or refs);
  test behavior from the user's perspective.

**Rationale**: Unit tests are the primary safety net for refactoring and new feature development.
Mandating them for every component prevents untested regressions and documents expected behavior.

### III. User Experience Consistency

The UI MUST present a coherent, predictable experience across all screens and states.

- The Style Guide defined in this constitution (see **Style Guide** section), em conjunto
  com o `DESIGN.md` na raiz do repositório, são o **contrato visual obrigatório**. Conflitos
  entre os dois são resolvidos em favor do `DESIGN.md`.
- O framework de estilos do projeto é **Tailwind CSS** (com tokens customizados sob namespace
  `mg` em `tailwind.config.ts`). Bootstrap, AdminLTE, jQuery e qualquer outro framework CSS
  legado **NÃO são permitidos** em novos componentes; sua remoção da feature 005 marca o fim
  do suporte a essa stack.
- Loading states MUST use **skeletons** (via `react-loading-skeleton`); spinners são proibidos
  em qualquer tela, fluxo ou componente.
- Empty states MUST use o componente compartilhado `EmptyState` (ícone + mensagem em pt-BR +
  CTA contextual). Variações ad-hoc não são permitidas.
- Modais (overlays bloqueantes com backdrop) DEVEM ser usados **exclusivamente** para
  confirmar ações destrutivas/irreversíveis. Demais fluxos: rota dedicada (criação,
  edição, convite) ou bottom sheet (visualização rápida read-only).
- Interactive elements (buttons, links, forms) MUST follow consistent feedback patterns:
  disabled state during submission, visible error messages on failure, success confirmation.
- Accessibility (a11y) MUST be considered: all interactive elements MUST be keyboard-navigable,
  expor `:focus-visible` com anel verde, e ter `aria-label` ou `aria-current` adequados onde
  semântica nativa não basta.
- Responsive design é **mobile-first**; a estética app-like persiste em todas as larguras (em
  desktop o conteúdo permanece centralizado dentro de `max-w-app`, não expande como painel).

**Rationale**: A consistent UX builds user trust and reduces support burden. Mover a base de
Bootstrap+AdminLTE para Tailwind+DESIGN.md (Mystery Gifter v2 — feature 005) eliminou ~600 KB
de CSS legado, permitiu modal/skeleton/empty primitives unificados e desbloqueou um visual
moderno coerente com a posição de produto.

### IV. Performance Standards

The application MUST meet the following performance targets, measured against Lighthouse or
Core Web Vitals in CI:

- **LCP (Largest Contentful Paint)**: ≤ 2.5 s on desktop, ≤ 4.0 s on mobile (3G simulated).
- **CLS (Cumulative Layout Shift)**: ≤ 0.1 across all pages.
- **INP (Interaction to Next Paint)**: ≤ 200 ms for primary interactions.
- Images MUST use Next.js `<Image>` with explicit `width`, `height`, and appropriate `priority`
  flags — raw `<img>` tags are forbidden.
- JavaScript bundles MUST be code-split by route; no feature's code MUST be bundled into the
  initial payload unless it is required for the initial render.
- Third-party scripts MUST be loaded with `next/script` using an appropriate `strategy`
  (`lazyOnload` by default).

**Rationale**: Frontend performance directly impacts user retention and SEO. Explicit, measurable
targets prevent performance regressions from going unnoticed during feature development.

### V. Next.js Best Practices & Simplicity

This project MUST follow the official Next.js App Router conventions and community-established
patterns. Complexity MUST be justified — the simplest solution that meets requirements is
always preferred (YAGNI).

- Use the App Router (`app/`) directory for all routing; the Pages Router MUST NOT be used.
- Route segments (directory names under `app/`) MUST be in English — e.g., `/register`, not
  `/registro`. UI text and labels remain in pt-BR; only the URL path is English.
- Server Components MUST be the default; add `"use client"` only when interactivity,
  browser APIs, or hooks require it — and document why at the top of the file.
- Data fetching MUST use Server Components + `fetch` with appropriate caching options,
  or Server Actions for mutations; client-side `useEffect` for data fetching is forbidden
  unless no server-side alternative exists.
- Route handlers (`app/api/`) MUST be used only for endpoints that genuinely require server
  logic; avoid creating API routes that simply proxy an existing backend.
- Global state MUST be minimized; prefer URL state, server state (React Query / SWR), or
  React context scoped to a subtree over a global store.
- Dependencies MUST be evaluated for bundle size impact before adoption; prefer native
  browser/Next.js capabilities over third-party libraries for standard tasks.

**Rationale**: Following the framework's intended patterns ensures compatibility with future
Next.js versions, benefits from built-in optimizations, and keeps the codebase approachable
for developers already familiar with the Next.js ecosystem.

## Frontend Standards

**Language & Runtime**: TypeScript 5+, Node.js LTS
**Framework**: Next.js 15+ (App Router) + React 19
**Styling**: **Tailwind CSS** com tokens customizados em `tailwind.config.ts` (theme.extend,
  namespace `mg`). Bootstrap, AdminLTE, jQuery, popper.js e Font Awesome **NÃO** são
  permitidos. Classes de utilitárias do projeto que não vêm do Tailwind DEVEM ser prefixadas
  com `mg-` (`mg-app-shell`, `mg-shimmer`, etc.). Sem `style` props para valores estáticos.
**Configuração de tema**: `tailwind.config.ts` (theme.extend) é fonte primária; CSS custom
  properties em `src/app/globals.css` espelham os mesmos tokens para usos pontuais
  (gradientes, inset shadows). Hardcode de cor/raio/sombra/tipografia fora desses dois
  arquivos é proibido (FR-006 da feature 005).
**Tipografia**: Manrope (família principal) + Noto Sans (scripts globais) carregadas via
  `next/font/google`. Pesos permitidos: 400, 600, 700.
**Ícones**: `lucide-react` (tree-shakeable, React-first). Outras bibliotecas exigem
  amenda à constituição.
**Componentes**: biblioteca compartilhada em `src/components/ui/` — todas as primitivas
  têm teste unitário co-localizado (`<Name>/<Name>.tsx` + `<Name>.test.tsx`).
**Diálogos sobrepostos**: única primitiva permitida é `ConfirmModal` (sobre
  `@radix-ui/react-dialog`). Visualizações rápidas usam `BottomSheet` (mesma base).
**Estados de carregamento**: `react-loading-skeleton` envolvido em `<SkeletonProvider>`
  global. Spinners proibidos.
**Estados vazios**: componente compartilhado `EmptyState` com variants `default | error`.
**Testing stack**: Jest + jest-environment-jsdom + React Testing Library + ts-jest (unit).
  Playwright/Cypress (E2E) são opcionais por feature.
**Linting & formatting**: ESLint (next/core-web-vitals ruleset) + Prettier — enforced via
  pre-commit hook e CI.
**CI gate**: All tests MUST pass, linting MUST be clean, and build MUST succeed before any
  PR is merged.

## Style Guide

A identidade visual completa do produto está em [`DESIGN.md`](../../DESIGN.md), na raiz do
repositório. Esta seção da constituição **referencia** e **resume** as regras invioláveis;
sempre que houver discrepância, o `DESIGN.md` é a autoridade final.

### Dark Theme (NON-NEGOTIABLE)

- A aplicação opera em **modo escuro obrigatório** em todas as larguras.
- Não há modo claro — `prefers-color-scheme: light` é intencionalmente ignorado.
- O `body` resolve sempre para `var(--mg-bg)` (`#121212`).

### Design Tokens

Tokens vivem em **dois arquivos espelhados**:

1. `tailwind.config.ts` → `theme.extend` (consumido como utilitários `bg-mg-*`, `text-mg-*`, etc.)
2. `src/app/globals.css` → CSS custom properties `--mg-*` (consumidas em casos pontuais —
   gradientes, inset shadows, animações nomeadas).

Hardcode de cor, raio, sombra ou tamanho tipográfico fora desses dois arquivos é violação.

| Token | Valor | Uso |
|-------|-------|-----|
| `mg.bg` / `--mg-bg` | `#121212` | Page background |
| `mg.surface` / `--mg-surface` | `#181818` | Cartões, superfícies elevadas |
| `mg.surface-2` / `--mg-surface-2` | `#1f1f1f` | Botões dark pill, inputs |
| `mg.green` / `--mg-green` | `#1ed760` | **Marca funcional** (CTAs, ativo, play) |
| `mg.text` / `--mg-text` | `#ffffff` | Texto primário |
| `mg.text-muted` / `--mg-text-muted` | `#b3b3b3` | Texto secundário |
| `mg.text-negative` / `--mg-text-negative` | `#f3727f` | Erro |
| `mg.text-warning` / `--mg-text-warning` | `#ffa42b` | Aviso |
| `mg.text-announcement` / `--mg-text-announcement` | `#539df5` | Info |

### Regras invioláveis

- **Verde funcional**: `mg.green` (`#1ed760`) é aplicado **exclusivamente** em controles
  funcionais (CTAs primários, estado ativo de navegação, play/sortear). Uso decorativo é
  proibido.
- **Geometria de botões**: pill (`rounded-pill` / `rounded-pill-lg`) ou circular
  (`rounded-full`). Botões retangulares são proibidos.
- **Rótulos de botão**: uppercase + `tracking-btn` (letter-spacing ~ 0.1em).
- **Tipografia**: Manrope (família principal) + Noto Sans (scripts globais) carregadas via
  `next/font/google`. Pesos permitidos: 400, 600, 700.
- **Navegação app-like**: bottom tab bar persistente em todas as larguras, com `Grupos` e
  `Perfil` apenas; `Sair` vive dentro de Perfil.
- **Modais**: apenas para confirmação de ações destrutivas/irreversíveis (via `ConfirmModal`
  sobre Radix Dialog). Demais fluxos: rota dedicada (formulários/multi-passos) ou bottom
  sheet (visualização rápida read-only).
- **Carregamentos**: skeletons via `react-loading-skeleton`. Spinners proibidos.
- **Estados vazios**: componente compartilhado `EmptyState` (variants `default | error`).

### Acessibilidade

- **Anel de foco**: `:focus-visible { outline: 2px solid var(--mg-green); outline-offset: 2px; }`
  globalmente. Sobrescrever para `none` sem alternativa é violação.
- **Reduced motion**: regra global em `globals.css` zera animações e transições para
  `prefers-reduced-motion: reduce`. Animações novas não adicionam seu próprio override.
- **Contraste**: ratio mínimo de 4.5:1 em toda combinação texto/fundo (WCAG AA).
- **Decorativos**: ícones e shapes puramente decorativos têm `aria-hidden="true"`.

### Padrão de extensão

Para novos elementos visuais:

1. **Adicione o token antes do uso** em `tailwind.config.ts` (theme.extend) e, se necessário
   também como CSS var em `globals.css`. Sob namespace `mg`.
2. **Componha classes com `cn()`** (`src/lib/cn.ts`) — proibido concatenar com template
   strings em ternários longos.
3. **Classes utilitárias do projeto que não vêm do Tailwind** (animações nomeadas, helpers
   em `globals.css`) têm prefixo `mg-`.
4. **Sem `style` props** para valores estáticos — sempre via classe.
5. **Spec the change**: mudanças que afetam mais de um componente são documentadas na spec
   da feature (FR section).

## Development Workflow

1. **Branch naming (NON-NEGOTIABLE)**: nomes de branches DEVEM seguir os padrões abaixo.
   Branches que não conformam NÃO podem ser merged.

   | Branch type | Pattern | Propósito |
   |-------------|---------|-----------|
   | Feature base | `###-short-description` | Branch base da feature; nome idêntico ao diretório `specs/###-...` (sem prefixo Gitflow — speckit já provê esse formato). |
   | Task stacked | `task/###-T###-descricao` ou `task/###-phase-N-...` | Implementa uma task ou fase específica empilhada sobre a feature base ou outra task. |
   | Bug fix | `fix/short-description` | Correções não-críticas. |
   | Hotfix | `hotfix/short-description` | Correções críticas em produção. |
   | Release | `release/x.y.z` | Preparação de release. |
   | Integration | `develop` | Alvo de integração; feature/fix branches mergeiam aqui. |
   | Production | `main` | Branch estável de produção; só release e hotfix mergeiam aqui. |

2. **Idioma dos artefatos speckit (NON-NEGOTIABLE)**: TODOS os artefatos gerados via
   speckit — `spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, `contracts/*`,
   `quickstart.md`, `checklists/*` — DEVEM ser redigidos em **português brasileiro (pt-BR)**.
   Templates internos da própria CLI podem permanecer em inglês; o output destinado ao
   leitor humano da equipe é pt-BR.

3. **Idioma de UI**: todos os textos visíveis ao usuário final DEVEM estar em pt-BR. URLs
   (segmentos de rota) DEVEM ser em inglês (`/register` não `/registro`).

4. **Spec before code**: um `spec.md` DEVE existir antes da implementação começar para
   qualquer feature não-trivial.

5. **Tests alongside implementation**: testes unitários DEVEM ser commitados no mesmo PR
   da implementação correspondente — não como follow-up.

6. **PR checklist**: antes de pedir review, autor verifica:
   - Todos os testes passam (`npm test`).
   - Lint e type-check passam (`npm run lint && npm run type-check`).
   - Build bem-sucedido (`npm run build`).
   - Sem erros ou warnings novos no console.
   - Spot-check de a11y (keyboard navigation, contraste ≥ 4.5:1).
   - Visual segue o Style Guide (tokens via `mg.*`, sem hex hardcoded, sem botões retangulares).

7. **Review requirements**: pelo menos uma aprovação antes do merge; reviewer verifica
   conformidade com a constituição, não só correção funcional.

8. **Commit message format — Conventional Commits (NON-NEGOTIABLE)**: todo commit segue
   `type(scope): description`. Pre-commit hook ou CI rejeita commits fora do padrão.

   | Type | Quando usar |
   |------|-------------|
   | `feat` | Nova funcionalidade ou comportamento visível ao usuário. |
   | `fix` | Correção de bug. |
   | `test` | Adicionar ou corrigir testes. |
   | `refactor` | Mudança de código sem efeito funcional. |
   | `style` | Formatação, whitespace (sem mudança de lógica). |
   | `chore` | Tooling, config, dependências. |
   | `docs` | Documentação apenas. |
   | `perf` | Melhorias de performance. |
   | `ci` | Pipeline CI/CD. |
   | `build` | Build system ou dependências externas. |
   | `revert` | Reverter commit anterior. |

   Breaking changes têm `!` após o type (`feat!:`) e footer `BREAKING CHANGE: ...`.

## Governance

This constitution supersedes all other development practices, coding guidelines, and informal
conventions in the mystery-gifter-fe project.

**Amendment procedure**:
1. Propose the amendment in a PR that modifies this file.
2. The PR description MUST explain the motivation, the version bump rationale, and list all
   affected templates and docs.
3. Amendment requires at least one approval from a project maintainer.
4. On merge, `LAST_AMENDED_DATE` MUST be updated to the merge date and `CONSTITUTION_VERSION`
   MUST be incremented per semantic versioning rules documented in the version line.

**Versioning policy**:
- MAJOR: removal or backward-incompatible redefinition of an existing principle.
- MINOR: new principle or section added; material expansion of existing guidance.
- PATCH: clarification, wording improvement, or typo fix with no semantic change.

**Compliance review**: every PR review MUST include a constitution check. Violations require
explicit justification documented in the Complexity Tracking table of the relevant plan.md
before they may be merged.

**Version**: 2.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-06-17
