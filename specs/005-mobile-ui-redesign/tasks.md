---
description: "Lista de tarefas — Redesenho Mobile-first com Design System Inspirado no Spotify"
---

# Tarefas: 005 — Redesenho Mobile-first com Design System Inspirado no Spotify

**Entrada**: Artefatos de design em `/specs/005-mobile-ui-redesign/`
**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/ui-primitives.md, quickstart.md

**Revisão pós-`/speckit.analyze` (2026-06-17)**: a ordem original deixava a constituição "errada" enquanto o código novo já estava sendo construído (achados C1 e C2). Esta versão move a atualização da constituição (v1.2.0 → v2.0.0), do `CLAUDE.md` e do `DESIGN.md` para a Fase 2 (Fundação), antes de qualquer componente novo. O `theme.css` é eliminado ainda na Fase 2 dentro da mesma task que reescreve o `globals.css`. Sobram em US6 apenas as atualizações de memória/contexto e a remoção final das dependências do `package.json` (que só pode acontecer quando nenhum import remanesce).

**Testes**: testes unitários co-localizados são **OBRIGATÓRIOS** para todo componente React novo ou modificado (Princípio II da constituição). Testes de integração/E2E são opcionais e não foram solicitados.

**Organização**: tarefas agrupadas por história de usuário para permitir implementação e merge incrementais (via branches stacked: `task/005-T###-...`).

## Formato

`[ID] [P?] [Story] Descrição com caminho do arquivo`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência ainda pendente)
- **[Story]**: a qual história de usuário a tarefa pertence (US1–US6)

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: instalar dependências novas e configurar tooling. As dependências legadas só são removidas em T058 (após nenhum import remanescer).

- [X] T001 Instalar dependências de estilização e UI base (Tailwind, PostCSS, autoprefixer, react-loading-skeleton, tailwind-merge, clsx, lucide-react, @radix-ui/react-dialog) atualizando `package.json` na raiz
- [X] T002 [P] Criar `tailwind.config.ts` na raiz com `content: ['./src/**/*.{ts,tsx}']`, `theme.extend` populado com TODOS os tokens do `DESIGN.md` sob o namespace `mg` conforme `specs/005-mobile-ui-redesign/research.md` §1 e `data-model.md` §1
- [X] T003 [P] Criar `postcss.config.mjs` na raiz com plugins `tailwindcss` e `autoprefixer`
- [X] T004 [P] Criar mock `__mocks__/next/font/google.ts` retornando `{ className: '', style: {}, variable: '' }` para Manrope e Noto Sans (permite que Jest passe sem baixar fontes)

**Checkpoint**: dependências instaladas; configurações de tooling prontas.

---

## Fase 2: Fundação (Pré-requisitos Bloqueantes)

**Objetivo**: configurar tokens de tema globais, fontes, helpers, mocks **e reconciliar a governança** (constituição, `CLAUDE.md`, `DESIGN.md`) para que o código novo passe a ser construído sob a v2.0.0 da constituição — não sob a v1.2.0 que proibia Tailwind.

**⚠️ CRÍTICO**: nenhuma história de usuário pode começar antes desta fase. As tasks de governança (T010, T011, T012) DEVEM ser merged antes das tasks de US1.

### Foundation técnica

