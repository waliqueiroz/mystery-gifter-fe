---
description: "Lista de tarefas — Redesenho Mobile-first com Design System Inspirado no Spotify"
---

# Tarefas: 005 — Redesenho Mobile-first com Design System Inspirado no Spotify

**Entrada**: Artefatos de design em `/specs/005-mobile-ui-redesign/`
**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/ui-primitives.md, quickstart.md

**Testes**: testes unitários co-localizados são **OBRIGATÓRIOS** para todo componente React novo ou modificado (Princípio II da constituição). Testes de integração/E2E são opcionais e não foram solicitados.

**Organização**: tarefas agrupadas por história de usuário para permitir implementação e merge incrementais (via branches stacked: `task/005-T###-...`).

## Formato

`[ID] [P?] [Story] Descrição com caminho do arquivo`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência ainda pendente)
- **[Story]**: a qual história de usuário a tarefa pertence (US1–US6)

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: instalar dependências novas e remover dependências legadas que NÃO bloqueiam o restante da migração (as legadas só saem definitivamente em P6 / Polish, após nenhum import remanescente).

- [ ] T001 Instalar dependências de estilização e UI base (Tailwind, PostCSS, autoprefixer, react-loading-skeleton, tailwind-merge, clsx, lucide-react, @radix-ui/react-dialog) atualizando `package.json` na raiz
- [ ] T002 [P] Criar `tailwind.config.ts` na raiz com `content: ['./src/**/*.{ts,tsx}']`, `theme.extend` populado com TODOS os tokens do `DESIGN.md` conforme `specs/005-mobile-ui-redesign/research.md` §1
- [ ] T003 [P] Criar `postcss.config.mjs` na raiz com plugins `tailwindcss` e `autoprefixer`
- [ ] T004 [P] Criar mock `__mocks__/next/font/google.ts` retornando `{ className: '', style: {}, variable: '' }` para Manrope e Noto Sans (permite que Jest passe sem baixar fontes)

**Checkpoint**: dependências instaladas; configurações de tooling prontas para serem consumidas pelo código.

---

## Fase 2: Fundação (Pré-requisitos Bloqueantes)

**Objetivo**: configurar tokens de tema globais, fontes, helpers e mocks que TODAS as histórias subsequentes vão consumir.

**⚠️ CRÍTICO**: nenhuma história de usuário pode começar antes desta fase.

- [ ] T005 Reescrever `src/app/globals.css` com diretivas `@tailwind base/components/utilities`, custom properties de tokens (`--mg-bg`, `--mg-green`, `--mg-transition`, etc.), regras globais (`color-scheme: dark`, `body { background: var(--mg-bg) }`), `:focus-visible` com anel verde e `@media (prefers-reduced-motion: reduce)`
- [ ] T006 Modificar `src/app/layout.tsx` para carregar Manrope e Noto Sans via `next/font/google`, expor variáveis `--font-manrope` e `--font-noto-sans` em `<html>` e remover importações herdadas de Bootstrap/AdminLTE
- [ ] T007 [P] Criar `src/lib/cn.ts` exportando `cn(...inputs)` baseado em `clsx` + `tailwind-merge` e seu teste co-localizado `src/lib/cn.test.ts`
- [ ] T008 [P] Criar `src/lib/useDelayedFlag.ts` (hook que retorna `true` somente após `delayMs` em que `value === true`, cancelando ao voltar para `false`) e seu teste `src/lib/useDelayedFlag.test.ts`
- [ ] T009 [P] Criar wrapper `src/components/ui/Skeleton/SkeletonProvider.tsx` (envolve children em `<SkeletonTheme baseColor="#1f1f1f" highlightColor="#272727">` de `react-loading-skeleton`) e seu teste `SkeletonProvider.test.tsx`

**Checkpoint**: tema global, tipografia, helpers de classes e provider de skeleton operacionais. Histórias podem começar.

---

## Fase 3: História de Usuário 1 — Nova Fundação Visual em Todas as Telas (Prioridade: P1) 🎯 MVP

**Objetivo**: entregar todas as primitivas visuais (Button, FormField, Icon, EmptyState, Skeleton wrappers, Toast, ErrorAlert, ConfirmModal) já no novo padrão Tailwind + DESIGN.md, de modo que qualquer tela que migrar mais tarde já consume a fundação correta.

