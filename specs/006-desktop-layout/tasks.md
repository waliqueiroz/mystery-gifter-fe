# Tasks: Layout Responsivo Desktop

**Input**: `specs/006-desktop-layout/` (spec.md, plan.md, research.md, data-model.md)  
**Branch base**: `006-desktop-layout`

**Testes**: Unitários são OBRIGATÓRIOS para todo componente React novo ou modificado (Constituição, Princípio II). Testes de integração/E2E não foram solicitados — não incluídos.

## Formato: `[ID] [P?] [Story?] Descrição com caminho de arquivo`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências não satisfeitas)
- **[Story]**: User story correspondente (US1, US2, US3)
- US1 = Sidebar de navegação (P1) | US2 = Grade de grupos (P2) | US3 = Formulários e detalhe (P3)

---

## Phase 1: Setup — Tokens e Breakpoints

**Objetivo**: Adicionar ao sistema de design os tokens necessários para as classes responsivas desktop. Bloqueia todas as fases seguintes.

- [X] T001 Atualizar `tailwind.config.ts` adicionando: breakpoint customizado `desk: '896px'` em `theme.extend.screens`, token de largura `sidebar: '220px'` em `theme.extend.width`, e token `content: '640px'` em `theme.extend.maxWidth`

**Checkpoint**: Classes `desk:*`, `w-sidebar` e `max-w-content` disponíveis em todo o projeto.

---

## Phase 2: Foundational — Componente Sidebar

**Objetivo**: Criar a primitiva de navegação lateral antes que o AppShell possa referenciá-la. Bloqueia a Phase 3 (US1).

**⚠️ CRÍTICO**: Phase 3 (US1) não pode começar sem a Sidebar existir.

- [X] T002 Criar `src/components/ui/Sidebar/Sidebar.test.tsx` cobrindo: render sem crash, exibe ícone Gift + texto "Mystery Gifter", exibe links "Grupos" e "Perfil", link ativo recebe `aria-current="page"` e classes `text-mg-green`, link inativo NÃO tem `aria-current`, ambos os links são acessíveis via teclado
- [X] T003 Criar `src/components/ui/Sidebar/Sidebar.tsx` implementando: `"use client"` (usa `usePathname`), elemento `<nav>` com `aria-label="Navegação principal — desktop"`, seção de brand com `<Icon name="Gift" aria-hidden />` + "Mystery Gifter" em tipografia title, lista de links (Grupos → `/groups`, Perfil → `/profile`) detectando ativo via `pathname.startsWith`, ativo em `text-mg-green`, inativo em `text-mg-text-muted hover:text-mg-text`, `aria-current="page"` no link ativo, fundo `bg-mg-bg`, borda direita `border-r border-mg-border/40`, altura `min-h-screen` (ou `h-screen sticky top-0` para scroll), largura `w-sidebar`

**Checkpoint**: `Sidebar` renderiza corretamente com testes passando. `npm test Sidebar` verde.

---

## Phase 3: User Story 1 — Navegação Lateral Persistente no Desktop (P1) 🎯 MVP

**Objetivo**: Em telas ≥896px a sidebar substitui a bottom tab bar em TODAS as páginas autenticadas.

**Independent Test**: Abrir qualquer página autenticada com viewport ≥896px → sidebar visível à esquerda, bottom tab bar oculta. Redimensionar para <896px → bottom tab bar volta, sidebar some.

### Testes para US1

- [X] T004 Atualizar `src/components/ui/AppShell/AppShell.test.tsx` adicionando testes: AppShell renderiza `<Sidebar>` no DOM, AppShell renderiza `<BottomTabBar>` no DOM, main tem classe `flex-1` (desktop), wrapper raiz tem `flex` e `desk:flex-row`
- [X] T005 [P] Atualizar `src/components/ui/BottomTabBar/BottomTabBar.test.tsx` adicionando teste: elemento `<nav>` raiz possui a classe `desk:hidden`

### Implementação de US1

- [X] T006 Atualizar `src/components/ui/AppShell/AppShell.tsx` reestruturando para layout responsivo: wrapper raiz passa a `flex desk:flex-row min-h-dvh bg-mg-bg text-mg-text`; adicionar `<Sidebar />` com `hidden desk:flex flex-col w-sidebar shrink-0`; `<main>` passa a `flex-1 min-w-0 mx-auto max-w-app px-4 pt-6 pb-[calc(...)] desk:max-w-none desk:mx-0 desk:px-6 desk:pb-6`; remover `max-w-app` e padding de bottom tab bar no breakpoint desktop; manter `<SkeletonProvider>` e `<BottomTabBar>`
- [X] T007 [P] Atualizar `src/components/ui/BottomTabBar/BottomTabBar.tsx` adicionando classe `desk:hidden` ao elemento `<nav>` raiz (uma linha de mudança)

**Checkpoint**: US1 completa. Sidebar visível em ≥896px, bottom tab bar oculta. Mobile inalterado. `npm test` verde para AppShell e BottomTabBar.