- [X] T005 Reescrever `src/app/globals.css` com diretivas `@tailwind base/components/utilities`, custom properties de tokens (`--mg-bg`, `--mg-green`, `--mg-transition`, etc. sob namespace `mg`), regras globais (`color-scheme: dark`, `body { background: var(--mg-bg) }`), `:focus-visible` com anel verde e `@media (prefers-reduced-motion: reduce)`; **na mesma task**, remover `src/app/theme.css` e o import correspondente em qualquer arquivo (auditar `grep -rn "theme.css" src/` → 0 ocorrências)
- [ ] T006 Modificar `src/app/layout.tsx` para carregar Manrope e Noto Sans via `next/font/google`, expor variáveis `--font-manrope` e `--font-noto-sans` em `<html>` e remover importações herdadas de Bootstrap/AdminLTE (depende de T005)
- [ ] T007 [P] Criar `src/lib/cn.ts` exportando `cn(...inputs)` baseado em `clsx` + `tailwind-merge` e seu teste co-localizado `src/lib/cn.test.ts`
- [ ] T008 [P] Criar `src/lib/useDelayedFlag.ts` (hook que retorna `true` somente após `delayMs` em que `value === true`, cancelando ao voltar para `false`) e seu teste `src/lib/useDelayedFlag.test.ts`
- [ ] T009 [P] Criar wrapper `src/components/ui/Skeleton/SkeletonProvider.tsx` (envolve children em `<SkeletonTheme baseColor="#1f1f1f" highlightColor="#272727">` de `react-loading-skeleton`) e seu teste `SkeletonProvider.test.tsx`

### Reconciliação da governança (NON-NEGOTIABLE antes da US1)