**Teste independente**: após o merge desta fase, abrir uma rota qualquer do produto e verificar (1) fundo near-black, (2) tipografia Manrope ativa, (3) primitivas com geometria pill/circular e verde apenas em CTAs, (4) skeletons substituindo qualquer spinner remanescente.

### Implementação para US1

- [ ] T010 [P] [US1] Criar `src/components/ui/Icon/Icon.tsx` (wrapper de `lucide-react` com defaults `size={20}`, `aria-hidden={true}`) e teste `Icon.test.tsx`
- [ ] T011 [P] [US1] Criar `src/components/ui/Skeleton/SkeletonBox.tsx`, `SkeletonText.tsx`, `SkeletonCircle.tsx` (wrappers de `react-loading-skeleton` padronizando tamanhos/raios) e os testes correspondentes co-localizados
- [ ] T012 [P] [US1] Reescrever `src/components/ui/Button/Button.tsx` com variantes (`primary`, `secondary`, `outline`, `ghost`), shapes (`pill`, `pill-lg`, `circle`), `uppercase` default, suporte a `loading` (que troca conteúdo por SkeletonText, jamais spinner) e atualizar `Button.test.tsx` removendo asserções em classes Bootstrap e cobrindo todas as variantes + `aria-busy`
- [ ] T013 [P] [US1] Reescrever `src/components/ui/FormField/FormField.tsx` com input pill, `shadow-mg-inset`, suporte a `error` com `border-mg-text-negative` e mensagem em `text-mg-text-negative`; atualizar `FormField.test.tsx`
- [ ] T014 [P] [US1] Reescrever `src/components/ui/Toast/Toast.tsx` (paleta escura, sem Bootstrap; mantém API atual) e atualizar `Toast.test.tsx`
- [ ] T015 [P] [US1] Reescrever `src/components/ui/ErrorAlert/ErrorAlert.tsx` usando `text-mg-text-negative` e estrutura do DESIGN.md; atualizar `ErrorAlert.test.tsx`
- [ ] T016 [US1] Reescrever `src/components/ui/ConfirmModal/ConfirmModal.tsx` em cima de `@radix-ui/react-dialog` com `shadow-mg-dialog`, props conforme `data-model.md` §2 (`destructive`, `isLoading`), `aria-*` herdados do Radix; atualizar `ConfirmModal.test.tsx` (depende de T010, T012)
- [ ] T017 [US1] Criar `src/components/ui/EmptyState/EmptyState.tsx` com props conforme `data-model.md` §2 (`variant`, `icon`, `title`, `description`, `cta`) e teste `EmptyState.test.tsx` cobrindo `variant='default'`, `variant='error'`, sem CTA e CTA como link (depende de T010, T012)

**Checkpoint**: ao final desta fase, todas as primitivas visuais novas estão prontas, testadas e exportadas; as histórias seguintes apenas consomem.

---

## Fase 4: História de Usuário 2 — Navegação Estilo Aplicativo (Prioridade: P2)

**Objetivo**: substituir o chassi AdminLTE pela `AppShell` + `BottomTabBar` (Grupos + Perfil), remover a rota `/dashboard` por completo.

**Teste independente**: logar e verificar (1) ausência de sidebar/header AdminLTE, (2) bottom tab bar persistente com Grupos e Perfil somente, (3) URL `/dashboard` retorna 404 do Next, (4) layout app-like em 320px e em desktop.

### Implementação para US2

- [ ] T018 [P] [US2] Criar `src/components/ui/BottomTabBar/BottomTabBar.tsx` (nav fixo bottom com tabs Grupos e Perfil, `aria-current="page"` no ativo via `usePathname`, padding-bottom com `env(safe-area-inset-bottom)`) e teste `BottomTabBar.test.tsx`
- [ ] T019 [US2] Criar `src/components/ui/AppShell/AppShell.tsx` (container `min-h-dvh bg-mg-bg`, conteúdo centralizado em `max-w-app mx-auto`, padding-bottom suficiente para a tab bar) com `SkeletonProvider` aninhado; teste `AppShell.test.tsx` (depende de T009, T018)
- [ ] T020 [US2] Reescrever `src/app/(protected)/layout.tsx` substituindo `AdminLTELayout` por `<AppShell>` envolvendo children
- [ ] T021 [US2] Remover `src/app/(protected)/AdminLTELayout.test.tsx` (componente eliminado)
- [ ] T022 [US2] Remover por completo `src/app/(protected)/dashboard/` (pasta inteira) e auditar via `grep -rn "/dashboard" src/` que nenhum link interno aponta mais para essa rota (FR-005)

