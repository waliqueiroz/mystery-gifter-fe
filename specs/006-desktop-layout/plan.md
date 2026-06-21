# Plano de Implementação: Layout Responsivo Desktop

**Branch**: `006-desktop-layout` | **Data**: 2026-06-21 | **Spec**: [spec.md](spec.md)

## Resumo

Tornar o Mystery Gifter responsivo para telas desktop (≥896px) introduzindo uma barra lateral de navegação permanente à esquerda que substitui a bottom tab bar — padrão consolidado pela indústria (Spotify, Discord, Slack). No mobile (<896px), zero mudanças. Tecnicamente, a feature é 100% de layout: novos tokens Tailwind, um novo componente `Sidebar`, reestruturação do `AppShell` e ajustes de largura em páginas existentes.

## Contexto Técnico

**Language/Version**: TypeScript 5+, Node.js LTS  
**Primary Dependencies**: Next.js 15.5.4 (App Router), React 19, Tailwind CSS, lucide-react, clsx, tailwind-merge, react-loading-skeleton  
**Storage**: N/A — feature puramente de UI  
**Testing**: Jest + jest-environment-jsdom + React Testing Library + ts-jest  
**Target Platform**: Web (browsers modernos, desktop e mobile)  
**Project Type**: Web application (Next.js frontend)  
**Performance Goals**: LCP ≤ 2.5s desktop; CLS ≤ 0.1 (zero layout shifts inesperados). A mudança de layout deve ser zero-JS — apenas CSS responsivo via Tailwind.  
**Constraints**: Layout mobile deve ser preservado sem nenhuma alteração. Sem novos serviços ou chamadas de API. Nenhum novo estado global.  
**Scale/Scope**: Impacta AppShell (compartilhado por todas as páginas autenticadas) + 6 páginas/componentes existentes + páginas públicas.

## Constitution Check

*GATE: Verificado antes da Fase 0. Re-verificado após o design.*

| Regra | Status | Observação |
|-------|--------|------------|
| TypeScript em todo código novo | ✅ Pass | Todos os novos arquivos em `.tsx` + `.ts` |
| Testes co-localizados (RTL + Jest) | ✅ Pass | Cada novo/modificado componente ganha teste co-localizado |
| Tailwind CSS (sem Bootstrap/legado) | ✅ Pass | Feature é 100% Tailwind + tokens `mg` |
| Tokens via `tailwind.config.ts` + `globals.css` | ✅ Pass | Novos tokens adicionados sob namespace `mg`/`screens` |
| Verde funcional apenas | ✅ Pass | `mg.green` aplicado exclusivamente no estado ativo de nav |
| Geometria pill/circular em botões | ✅ Pass | Sem novos botões retangulares |
| Skeletons para loading | ✅ Pass | Grade de skeletons segue o mesmo layout do grid de cards |
| EmptyState compartilhado | ✅ Pass | Sem variações ad-hoc |
| Sem modais fora do ConfirmModal | ✅ Pass | Feature não usa modais |
| Ícones via lucide-react | ✅ Pass | `Gift` (sidebar brand) via lucide-react |
| Acessibilidade (focus-visible, aria) | ✅ Pass | Sidebar implementa `aria-current`, `aria-label`, focus-visible verde |
| **Princípio III**: "conteúdo em `max-w-app` no desktop" | ⚠️ **VIOLAÇÃO JUSTIFICADA** | Ver Complexity Tracking |
| **Nav rule**: "bottom tab bar persistente em todas as larguras" | ⚠️ **VIOLAÇÃO JUSTIFICADA** | Ver Complexity Tracking |

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/006-desktop-layout/
├── plan.md              ← este arquivo
├── research.md          ← pesquisa de padrões e decisões
├── data-model.md        ← modelo de layout e tokens
├── checklists/
│   └── requirements.md  ← checklist de qualidade da spec
└── tasks.md             ← (gerado pelo /speckit.tasks)
```

### Código-fonte (raiz do repositório)

```text
tailwind.config.ts                      ← tokens: desk breakpoint, sidebar width, max-w-content