---

## Phase 4: User Story 2 — Grade de Grupos Otimizada para Desktop (P2)

**Objetivo**: Lista de grupos exibe cards em grade multi-coluna em telas ≥896px.

**Independent Test**: Acessar `/groups` em viewport ≥1024px → cards dispostos em ≥2 colunas. Em <896px → coluna única mantida.

### Testes para US2

- [X] T008 Atualizar `src/components/groups/GroupList/GroupList.test.tsx` adicionando testes: container de cards tem classe `grid` (não mais `flex`), container de cards tem `grid-cols-1`, container de skeleton (`data-testid="group-list-skeleton"`) também tem classe `grid`

### Implementação de US2

- [X] T009 Atualizar `src/components/groups/GroupList/GroupList.tsx` alterando o container de cards de `flex flex-col gap-3` para `grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-3`, e aplicando as mesmas classes no container de skeletons da função `SkeletonList`

**Checkpoint**: US2 completa. Grade responsiva funciona com cards, skeletons e estado vazio. `npm test GroupList` verde.

---

## Phase 5: User Story 3 — Formulários e Páginas de Detalhe no Desktop (P3)

**Objetivo**: Formulários públicos e protegidos, e páginas de detalhe, ficam centralizados com largura adequada em telas desktop.

**Independent Test**: Abrir `/login`, `/groups/new` e um detalhe de grupo em viewport ≥1024px → conteúdo centralizado com max-width visível, não ocupando a tela inteira.

**Nota de dependência**: Tasks T010–T015 (páginas públicas) dependem apenas de T001 (tokens). Tasks T016–T023 (páginas protegidas) dependem de T006 (AppShell sem max-w-app global no desktop).

### Páginas Públicas (paralelas entre si; dependem de T001)

- [X] T010 [P] [US3] Atualizar `src/components/login/LoginForm/LoginForm.tsx` adicionando `mx-auto max-w-content` ao container raiz do formulário (wrapper `<div>` ou `<form>` mais externo)
- [X] T011 [P] [US3] Atualizar `src/components/login/LoginForm/LoginForm.test.tsx` verificando que o container raiz possui `max-w-content`
- [X] T012 [P] [US3] Atualizar o componente de cadastro (verificar caminho real: provavelmente `src/components/register/RegisterForm/RegisterForm.tsx` ou inline em `src/app/(public)/register/page.tsx`) adicionando `mx-auto max-w-content` ao container raiz
- [X] T013 [P] [US3] Atualizar o teste correspondente ao componente de cadastro verificando o `max-w-content`
- [X] T014 [P] [US3] Atualizar a página pública de aceite de convite (verificar caminho real: componente filho de `src/app/invite/[token]/page.tsx`) adicionando `mx-auto max-w-content` ao container raiz
- [X] T015 [P] [US3] Atualizar `src/app/invite/[token]/page.test.tsx` verificando o `max-w-content` no container

### Páginas Protegidas (paralelas entre si; dependem de T006)

- [X] T016 [P] [US3] Atualizar `src/components/groups/CreateGroupForm/CreateGroupForm.tsx` adicionando `mx-auto max-w-content` ao container raiz do formulário
- [X] T017 [P] [US3] Atualizar `src/components/groups/CreateGroupForm/CreateGroupForm.test.tsx` verificando `max-w-content` no container raiz
- [X] T018 [P] [US3] Atualizar `src/app/(protected)/groups/[id]/page.tsx` (função `GroupDetailContent`) adicionando `desk:max-w-content desk:mx-auto` ao `<div>` raiz do conteúdo
- [X] T019 [P] [US3] Atualizar `src/app/(protected)/groups/[id]/page.test.tsx` verificando `max-w-content` no container de detalhe
- [X] T020 [P] [US3] Atualizar a página/componente de convite de membro (verificar caminho: `src/app/(protected)/groups/[id]/invite/page.tsx` ou componente filho) adicionando `mx-auto max-w-content`
- [X] T021 [P] [US3] Atualizar `src/app/(protected)/groups/[id]/invite/page.test.tsx` verificando `max-w-content`
- [X] T022 [P] [US3] Atualizar a página/componente de perfil (verificar caminho: `src/app/(protected)/profile/page.tsx` ou componente filho) adicionando `mx-auto max-w-content`
- [X] T023 [P] [US3] Atualizar `src/app/(protected)/profile/page.test.tsx` verificando `max-w-content`

**Checkpoint**: US3 completa. Todos os formulários e páginas de detalhe exibem `max-w-content` centralizado em desktop. `npm test` verde em todas as páginas modificadas.

---

## Phase 6: Polish — Emenda à Constituição

**Objetivo**: Atualizar a constituição para refletir o design responsivo implementado e remover as regras obsoletas que conflitam com a feature 006.