**Checkpoint**: usuário autenticado cai em `/groups` e navega com bottom tab bar; nenhum vestígio do dashboard remanesce.

---

## Fase 5: História de Usuário 3 — Áreas Públicas Redesenhadas (Prioridade: P3)

**Objetivo**: migrar landing, login e cadastro para Tailwind + primitivas novas, preservando fluxo de auto-login após cadastro e `returnUrl` no login.

**Teste independente**: deslogar e percorrer `/`, `/login`, `/register` validando novo visual e fluxos atuais sem regressão.

### Implementação para US3

- [ ] T023 [P] [US3] Refazer `src/components/landing/HeroSection.tsx` em Tailwind (sem gradiente roxo / glassmorphism), CTAs como `<Button variant="primary" shape="pill-lg" />`; atualizar `HeroSection.test.tsx`
- [ ] T024 [P] [US3] Refazer `src/components/login/LoginForm.tsx` com `<FormField>` e `<Button>` novos, mantendo lógica de `returnUrl`; atualizar `LoginForm.test.tsx`
- [ ] T025 [P] [US3] Refazer `src/components/register/RegisterForm.tsx` com primitivas novas mantendo fluxo de auto-login pós-cadastro; atualizar `RegisterForm.test.tsx`
- [ ] T026 [US3] Modificar `src/app/(public)/page.tsx` (landing) consumindo HeroSection refeita e atualizar `page.test.tsx`
- [ ] T027 [US3] Modificar `src/app/(public)/login/page.tsx` e `page.test.tsx` consumindo LoginForm refeita (com SkeletonProvider local se necessário)
- [ ] T028 [US3] Modificar `src/app/(public)/register/page.tsx` e `page.test.tsx` consumindo RegisterForm refeita

**Checkpoint**: funil público inteiro vive na nova identidade; fluxos de auth preservados.

---

## Fase 6: História de Usuário 4 — Lista, Detalhe e Ações de Grupos (Prioridade: P4)

**Objetivo**: migrar toda superfície de grupos (lista, filtros, cartões, criação, detalhe, lista de membros com bottom sheet, convite, sorteio) para o novo padrão; converter modais legados em rotas (criar/convite) e bottom sheet (detalhes de membro) conforme FR-023.

**Teste independente**: percorrer todos os fluxos de grupos como usuário autenticado e validar visual + preservação funcional.

### Implementação para US4