src/
├── components/
│   └── ui/
│       ├── AppShell/
│       │   ├── AppShell.tsx            ← reestruturado: flex-row desktop
│       │   └── AppShell.test.tsx       ← atualizado
│       ├── BottomTabBar/
│       │   ├── BottomTabBar.tsx        ← add desk:hidden
│       │   └── BottomTabBar.test.tsx   ← atualizado
│       └── Sidebar/                    ← NOVO componente
│           ├── Sidebar.tsx
│           └── Sidebar.test.tsx
├── components/groups/
│   └── GroupList/
│       ├── GroupList.tsx               ← grid responsivo
│       └── GroupList.test.tsx          ← atualizado
├── components/login/
│   └── LoginForm/
│       ├── LoginForm.tsx               ← max-w-content desktop
│       └── LoginForm.test.tsx          ← atualizado
├── components/register/
│   └── RegisterForm/
│       ├── RegisterForm.tsx            ← max-w-content desktop
│       └── RegisterForm.test.tsx       ← atualizado (se existir)
├── components/profile/
│   └── ProfileContent/
│       ├── ProfileContent.tsx          ← max-w-content desktop
│       └── ProfileContent.test.tsx     ← atualizado (se existir)
└── app/
    └── invite/[token]/
        └── page.tsx                    ← max-w-content desktop (ou componente filho)

.specify/memory/constitution.md         ← emenda v2.0.0 → v2.1.0 (Fase 7)
```

## Complexity Tracking

| Violação | Por que Necessária | Alternativa Mais Simples Descartada Por |
|----------|-------------------|----------------------------------------|
| `max-w-app` removido do AppShell no desktop (Princípio III) | A feature 006 existe exatamente para expandir o layout desktop além dos 480px do mobile. DESIGN.md §8 (autoridade final) descreve sidebar e grid desktop — contradizendo a regra da constituição. | Manter `max-w-app` tornaria a sidebar inútil: 480px de conteúdo ao lado de 220px de sidebar em uma tela de 1280px desperdicia 580px. |
| Bottom tab bar escondida em desktop (`desk:hidden`) — "nav persistente em todas as larguras" (Princípio III nav rule) | A sidebar é a substituição direta para telas largas — duplicar ambas seria incoerente. DESIGN.md §8 prevê explicitamente essa substituição. | Manter bottom bar + adicionar sidebar seria redundância de navegação e prejudicaria a UX. |

---

## Fases de Implementação

### Fase 1 — Setup: Tokens e Breakpoints

**Objetivo**: Preparar o sistema de design para as classes responsivas desktop.

**Arquivos tocados**:
- `tailwind.config.ts`

**Mudanças**:
1. Adicionar breakpoint customizado `desk: '896px'` em `theme.extend.screens`
2. Adicionar token de largura `sidebar: '220px'` em `theme.extend.width`
3. Adicionar token `content: '640px'` em `theme.extend.maxWidth` (formulários e detalhe no desktop)

**Resultado esperado**: Classes `desk:*`, `w-sidebar`, `max-w-content` disponíveis em todo o projeto.

**Dependências**: Nenhuma (ponto de partida).

---

### Fase 2 — Componente Sidebar

**Objetivo**: Criar a primitiva de navegação lateral para desktop com identidade da aplicação e links ativos.

**Arquivos tocados**:
- `src/components/ui/Sidebar/Sidebar.tsx` (NOVO)
- `src/components/ui/Sidebar/Sidebar.test.tsx` (NOVO)

**Estrutura do componente**:

```
Sidebar (nav, aria-label="Navegação principal — desktop")
├── SidebarBrand
│   ├── Icon name="Gift" (aria-hidden)
│   └── "Mystery Gifter" (texto, tipografia title)
└── SidebarNav (ul)
    ├── SidebarLink href="/groups" icon="Users" label="Grupos"
    └── SidebarLink href="/profile" icon="CircleUser" label="Perfil"