- [X] T010 [P] Atualizar `.specify/memory/constitution.md`: bump para **v2.0.0**; reescrever Princípio III removendo Bootstrap/AdminLTE como base e referenciando `DESIGN.md` + Tailwind; reescrever seções "Frontend Standards" e "Style Guide" para refletir Tailwind + DESIGN.md; adicionar regra explícita de idioma pt-BR para todos artefatos speckit; atualizar SYNC IMPACT REPORT; atualizar `Last Amended` para 2026-06-17
- [X] T011 [P] Atualizar `CLAUDE.md` na raiz para refletir: stack (Tailwind + react-loading-skeleton + lucide-react + Radix Dialog), remoção de Bootstrap/AdminLTE, navegação AppShell + BottomTabBar, primitivas em `components/ui/`, política pt-BR para specs e remoção de trechos obsoletos do style guide antigo
- [X] T012 [P] Atualizar `DESIGN.md` na raiz registrando **Manrope + Noto Sans** como pilha oficial em substituição a SpotifyMixUI/CircularSp, mantendo as demais regras (cores, geometria, sombras, do/don't) intactas

**Checkpoint**: tema global, tipografia, helpers, provider de skeleton e governança (constituição v2.0.0) operacionais. Código novo passará a ser construído sob a constituição vigente.

---

## Fase 3: História de Usuário 1 — Nova Fundação Visual em Todas as Telas (Prioridade: P1) 🎯 MVP

**Objetivo**: entregar todas as primitivas visuais (Button, FormField, Icon, EmptyState, Skeleton wrappers, Toast, ErrorAlert, ConfirmModal) já no novo padrão Tailwind + DESIGN.md, de modo que qualquer tela que migrar mais tarde já consume a fundação correta.

**Teste independente**: após o merge desta fase, abrir uma rota qualquer do produto e verificar (1) fundo near-black, (2) tipografia Manrope ativa, (3) primitivas com geometria pill/circular e verde apenas em CTAs, (4) skeletons substituindo qualquer spinner remanescente.

### Implementação para US1

- [ ] T013 [P] [US1] Criar `src/components/ui/Icon/Icon.tsx` (wrapper de `lucide-react` com defaults `size={20}`, `aria-hidden={true}`) e teste `Icon.test.tsx`
- [ ] T014 [P] [US1] Criar `src/components/ui/Skeleton/SkeletonBox.tsx`, `SkeletonText.tsx`, `SkeletonCircle.tsx` (wrappers de `react-loading-skeleton` padronizando tamanhos/raios) e os testes correspondentes co-localizados
- [ ] T015 [P] [US1] Reescrever `src/components/ui/Button/Button.tsx` com variantes (`primary`, `secondary`, `outline`, `ghost`), shapes (`pill`, `pill-lg`, `circle`), `uppercase` default, suporte a `loading` (que troca conteúdo por SkeletonText, jamais spinner) e atualizar `Button.test.tsx` removendo asserções em classes Bootstrap e cobrindo todas as variantes + `aria-busy`
- [ ] T016 [P] [US1] Reescrever `src/components/ui/FormField/FormField.tsx` com input pill, `shadow-mg-inset`, suporte a `error` com `border-mg-text-negative` e mensagem em `text-mg-text-negative`; atualizar `FormField.test.tsx`
- [ ] T017 [P] [US1] Reescrever `src/components/ui/Toast/Toast.tsx` (paleta escura, sem Bootstrap; mantém API atual) e atualizar `Toast.test.tsx`
- [ ] T018 [P] [US1] Reescrever `src/components/ui/ErrorAlert/ErrorAlert.tsx` usando `text-mg-text-negative` e estrutura do DESIGN.md, escopo restrito a **alertas inline em formulários** conforme `contracts/ui-primitives.md` §2b; atualizar `ErrorAlert.test.tsx`
- [ ] T019 [US1] Reescrever `src/components/ui/ConfirmModal/ConfirmModal.tsx` em cima de `@radix-ui/react-dialog` com `shadow-mg-dialog`, props conforme `data-model.md` §2 (`destructive`, `isLoading`), `aria-*` herdados do Radix; atualizar `ConfirmModal.test.tsx` (depende de T013, T015)
- [ ] T020 [US1] Criar `src/components/ui/EmptyState/EmptyState.tsx` com props conforme `data-model.md` §2 (`variant`, `icon`, `title`, `description`, `cta`) e teste `EmptyState.test.tsx` cobrindo `variant='default'`, `variant='error'`, sem CTA e CTA como link, conforme `contracts/ui-primitives.md` §2b (depende de T013, T015)

**Checkpoint**: ao final desta fase, todas as primitivas visuais novas estão prontas, testadas e exportadas.

---

## Fase 4: História de Usuário 2 — Navegação Estilo Aplicativo (Prioridade: P2)

**Objetivo**: substituir o chassi AdminLTE pela `AppShell` + `BottomTabBar` (Grupos + Perfil), remover a rota `/dashboard` por completo.

**Teste independente**: logar e verificar (1) ausência de sidebar/header AdminLTE, (2) bottom tab bar persistente com Grupos e Perfil somente, (3) URL `/dashboard` retorna 404 do Next, (4) layout app-like em 320px e em desktop.

### Implementação para US2

- [ ] T021 [P] [US2] Criar `src/components/ui/BottomTabBar/BottomTabBar.tsx` (nav fixo bottom com tabs Grupos e Perfil, `aria-current="page"` no ativo via `usePathname`, padding-bottom com `env(safe-area-inset-bottom)`) e teste `BottomTabBar.test.tsx`
- [ ] T022 [US2] Criar `src/components/ui/AppShell/AppShell.tsx` (container `min-h-dvh bg-mg-bg`, conteúdo centralizado em `max-w-app mx-auto`, padding-bottom suficiente para a tab bar) com `SkeletonProvider` aninhado; teste `AppShell.test.tsx` (depende de T009, T021)
- [ ] T023 [US2] Reescrever `src/app/(protected)/layout.tsx` substituindo `AdminLTELayout` por `<AppShell>` envolvendo children
- [ ] T024 [US2] Remover `src/app/(protected)/AdminLTELayout.test.tsx` (componente eliminado)
- [ ] T025 [US2] Remover por completo `src/app/(protected)/dashboard/` (pasta inteira) e auditar via `grep -rn "/dashboard" src/` que nenhum link interno aponta mais para essa rota (FR-005)

**Checkpoint**: usuário autenticado cai em `/groups` e navega com bottom tab bar; nenhum vestígio do dashboard remanesce.

---

## Fase 5: História de Usuário 3 — Áreas Públicas Redesenhadas (Prioridade: P3)

**Objetivo**: migrar landing, login e cadastro para Tailwind + primitivas novas, preservando fluxo de auto-login após cadastro e `returnUrl` no login.

**Teste independente**: deslogar e percorrer `/`, `/login`, `/register` validando novo visual e fluxos atuais sem regressão.

### Implementação para US3

- [ ] T026 [P] [US3] Refazer `src/components/landing/HeroSection.tsx` em Tailwind (sem gradiente roxo / glassmorphism), CTAs como `<Button variant="primary" shape="pill-lg" />`; atualizar `HeroSection.test.tsx`
- [ ] T027 [P] [US3] Refazer `src/components/login/LoginForm.tsx` com `<FormField>` e `<Button>` novos, mantendo lógica de `returnUrl`; atualizar `LoginForm.test.tsx`
- [ ] T028 [P] [US3] Refazer `src/components/register/RegisterForm.tsx` com primitivas novas mantendo fluxo de auto-login pós-cadastro; atualizar `RegisterForm.test.tsx`
- [ ] T029 [US3] Modificar `src/app/(public)/page.tsx` (landing) consumindo HeroSection refeita e atualizar `page.test.tsx`
- [ ] T030 [US3] Modificar `src/app/(public)/login/page.tsx` e `page.test.tsx` consumindo LoginForm refeita
- [ ] T031 [US3] Modificar `src/app/(public)/register/page.tsx` e `page.test.tsx` consumindo RegisterForm refeita

**Checkpoint**: funil público inteiro vive na nova identidade; fluxos de auth preservados.

---

## Fase 6: História de Usuário 4 — Lista, Detalhe e Ações de Grupos (Prioridade: P4)

**Objetivo**: migrar toda superfície de grupos (lista, filtros, cartões, criação, detalhe, lista de membros com bottom sheet, convite, sorteio) para o novo padrão; converter modais legados em rotas (criar/convite) e bottom sheet (detalhes de membro) conforme FR-023.

**Teste independente**: percorrer todos os fluxos de grupos como usuário autenticado e validar visual + preservação funcional.

### Implementação para US4

- [ ] T032 [US4] Criar `src/components/ui/BottomSheet/BottomSheet.tsx` em cima de `@radix-ui/react-dialog` (slide bottom-up, `shadow-mg-dialog`, props conforme `data-model.md` §2) e teste `BottomSheet.test.tsx`
- [ ] T033 [P] [US4] Refazer `src/components/groups/GroupCard/GroupCard.tsx` em Tailwind (cartão `bg-mg-surface`, `rounded-card`, sombra `shadow-mg-card` em hover, contagem de membros e badge de propriedade preservados) e atualizar `GroupCard.test.tsx`
- [ ] T034 [P] [US4] Refazer `src/components/groups/GroupStatusBadge/GroupStatusBadge.tsx` como pill compacto e atualizar teste
- [ ] T035 [P] [US4] Refazer `src/components/groups/GroupFilters/GroupFilters.tsx` (input search pill, multiselect de status como chips/pills, sort toggle) preservando debounce; atualizar `GroupFilters.test.tsx`
- [ ] T036 [P] [US4] Refazer `src/components/groups/GroupEmptyState/GroupEmptyState.tsx` reusando `<EmptyState />` (ou removendo o wrapper se redundante após a primitiva) e atualizar teste
- [ ] T037 [US4] Refazer `src/components/groups/GroupList/GroupList.tsx` consumindo SkeletonCard durante carregamento (com `useDelayedFlag(loading, 150)`), `<EmptyState />` para vazios e `<EmptyState variant="error" />` para falhas (com botão "Tentar novamente"); atualizar `GroupList.test.tsx` (depende de T033, T034, T035, T036)
- [ ] T038 [US4] Extrair formulário do `CreateGroupModal` para `src/components/groups/CreateGroupForm/CreateGroupForm.tsx` puro (sem modal) e criar teste `CreateGroupForm.test.tsx`
- [ ] T039 [US4] Criar nova rota `src/app/(protected)/groups/new/page.tsx` consumindo `CreateGroupForm` e teste `page.test.tsx`; substituir todas as aberturas do modal por navegação para `/groups/new` (depende de T038)
- [ ] T040 [US4] Remover por completo o diretório `src/components/groups/CreateGroupModal/` após auditoria de que nenhum import remanesce (`grep -rn "CreateGroupModal" src/` → 0)
- [ ] T041 [P] [US4] Refazer `src/components/groups/DrawButton/DrawButton.tsx` como botão circular ou pill grande conforme DESIGN.md, com `ConfirmModal` mantido para confirmação; atualizar `DrawButton.test.tsx`
- [ ] T042 [P] [US4] Refazer `src/components/groups/GroupActions/GroupActions.tsx` em Tailwind preservando comportamento; atualizar teste
- [ ] T043 [P] [US4] Refazer `src/components/groups/ResultReveal/ResultReveal.tsx` em Tailwind; atualizar teste
- [ ] T044 [US4] Criar `src/components/groups/MemberProfileSheet/MemberProfileSheet.tsx` substituindo o modal antigo por `<BottomSheet>`; teste `MemberProfileSheet.test.tsx` cobrindo abertura via clique, fechamento por ESC/backdrop e a11y (depende de T032)
- [ ] T045 [US4] Refazer `src/components/groups/MemberList/MemberList.tsx` para abrir `MemberProfileSheet` ao clicar em um membro (em vez do modal antigo); atualizar `MemberList.test.tsx` (depende de T044)
- [ ] T046 [US4] Remover por completo o diretório `src/components/groups/MemberProfileModal/` após auditoria de que nenhum import remanesce (`grep -rn "MemberProfileModal" src/` → 0) (depende de T045)
- [ ] T047 [US4] Refatorar `src/components/groups/InviteSection/InviteSection.tsx` para navegar para a nova rota `/groups/[id]/invite` em vez de abrir overlay/modal; atualizar `InviteSection.test.tsx`
- [ ] T048 [US4] Criar nova rota `src/app/(protected)/groups/[id]/invite/page.tsx` com formulário de convite e fluxo completo preservado; teste `page.test.tsx`
- [ ] T049 [US4] Modificar `src/app/(protected)/groups/page.tsx` (lista) e `page.test.tsx` consumindo `GroupList` + `GroupFilters` refeitos
- [ ] T050 [US4] Modificar `src/app/(protected)/groups/[id]/page.tsx` (detalhe) e `page.test.tsx` consumindo componentes refeitos (cartão, ações, lista de membros via sheet, sorteio)

**Checkpoint**: lista, detalhe, criação, convite, lista de membros, sheet de detalhes e sorteio operam no novo padrão; nenhum modal não-confirmatório remanesce.

---

## Fase 7: História de Usuário 5 — Perfil e Convite (Prioridade: P5)

**Objetivo**: migrar página de perfil (com botão "Sair") e fluxo público de convite (`/invite/[token]`).

**Teste independente**: abrir `/profile` autenticado e validar dados + botão Sair; abrir uma URL de convite válida deslogado e logado e validar fluxos preservados.

### Implementação para US5

- [ ] T051 [P] [US5] Refazer `src/components/profile/ProfileCard/ProfileCard.tsx` em Tailwind exibindo nome, sobrenome, e-mail, data de criação; atualizar `ProfileCard.test.tsx`
- [ ] T052 [P] [US5] Criar `src/components/profile/LogoutButton/LogoutButton.tsx` (Button outline, chama `clearToken()` e redireciona) e teste `LogoutButton.test.tsx`
- [ ] T053 [US5] Modificar `src/app/(protected)/profile/page.tsx` e `page.test.tsx` consumindo `ProfileCard` + `LogoutButton` (depende de T051, T052)
- [ ] T054 [P] [US5] Refazer `src/components/invite/InviteJoinCard/InviteJoinCard.tsx` em Tailwind preservando fluxo de aceite com login obrigatório e `returnUrl`; atualizar teste
- [ ] T055 [US5] Modificar `src/app/invite/[token]/page.tsx` e `page.test.tsx` consumindo `InviteJoinCard` refeito

**Checkpoint**: toda a área autenticada e o ponto de entrada do convite operam na nova identidade.

---

## Fase 8: História de Usuário 6 — Encerramento da Governança e Dependências (Prioridade: P6)

**Objetivo**: completar as atualizações de governança iniciadas na Fase 2 (memórias persistentes) e remover definitivamente as dependências legadas do `package.json` — só possível quando nenhum import remanesce.

**Teste independente**: ler memórias atualizadas e confirmar ausência de referências obsoletas; rodar `npm ls bootstrap admin-lte jquery popper.js @fortawesome/fontawesome-free` e ver "(empty)".

### Implementação para US6

- [ ] T056 [P] [US6] Atualizar `/Users/waliqueiroz/.claude/projects/-Users-waliqueiroz-Documents-projetos-mystery-gifter-fe/memory/MEMORY.md` (e arquivos de memória apontados por ele) removendo referências a Bootstrap/AdminLTE e à política de inglês para specs; refletir nova stack e política pt-BR
- [ ] T057 [US6] Remover de `package.json` as dependências `bootstrap`, `admin-lte`, `jquery`, `popper.js`, `@fortawesome/fontawesome-free` e `@types/jquery`; rodar `npm install` para reconciliar lockfile; auditar via `grep -rnE "bootstrap|admin-lte|jquery|popper|fortawesome" src/` para garantir 0 imports remanescentes (depende de T023, T029, T031, T049, T050, T053, T055)

**Checkpoint**: governança e dependências totalmente alinhadas ao código entregue.

---

## Fase 9: Polimento & Verificações Transversais

**Objetivo**: validar critérios de sucesso, executar gates de qualidade e amarrar pontas soltas.

- [ ] T058 [P] Rodar `npm run build` e validar SC-002 (0 referências a Bootstrap/AdminLTE em assets do build) via `grep -ri "bootstrap\|admin-lte\|jquery" .next/static` (esperado vazio)
- [ ] T059 [P] Rodar `npm test -- --coverage` e validar SC-003 (todos os testes passam, cobertura ≥ 80%)
- [ ] T060 [P] Auditar SC-004 e SC-008: `grep -RnE '#[0-9a-fA-F]{3,6}' src/ --include='*.tsx' --include='*.ts'` deve ficar restrito a arquivos de configuração/tema; `grep -RnE 'rounded(?!-pill|-card|-full)' src/components` deve retornar vazio
- [ ] T061 [P] Auditar SC-011 e SC-012: `grep -RinE 'spinner|loading-icon|fa-spin' src/` (esperado vazio) e auditoria manual de imports — apenas `ConfirmModal` é importado de `components/ui/` como overlay
- [ ] T062 [P] **Inventário de rotas/telas (SC-001)**: gerar checklist em `specs/005-mobile-ui-redesign/checklists/screen-inventory.md` listando cada rota existente em `src/app/` e marcando "✅ migrada" para cada uma; bloquear merge enquanto houver "❌"
- [ ] T063 [P] **Auditoria de a11y (FR-014, FR-015, FR-016, SC-006)**: rodar axe em cada tela representativa (landing, login, register, groups, groups/[id], groups/new, groups/[id]/invite, profile, invite/[token]); validar foco visível por tabulação em fluxos críticos; corrigir achados
- [ ] T064 [P] **Auditoria pt-BR (FR-017)**: rodar `grep -RinE "\b(loading|submit|cancel|confirm|email|password|users?|groups?|profile|members?|register|login|logout)\b" src/components src/app --include='*.tsx'` filtrando strings visíveis ao usuário; substituir as ocorrências por pt-BR; testes podem usar inglês livremente
- [ ] T065 Validar SC-005 manualmente seguindo `quickstart.md` (320px sem scroll horizontal nos fluxos críticos via DevTools)
- [ ] T066 Rodar `npm run lint` e `npm run type-check`; corrigir warnings remanescentes
- [ ] T067 Validar end-to-end `quickstart.md` (todos os roteiros de teste manual por história executados sem regressão)

---

## Dependências & Ordem de Execução

### Dependências entre fases

- **Fase 1 (Setup)**: sem dependências — pode começar imediatamente.
- **Fase 2 (Fundação)**: depende da Fase 1. Inclui reconciliação da governança (T010–T012) que DEVE ser merged antes da Fase 3.
- **Fase 3 (US1)**: depende da Fase 2 (especialmente T010–T012 mergeados). Bloqueia Fases 4–7.
- **Fase 4 (US2)**: depende da Fase 3. Bloqueia Fases 5–7.
- **Fases 5 (US3), 6 (US4), 7 (US5)**: dependem das Fases 3 e 4. PODEM rodar em paralelo entre si.
- **Fase 8 (US6)**: depende de TODAS as fases anteriores (T057 só pode rodar quando nenhum import legado remanesce).
- **Fase 9 (Polimento)**: depende da Fase 8.

### Dependências entre histórias

- Governança (T010–T012) → bloqueia US1
- US1 (P1) → bloqueia US2, US3, US4, US5
- US2 (P2) → bloqueia US3, US4, US5 (depende do AppShell)
- US3 (P3), US4 (P4), US5 (P5) → independentes entre si após US1+US2
- US6 (P6) → bloqueada por US1–US5

### Dentro de cada história

- Componentes refeitos antes das páginas que os consomem
- Páginas antes da auditoria final
- Tasks marcadas `[P]` dentro da mesma fase podem rodar em paralelo (arquivos disjuntos)

---

## Exemplo de Paralelização — Fase 2

```bash
# Após T005 e T006 concluírem, lançar em paralelo:
Task: "T007 — cn helper"
Task: "T008 — useDelayedFlag"
Task: "T009 — SkeletonProvider"
Task: "T010 — Constituição v2.0.0"
Task: "T011 — CLAUDE.md"
Task: "T012 — DESIGN.md"
```

## Exemplo de Paralelização — US1

```bash
# Após T009 e T010 concluírem, lançar em paralelo:
Task: "T013 — Icon"
Task: "T014 — Skeleton wrappers"
Task: "T015 — Button"
Task: "T016 — FormField"
Task: "T017 — Toast"
Task: "T018 — ErrorAlert"

# Depois (sequencial porque consomem Icon/Button):
Task: "T019 — ConfirmModal"
Task: "T020 — EmptyState"
```

---

## Estratégia de Implementação

### MVP (Fases 1–4: Setup + Fundação + US1 + US2)

1. Fase 1 (Setup) + Fase 2 (Fundação inclusive governança).
2. Fase 3 (US1) → primitivas prontas.
3. Fase 4 (US2) → app shell + bottom tab bar.
4. **PARAR E VALIDAR**: produto ainda usa páginas legadas internamente, mas chassi, primitivas e governança já são as novas.

### Entrega Incremental por História

1. Mergear Fases 1–2 → tooling + governança v2.0.0.
2. Mergear Fase 3 (US1) + Fase 4 (US2) → chassi e primitivas.
3. Mergear Fase 5 (US3) → funil público modernizado.
4. Mergear Fase 6 (US4) → fluxo principal modernizado.
5. Mergear Fase 7 (US5) → áreas restantes modernizadas.
6. Mergear Fase 8 (US6) → memórias e dependências limpas.
7. Mergear Fase 9 → polimento final antes do PR `feature/005-mobile-ui-redesign → develop`.

### Branches Stacked (workflow obrigatório do projeto)

- Branch base da feature: `feature/005-mobile-ui-redesign`.
- Cada task individual vira `task/005-T###-descricao` empilhada na sua dependência direta.
- Cada PR de task targets sua parent branch.

---

## Notas

- `[P]` = arquivos diferentes, sem dependências pendentes.
- `[Story]` = traceability para uma história de usuário.
- Cada componente novo OBRIGATORIAMENTE leva seu teste co-localizado (Princípio II).
- Commit após cada task ou agrupamento lógico; PR pequeno (200–400 LOC alvo).
- Após cada checkpoint, validar a história isoladamente antes de avançar.
- Evitar: tasks vagas, conflitos no mesmo arquivo entre tasks `[P]`, dependências cruzadas entre histórias que quebrem independência.