- [ ] T029 [US4] Criar `src/components/ui/BottomSheet/BottomSheet.tsx` em cima de `@radix-ui/react-dialog` (slide bottom-up, `shadow-mg-dialog`, props conforme `data-model.md` §2) e teste `BottomSheet.test.tsx`
- [ ] T030 [P] [US4] Refazer `src/components/groups/GroupCard/GroupCard.tsx` em Tailwind (cartão `bg-mg-surface`, `rounded-card`, sombra `shadow-mg-card` em hover, contagem de membros e badge de propriedade preservados) e atualizar `GroupCard.test.tsx`
- [ ] T031 [P] [US4] Refazer `src/components/groups/GroupStatusBadge/GroupStatusBadge.tsx` como pill compacto e atualizar teste
- [ ] T032 [P] [US4] Refazer `src/components/groups/GroupFilters/GroupFilters.tsx` (input search pill, multiselect de status como chips/pills, sort toggle) preservando debounce; atualizar `GroupFilters.test.tsx`
- [ ] T033 [P] [US4] Refazer `src/components/groups/GroupEmptyState/GroupEmptyState.tsx` reusando `<EmptyState />` (ou removendo o wrapper se redundante após a primitiva) e atualizar teste
- [ ] T034 [US4] Refazer `src/components/groups/GroupList/GroupList.tsx` consumindo SkeletonCard durante carregamento (com `useDelayedFlag(loading, 150)`), `<EmptyState />` para vazios e `<EmptyState variant="error" />` para falhas (com botão "Tentar novamente"); atualizar `GroupList.test.tsx` (depende de T030, T031, T032, T033)
- [ ] T035 [US4] Extrair formulário do `CreateGroupModal` para `src/components/groups/CreateGroupForm/CreateGroupForm.tsx` puro (sem modal) e criar teste `CreateGroupForm.test.tsx`
- [ ] T036 [US4] Criar nova rota `src/app/(protected)/groups/new/page.tsx` consumindo `CreateGroupForm` e teste `page.test.tsx`; substituir todas as aberturas do modal por navegação para `/groups/new` (depende de T035)
- [ ] T037 [US4] Remover `src/components/groups/CreateGroupModal/` por completo após auditoria de que nenhum import remanesce
- [ ] T038 [P] [US4] Refazer `src/components/groups/DrawButton/DrawButton.tsx` como botão circular ou pill grande conforme DESIGN.md, com `ConfirmModal` mantido para confirmação; atualizar `DrawButton.test.tsx`
- [ ] T039 [P] [US4] Refazer `src/components/groups/GroupActions/GroupActions.tsx` em Tailwind preservando comportamento; atualizar teste
- [ ] T040 [P] [US4] Refazer `src/components/groups/ResultReveal/ResultReveal.tsx` em Tailwind; atualizar teste
- [ ] T041 [US4] Refazer `src/components/groups/MemberProfileModal/` substituindo modal por `<BottomSheet>` em `src/components/groups/MemberProfileSheet/MemberProfileSheet.tsx`; atualizar teste cobrindo abertura via clique e fechamento por ESC/backdrop (depende de T029)
- [ ] T042 [US4] Refazer `src/components/groups/MemberList/MemberList.tsx` para abrir o `MemberProfileSheet` ao clicar em um membro (em vez do modal antigo); atualizar `MemberList.test.tsx` (depende de T041)
- [ ] T043 [US4] Refatorar `src/components/groups/InviteSection/InviteSection.tsx` para navegar para a nova rota `/groups/[id]/invite` em vez de abrir overlay/modal; atualizar `InviteSection.test.tsx`
- [ ] T044 [US4] Criar nova rota `src/app/(protected)/groups/[id]/invite/page.tsx` com formulário de convite e fluxo completo preservado; teste `page.test.tsx`
- [ ] T045 [US4] Modificar `src/app/(protected)/groups/page.tsx` (lista) e `page.test.tsx` consumindo `GroupList` + `GroupFilters` refeitos
- [ ] T046 [US4] Modificar `src/app/(protected)/groups/[id]/page.tsx` (detalhe) e `page.test.tsx` consumindo componentes refeitos (cartão, ações, lista de membros via sheet, sorteio)

**Checkpoint**: lista, detalhe, criação, convite, lista de membros, sheet de detalhes e sorteio operam no novo padrão; nenhum modal não-confirmatório remanesce.

---

## Fase 7: História de Usuário 5 — Perfil e Convite (Prioridade: P5)

**Objetivo**: migrar página de perfil (com botão "Sair") e fluxo público de convite (`/invite/[token]`).

**Teste independente**: abrir `/profile` autenticado e validar dados + botão Sair; abrir uma URL de convite válida deslogado e logado e validar fluxos preservados.

### Implementação para US5

- [ ] T047 [P] [US5] Refazer `src/components/profile/ProfileCard/ProfileCard.tsx` em Tailwind exibindo nome, sobrenome, e-mail, data de criação; atualizar `ProfileCard.test.tsx`
- [ ] T048 [P] [US5] Criar `src/components/profile/LogoutButton/LogoutButton.tsx` (Button outline, chama `clearToken()` e redireciona) e teste `LogoutButton.test.tsx`
- [ ] T049 [US5] Modificar `src/app/(protected)/profile/page.tsx` e `page.test.tsx` consumindo `ProfileCard` + `LogoutButton` (depende de T047, T048)
- [ ] T050 [P] [US5] Refazer `src/components/invite/InviteJoinCard/InviteJoinCard.tsx` em Tailwind preservando fluxo de aceite com login obrigatório e `returnUrl`; atualizar teste
- [ ] T051 [US5] Modificar `src/app/invite/[token]/page.tsx` e `page.test.tsx` consumindo `InviteJoinCard` refeito