```

**Comportamento**:
- Item ativo detectado via `usePathname()` + `pathname.startsWith(href)`
- Ativo: texto + ícone em `text-mg-green`
- Inativo: `text-mg-text-muted` com `hover:text-mg-text`
- Link ativo recebe `aria-current="page"`
- `focus-visible`: ring verde global (herdado do globals.css)
- Fundo da sidebar: `bg-mg-bg` (mesma superfície base — sem borda aparente, separação por contraste)
- Borda direita sutil: `border-r border-mg-border/40` (igual ao topo da BottomTabBar)

**Testes obrigatórios**:
- Renderiza sem crash
- Exibe "Mystery Gifter" e ícone Gift
- Exibe links "Grupos" e "Perfil"
- Link ativo recebe `aria-current="page"` e classes de cor verde
- Link inativo NÃO tem `aria-current`
- Navegação por teclado (Tab → Enter navega)

**Dependências**: Fase 1 (token `desk` para testes de responsividade).

---

### Fase 3 — AppShell & BottomTabBar

**Objetivo**: Reestruturar o container principal para layout responsivo e esconder a BottomTabBar no desktop.

**Arquivos tocados**:
- `src/components/ui/AppShell/AppShell.tsx`
- `src/components/ui/AppShell/AppShell.test.tsx`
- `src/components/ui/BottomTabBar/BottomTabBar.tsx`
- `src/components/ui/BottomTabBar/BottomTabBar.test.tsx`

**Mudanças no AppShell**:

*Mobile (atual)*:
```
<div min-h-dvh bg-mg-bg>
  <main mx-auto max-w-app px-4 pt-6 pb-[calc(6rem+safe-area)>
    {children}
  </main>
  <BottomTabBar />
</div>
```

*Desktop (novo — simplificado)*:
```
<div min-h-dvh bg-mg-bg>
  [mobile: layout atual mantido via classes condicionais]
  [desk: flex flex-row]
    <Sidebar /> [hidden desk:flex, w-sidebar, flex-col, fixed ou sticky]
    <main [flex-1 min-w-0, px-6 pt-6 pb-6 no desktop; mx-auto max-w-app px-4 pt-6 pb-24 no mobile]>
      {children}
    </main>
  <BottomTabBar /> [desk:hidden]
</div>
```

**Detalhes importantes**:
- A sidebar pode ser `sticky top-0 h-screen` para ficar visível durante scroll — padrão Spotify.
- O `pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))]` do `<main>` aplica apenas em mobile (sem o `desk:` prefix no mobile, ou `desk:pb-6` para sobrescrever).
- O `SkeletonProvider` permanece wrappando tudo.

**Mudanças na BottomTabBar**:
- Adicionar `desk:hidden` no elemento `<nav>` raiz — invisível no desktop, permanece no DOM.

**Testes obrigatórios (AppShell)**:
- Renderiza children
- Inclui BottomTabBar
- Inclui Sidebar
- No viewport mobile: BottomTabBar visível, Sidebar oculta (usar `window.innerWidth` mock)
- No viewport desktop: Sidebar visível, BottomTabBar oculta

**Testes obrigatórios (BottomTabBar)**:
- Testes existentes continuam passando (sem regressão)
- Classe `desk:hidden` presente no `<nav>`

**Dependências**: Fase 2 (Sidebar deve existir antes do AppShell referenciá-la).

---

### Fase 4 — Grade Responsiva de Grupos [Paralela após Fase 3]

**Objetivo**: Exibir cartões de grupo em grade multi-coluna no desktop.

**Arquivos tocados**:
- `src/components/groups/GroupList/GroupList.tsx`
- `src/components/groups/GroupList/GroupList.test.tsx`

**Mudanças**:

Container de cartões atual:
```tsx
<div className="flex flex-col gap-3">
  {groups.map(...)}
</div>
```

Novo:
```tsx
<div className="grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-3">
  {groups.map(...)}
</div>
```

Container de skeletons (`SkeletonList`):
```tsx
<div className="grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-3" data-testid="group-list-skeleton">
  {Array.from({ length: SKELETON_PLACEHOLDER_COUNT }).map(...)}