- [X] T024 Atualizar `.specify/memory/constitution.md` fazendo: (1) atualizar Princípio III removendo "conteúdo permanece centralizado dentro de max-w-app" e substituindo pela regra de layout adaptativo (≥896px → sidebar + conteúdo expandido; <896px → mobile inalterado); (2) atualizar regra de navegação de "bottom tab bar persistente em todas as larguras" para "navegação adaptativa: bottom tab bar em mobile, sidebar em desktop"; (3) bump de versão `2.0.0` → `2.1.0`; (4) atualizar `Last Amended` para a data do merge da feature

**Checkpoint**: Constituição v2.1.0 reflete o estado real do produto sem contradições.

---

## Dependências & Ordem de Execução

### Dependências entre fases

```
T001 (Tokens)
  └→ T002 → T003 (Sidebar)
               └→ T004 → T005 [P]     ← US1: AppShell + BottomTabBar tests
                  T006 → T007 [P]     ← US1: AppShell + BottomTabBar impl
                    └→ T008 → T009    ← US2: GroupList (depois de US1)
                    └→ T016–T023 [P]  ← US3b: Protected pages (depois de US1)
  └→ T010–T015 [P]                   ← US3a: Public pages (paralelas com US1/US2)

T024 (Constituição)                   ← independente, idealmente após T006
```

### Dependências entre user stories

- **US1 (P1)**: Requer Phases 1 e 2 completas. Não depende de US2 ou US3.
- **US2 (P2)**: Requer US1 completa (AppShell precisa estar reestruturado para o grid ter espaço útil).
- **US3 (P3)**: Páginas públicas requerem apenas T001. Páginas protegidas requerem US1 completa (T006).

### Dentro de cada story

- Testes antes (ou junto) da implementação
- T004 e T005 podem rodar em paralelo (arquivos diferentes)
- T006 e T007 podem rodar em paralelo (arquivos diferentes)
- T010–T015 todos paralelos entre si
- T016–T023 todos paralelos entre si

---

## Exemplo de Paralelismo: Phase 3 (US1)

```bash
# Rodar em paralelo (arquivos diferentes):
Task T004: "Atualizar AppShell.test.tsx"
Task T005: "Atualizar BottomTabBar.test.tsx"

# Depois que os testes passam em vermelho, rodar em paralelo:
Task T006: "Atualizar AppShell.tsx"
Task T007: "Atualizar BottomTabBar.tsx"
```

## Exemplo de Paralelismo: Phase 5 (US3)

```bash
# Depois de T001 (tokens), rodar em paralelo:
Task T010: "LoginForm.tsx"
Task T012: "RegisterForm.tsx"
Task T014: "Invite acceptance page"

# Depois de T006 (AppShell), rodar em paralelo:
Task T016: "CreateGroupForm.tsx"
Task T018: "GroupDetailContent"
Task T020: "Invite member page"
Task T022: "Profile page"
```

---

## Estratégia de Implementação

### MVP (apenas US1 — Sidebar de Navegação)

1. Completar Phase 1: T001 (tokens)
2. Completar Phase 2: T002 → T003 (Sidebar component)
3. Completar Phase 3: T004, T005 → T006, T007 (AppShell + BottomTabBar)
4. **PARAR e VALIDAR**: sidebar visível no desktop, bottom bar oculta, mobile inalterado
5. Merge na feature branch → demonstrar para stakeholders

### Entrega Incremental

1. Setup + Foundational (T001–T003) → Sidebar pronta para uso
2. US1 (T004–T007) → Navegação desktop funcionando → **Demo MVP**
3. US2 (T008–T009) → Grade de grupos funcionando → **Demo +**
4. US3 (T010–T023) → Formulários e páginas de detalhe centralizados → **Feature completa**
5. Polish (T024) → Constituição atualizada → **PR final**

### Branches Empilhadas (conforme CLAUDE.md)

```
006-desktop-layout (base)
  └→ task/006-phase-1-tokens           (T001)
      └→ task/006-phase-2-sidebar      (T002–T003)
          └→ task/006-phase-3-appshell (T004–T007)  ← US1
              ├→ task/006-phase-4-grid (T008–T009)  ← US2
              └→ task/006-phase-6-content-width (T016–T023) ← US3 protegidas
  └→ task/006-phase-5-public-pages     (T010–T015)  ← US3 públicas (paralela)
  └→ task/006-phase-7-constitution     (T024)        ← independente
```

---

## Notas

- `[P]` = arquivos diferentes, sem dependências entre si naquele momento
- Testes unitários são OBRIGATÓRIOS (Constituição Princípio II) — commitados no mesmo PR da implementação
- Verificar caminhos reais de componentes antes de modificar (T012, T014, T020, T022) — alguns podem estar inline na page.tsx
- `desk:*` classes só funcionam após T001 ser commitado na branch
- Commit após cada task ou grupo lógico; parar nos checkpoints para validar
- `npm test`, `npm run lint` e `npm run build` devem passar antes de cada PR