**Checkpoint**: toda a área autenticada e o ponto de entrada do convite operam na nova identidade.

---

## Fase 8: História de Usuário 6 — Governança Atualizada (Prioridade: P6)

**Objetivo**: atualizar constituição (v1.2.0 → v2.0.0), CLAUDE.md, DESIGN.md, MEMORY.md e remover dependências legadas do `package.json` definitivamente.

**Teste independente**: ler cada arquivo de governança atualizado e confirmar ausência de menções a Bootstrap/AdminLTE como base ativa; política de pt-BR explícita; rodar `npm ls bootstrap admin-lte jquery popper.js` e ver "(empty)".

### Implementação para US6

- [ ] T052 [P] [US6] Atualizar `.specify/memory/constitution.md`: bump para v2.0.0; reescrever Princípio III removendo Bootstrap/AdminLTE como base e referenciando `DESIGN.md` + Tailwind; reescrever seção "Frontend Standards" e "Style Guide" para refletir Tailwind + DESIGN.md; adicionar regra explícita de idioma pt-BR para todos artefatos speckit; atualizar SYNC IMPACT REPORT; atualizar campos `Ratified` (mantém) e `Last Amended` (2026-06-17)
- [ ] T053 [P] [US6] Atualizar `CLAUDE.md` na raiz para refletir: stack (Tailwind), remoção de Bootstrap/AdminLTE, navegação AppShell + BottomTabBar, primitivas em `components/ui/`, política pt-BR para specs e remover trechos obsoletos do style guide antigo
- [ ] T054 [P] [US6] Atualizar `DESIGN.md` na raiz registrando Manrope + Noto Sans como pilha oficial em substituição a SpotifyMixUI/CircularSp, mantendo demais regras intactas
- [ ] T055 [P] [US6] Atualizar `/Users/waliqueiroz/.claude/projects/-Users-waliqueiroz-Documents-projetos-mystery-gifter-fe/memory/MEMORY.md` (e arquivos de memória apontados por ele) removendo referências a Bootstrap/AdminLTE e à política de inglês para specs; refletir nova stack e política pt-BR
- [ ] T056 [US6] Remover de `package.json` as dependências `bootstrap`, `admin-lte`, `jquery`, `popper.js`, `@fortawesome/fontawesome-free` e `@types/jquery`; rodar `npm install` para reconciliar lockfile; auditar via `grep -rnE "bootstrap|admin-lte|jquery|popper|fortawesome" src/` para garantir 0 imports remanescentes (depende de T020, T026, T028, T045, T046, T049, T051)
- [ ] T057 [US6] Remover `src/app/theme.css` (substituído por `tailwind.config.ts` + `globals.css`); auditar via `grep -rn "theme.css" src/` que nenhum import remanesce

**Checkpoint**: governança totalmente alinhada ao código entregue; constituição reflete o novo estado.

---

## Fase 9: Polimento & Verificações Transversais

**Objetivo**: validar critérios de sucesso, executar gates de qualidade e amarrar pontas soltas.

- [ ] T058 [P] Rodar `npm run build` e validar SC-002 (0 referências a Bootstrap/AdminLTE em assets do build) via `grep -ri "bootstrap\|admin-lte\|jquery" .next/static` (esperado vazio)
- [ ] T059 [P] Rodar `npm test -- --coverage` e validar SC-003 (todos os testes passam, cobertura ≥ 80%)
- [ ] T060 [P] Auditar SC-004 e SC-008: `grep -RnE '#[0-9a-fA-F]{3,6}' src/ --include='*.tsx' --include='*.ts'` deve ficar restrito a arquivos de configuração/tema; `grep -RnE 'rounded(?!-pill|-card|-full)' src/components` deve retornar vazio
- [ ] T061 [P] Auditar SC-011 e SC-012: `grep -RinE 'spinner|loading-icon|fa-spin' src/` (esperado vazio) e auditoria manual de imports — apenas `ConfirmModal` é importado de `components/ui/` como overlay
- [ ] T062 Validar SC-005 e SC-006 manualmente seguindo `quickstart.md` (320px sem scroll horizontal nos fluxos críticos; contraste ≥ 4.5:1 verificado via axe/DevTools em telas representativas)
- [ ] T063 Rodar `npm run lint` e `npm run type-check`; corrigir warnings remanescentes
- [ ] T064 Validar end-to-end `quickstart.md` (todos os roteiros de teste manual por história executados sem regressão)