</div>
```

**Testes obrigatórios**:
- Testes existentes passam (sem regressão)
- Container de cards tem classe `grid` (não mais `flex flex-col`)
- Container de skeleton também tem classe `grid`

**Dependências**: Fase 3 (AppShell precisa estar reestruturado para o grid ter espaço útil).

---

### Fase 5 — Páginas Públicas Desktop [Paralela após Fase 1]

**Objetivo**: Centralizar formulários públicos (login, cadastro, convite) em telas largas.

**Arquivos tocados**:
- `src/components/login/LoginForm/LoginForm.tsx`
- `src/components/login/LoginForm/LoginForm.test.tsx`
- `src/components/register/RegisterForm/RegisterForm.tsx` *(verificar existência)*
- `src/components/register/RegisterForm/RegisterForm.test.tsx` *(se existir)*
- `src/app/invite/[token]/page.tsx` *(ou seu componente filho)*

**Mudanças**:
- Adicionar wrapper `mx-auto max-w-content` ao container raiz de cada formulário público.
- Em mobile, `max-w-content` (640px) é maior que a tela, então `mx-auto` apenas centraliza sem restringir — comportamento correto.
- Em desktop, limita o formulário a 640px centralizado na área disponível.

**Estrutura esperada**:
```tsx
// Exemplo LoginForm
return (
  <div className="mx-auto max-w-content px-4 py-8">
    {/* conteúdo atual */}
  </div>
)
```

**Testes obrigatórios**:
- Testes existentes passam (sem regressão)
- Container raiz tem classes de max-width e margin

**Dependências**: Fase 1 (token `max-w-content` deve existir). Independente da Fase 3.

---

### Fase 6 — Largura de Conteúdo: Formulários e Páginas Protegidas [Paralela após Fase 3]

**Objetivo**: Adicionar `max-w-content` em páginas de formulário e detalhe dentro da área autenticada.

**Arquivos tocados** *(verificar estrutura real — pode ser `page.tsx` ou componente filho)*:
- `src/app/(protected)/groups/new/page.tsx` ou `src/components/groups/CreateGroupForm/CreateGroupForm.tsx`
- `src/app/(protected)/groups/[id]/invite/page.tsx` ou componente filho
- `src/app/(protected)/groups/[id]/page.tsx` (`GroupDetailContent`)
- `src/app/(protected)/profile/page.tsx` ou `src/components/profile/ProfileContent/ProfileContent.tsx`

**Mudanças**:
- Adicionar `mx-auto max-w-content` ao container raiz de cada página/componente.
- Manter compatibilidade com mobile (mesmo raciocínio da Fase 5).

**Testes obrigatórios**:
- Testes existentes passam (sem regressão)
- Container raiz tem classes de max-width

**Dependências**: Fase 3 (AppShell sem `max-w-app` global no desktop, para que as páginas possam adicionar sua própria restrição).

---

### Fase 7 — Emenda à Constituição [Independente]

**Objetivo**: Atualizar a constituição para refletir o design responsivo implementado pela feature 006.

**Arquivos tocados**:
- `.specify/memory/constitution.md`

**Mudanças**:

1. **Princípio III** — remover a restrição `max-w-app` para desktop e substituir pela nova regra:
   > *Antes*: "Design responsivo é mobile-first; a estética app-like persiste em todas as larguras (em desktop o conteúdo permanece centralizado dentro de `max-w-app`, não expande como painel)."
   >
   > *Depois*: "Design responsivo é mobile-first. Em telas ≥896px (breakpoint `desk`), a navegação migra para sidebar lateral e o conteúdo expande para usar o espaço disponível. Em telas <896px, o layout mobile (`max-w-app` centralizado + bottom tab bar) é preservado sem alterações."

2. **Guia de Estilo — Regras invioláveis** — atualizar a regra de navegação:
   > *Antes*: "Navegação app-like: bottom tab bar persistente em **todas as larguras**, com `Grupos` e `Perfil` apenas; `Sair` vive dentro de Perfil."
   >
   > *Depois*: "Navegação adaptativa: em mobile (<896px), bottom tab bar com `Grupos` e `Perfil`; em desktop (≥896px), sidebar lateral com os mesmos itens. `Sair` vive dentro de Perfil em ambos."

3. **Version bump**: `2.0.0` → `2.1.0` (MINOR — nova diretiva responsiva adicionada).

4. **Last Amended**: `2026-06-17` → data do merge da feature 006.

**Dependências**: Idealmente após Fase 3 (para que a emenda reflita o que foi efetivamente implementado). Pode ser feita a qualquer momento no fluxo.

---

## Grafo de Dependências

```
Fase 1 (Tokens)
    └─→ Fase 2 (Sidebar)
            └─→ Fase 3 (AppShell + BottomTabBar)
                    ├─→ Fase 4 (Group Grid)      ← [P] paralela
                    └─→ Fase 6 (Content Width)   ← [P] paralela

Fase 1 (Tokens)
    └─→ Fase 5 (Páginas Públicas)                ← [P] paralela (independente da Fase 3)

Fase 7 (Constituição)                            ← independente (melhor após Fase 3)
```

**Legenda**: `[P]` = paralela com as outras `[P]` no mesmo nível

## Critérios de Aceite Técnica (além dos da spec)

- `npm test` passa com 100% dos testes anteriores + novos testes para Sidebar e modificações.
- `npm run build` compila sem erros.
- `npm run lint` limpo.
- Nenhuma cor hardcoded fora de `tailwind.config.ts` / `globals.css`.
- Sidebar tem `aria-label="Navegação principal — desktop"` e links com `aria-current`.
- Redimensionar a janela entre 800px e 900px alterna o layout sem flash nem JS.
- Toaster (`bottom-center`, offset `96`) permanece funcional em ambos os layouts — em desktop o offset apenas posiciona o toast um pouco acima da base da tela, o que é visualmente aceitável para v1.