---

## Dependências & Ordem de Execução

### Dependências entre fases

- **Fase 1 (Setup)**: sem dependências — pode começar imediatamente.
- **Fase 2 (Fundação)**: depende da Fase 1 (Tailwind e provider de skeleton instalados).
- **Fase 3 (US1)**: depende da Fase 2 — bloqueia as Fases 4–7 porque elas consomem as primitivas.
- **Fase 4 (US2)**: depende da Fase 3 — bloqueia as Fases 5–7 porque elas consomem `<AppShell>`.
- **Fases 5 (US3), 6 (US4), 7 (US5)**: dependem das Fases 3 e 4. PODEM rodar em paralelo entre si (sem sobreposição de arquivos).
- **Fase 8 (US6)**: depende de TODAS as fases anteriores (não há como remover Bootstrap/AdminLTE do `package.json` antes que nenhum import as referencie).
- **Fase 9 (Polimento)**: depende da Fase 8.

### Dependências entre histórias

- US1 (P1) → bloqueia US2, US3, US4, US5
- US2 (P2) → bloqueia US3, US4, US5 (depende do AppShell)
- US3 (P3), US4 (P4), US5 (P5) → independentes entre si após US1+US2
- US6 (P6) → bloqueada por US1–US5

### Dentro de cada história

- Componentes refeitos antes das páginas que os consomem
- Páginas antes da auditoria final de governança (US6)
- Tasks marcadas `[P]` dentro da mesma fase podem rodar em paralelo (arquivos disjuntos)

---

## Exemplo de Paralelização — US1

```bash
# Após T009 concluir, lançar em paralelo:
Task: "T010 — Icon e Icon.test"
Task: "T011 — Skeleton wrappers"
Task: "T012 — Button reescrito + testes"
Task: "T013 — FormField reescrito + testes"
Task: "T014 — Toast reescrito + testes"
Task: "T015 — ErrorAlert reescrito + testes"

# Depois (sequencial porque consomem Icon/Button):
Task: "T016 — ConfirmModal"
Task: "T017 — EmptyState"
```

---

## Estratégia de Implementação

### MVP (US1 + US2)

1. Fase 1 (Setup) + Fase 2 (Fundação).
2. Fase 3 (US1) → primitivas prontas.
3. Fase 4 (US2) → app shell + bottom tab bar.
4. **PARAR E VALIDAR**: produto ainda usa páginas legadas internamente, mas chassi e primitivas já são as novas.

### Entrega Incremental por História

1. Mergear Fase 3 e Fase 4 → chassi novo.
2. Mergear Fase 5 (US3) → funil público modernizado.
3. Mergear Fase 6 (US4) → fluxo principal modernizado.
4. Mergear Fase 7 (US5) → áreas restantes modernizadas.
5. Mergear Fase 8 (US6) → governança alinhada e legado removido.
6. Mergear Fase 9 → polimento final antes do PR `feature/005-mobile-ui-redesign → develop`.

### Branches Stacked (workflow obrigatório do projeto)

- Branch base da feature: `feature/005-mobile-ui-redesign`.
- Cada `[P]` ou task individual vira `task/005-T###-descricao` empilhada em `feature/005-mobile-ui-redesign` (ou em outra task se houver dependência direta).
- Cada PR de task targets sua parent branch.

---

## Notas

- `[P]` = arquivos diferentes, sem dependências pendentes.
- `[Story]` = traceability para uma história de usuário.
- Cada componente novo OBRIGATORIAMENTE leva seu teste co-localizado (Princípio II).
- Tests de regressão (Princípio II) DEVEM falhar antes da implementação correspondente.
- Commit após cada task ou agrupamento lógico; PR pequeno (200–400 LOC alvo).
- Após cada checkpoint, validar a história isoladamente antes de avançar.
- Evitar: tasks vagas, conflitos no mesmo arquivo entre tasks `[P]`, dependências cruzadas entre histórias que quebrem independência.
