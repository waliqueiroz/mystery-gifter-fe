# Plano de Implementação: Redesenho Mobile-first com Design System Inspirado no Spotify

**Branch**: `005-mobile-ui-redesign` | **Data**: 2026-06-17 | **Spec**: [spec.md](spec.md)
**Entrada**: Especificação em `specs/005-mobile-ui-redesign/spec.md`

## Sumário

Refatorar toda a UI do produto para sair de Bootstrap 4.6 + AdminLTE 3.2 e adotar **Tailwind CSS** como framework de estilos, com tema customizado refletindo estritamente o `DESIGN.md` (paleta near-black, verde Spotify, pill/circular, Manrope + Noto Sans via `next/font/google`). O conceito de painel administrativo é eliminado: a área autenticada vive em um **AppShell** com **bottom tab bar persistente** em todas as larguras (somente Grupos e Perfil; Sair fica dentro de Perfil). Modais ficam restritos a confirmações destrutivas — fluxos de criação/edição/convite migram para **rotas dedicadas** e visualizações rápidas read-only para **bottom sheets**. Todos os estados de carregamento passam a ser **skeletons** baseados em [`react-loading-skeleton`](https://www.npmjs.com/package/react-loading-skeleton). A rota `/dashboard` é removida por completo. Constituição (v1.2.0 → v2.0.0), `CLAUDE.md`, `DESIGN.md`, `MEMORY.md` e dependências do `package.json` são atualizados em paralelo dentro da própria feature (História P6).

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5+, Node.js LTS  
**Dependências Primárias**:
- **Adicionar**: `tailwindcss` ^3.4 (+ `@tailwindcss/forms`, `@tailwindcss/typography` se necessário), `postcss`, `autoprefixer`, `tailwind-merge`, `clsx`, `react-loading-skeleton`, fontes Manrope + Noto Sans via `next/font/google` (sem nova dependência npm — embutido no Next)
- **Remover**: `bootstrap`, `admin-lte`, `jquery`, `popper.js`, `@fortawesome/fontawesome-free` (substituído por `lucide-react` para ícones, decidido em Phase 0)
- **Manter**: Next.js 15.5.4 (App Router), React 19, Jest + RTL + ts-jest

**Storage**: N/A — mudança puramente visual; nenhum contrato de API é alterado; estado de UI (filtros, sheet aberta) permanece em React state; sessão segue em `localStorage` via `lib/session.ts`  
**Testes**: Jest + jest-environment-jsdom + RTL + ts-jest — cobertura mínima 80% mantida; novos componentes (AppShell, BottomTabBar, EmptyState, Sheet, SkeletonBox) recebem testes co-localizados  
**Plataforma-alvo**: Web (mobile-first 320px–desktop), navegadores modernos (Chrome/Safari/Firefox últimas duas versões)  
**Tipo de Projeto**: Aplicação web — Next.js App Router frontend consumindo REST  
**Metas de Performance**: LCP ≤ 2.5 s desktop / ≤ 4.0 s mobile 3G; CLS ≤ 0.1; INP ≤ 200 ms; bundle inicial 15–25 % menor sem Bootstrap+AdminLTE+jQuery (estimativa Phase 0)  
**Restrições**:
- Modo escuro obrigatório, sem light mode
- Verde `#1ed760` exclusivamente em controles funcionais
- Geometria pill (500–9999px) ou circular (50%) — sem botões retangulares
- Tokens visuais centralizados em `tailwind.config.ts` (theme.extend) — nenhum hex/rgb hardcoded em componentes
- Sem CDN externo de fontes (`next/font/google` self-hospeda)
- Sem spinners em qualquer fluxo — somente skeletons via `react-loading-skeleton`
- Sem modais não-confirmatórios

**Escala/Escopo**: 6 histórias de usuário; ~25 telas/componentes a migrar; ~15 arquivos novos (AppShell, BottomTabBar, primitivas UI, página de criação como rota), ~30 arquivos modificados, ~8 arquivos removidos (AdminLTELayout, `theme.css`, dashboard route, ConfirmModal não substituído mas reestilizado).

## Constitution Check

*GATE: deve passar antes da Phase 0 e ser reavaliado após Phase 1.*

A constituição vigente é **v1.2.0**, ratificada em 2026-03-08. Esta feature contém violações deliberadas que serão reconciliadas pela própria feature através da História de Usuário P6 (atualização da constituição para **v2.0.0** — MAJOR por redefinição backward-incompatible de princípios existentes).

| Princípio | Status | Notas |
|-----------|--------|-------|
| **I — Code Quality** | ✅ Pass | TS estrito; sem `any`; componentes pequenos; tokens em config central; ESLint + Prettier mantidos |
| **II — Testes Unitários (NN)** | ✅ Pass | Todos componentes novos/refatorados terão testes co-localizados; cobertura ≥ 80 % mantida; testes existentes precisam passar como atestado de preservação funcional (SC-003) |
| **III — Consistência de UX** | ⚠️ **Justified** | A constituição atual exige Bootstrap 4 + AdminLTE 3.2 como base e `src/app/theme.css` como ponto de extensão. Esta feature substitui ambos por Tailwind + `DESIGN.md`. Tratado em Complexity Tracking; atualização constitucional é História P6. |
| **IV — Performance** | ✅ Pass | Remoção de Bootstrap CSS, AdminLTE CSS/JS, jQuery e popper.js reduz bundle inicial; Tailwind purga classes não-usadas no build; `next/font/google` evita FOUT e shift de layout; skeletons reservam espaço final do conteúdo melhorando CLS |
| **V — Padrões Next.js** | ✅ Pass | App Router mantido; Server Components default; `"use client"` apenas onde necessário (AppShell, BottomTabBar, formulários, sheets); rotas dedicadas (vs modais) reforçam o padrão "URL = estado" |

**Violação principal reconhecida (Princípio III)**: a constituição v1.2.0 declara textualmente:
> "Bootstrap 4 variables and AdminLTE 3.2 theme variables MUST be used as the base design system"
> "Tailwind CSS MUST NOT be used — it conflicts with Bootstrap 4's reset and AdminLTE's CSS."

A premissa que sustentava essas regras (compatibilidade com Bootstrap 4) deixa de existir nesta feature. A entrada do usuário no `/speckit.plan` autoriza explicitamente a adoção de Tailwind e a atualização da constituição. A reconciliação acontece via PR de governança (parte da P6), elevando a constituição a v2.0.0. **A feature NÃO pode ser merged em `develop` enquanto P6 não estiver concluída**, pois isso deixaria código violando a constituição vigente — esta dependência está refletida na ordem de execução (P1–P5 → P6 último).

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/005-mobile-ui-redesign/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões técnicas e justificativas
├── data-model.md        # Phase 1 — tipos/contratos de UI (props públicas das primitivas)
├── quickstart.md        # Phase 1 — guia para rodar/testar a feature localmente
├── contracts/
│   └── ui-primitives.md # Phase 1 — contratos de uso dos componentes compartilhados
├── checklists/
│   └── requirements.md  # Já criado em /speckit.specify
└── tasks.md             # Phase 2 — gerado por /speckit.tasks (NÃO criado aqui)
```

### Código-fonte (raiz do repositório)

```text
# Configuração (raiz)
tailwind.config.ts                          # NOVO — theme.extend com tokens do DESIGN.md
postcss.config.mjs                          # NOVO — tailwindcss + autoprefixer
package.json                                # MOD — remover bootstrap/admin-lte/jquery/popper/fontawesome; adicionar tailwind/postcss/autoprefixer/react-loading-skeleton/tailwind-merge/clsx/lucide-react

CLAUDE.md                                   # MOD (P6) — refletir nova stack e política pt-BR
DESIGN.md                                   # MOD (P6) — registrar Manrope/Noto Sans como pilha oficial
.specify/memory/constitution.md             # MOD (P6) — bump para v2.0.0
.claude/projects/.../memory/MEMORY.md       # MOD (P6) — limpar referências a Bootstrap/AdminLTE/inglês

src/
├── app/
│   ├── globals.css                         # REWRITE — @tailwind base/components/utilities + CSS vars dos tokens + reset
│   ├── theme.css                           # REMOVE — substituído por tailwind.config.ts
│   ├── layout.tsx                          # MOD — carregar Manrope/Noto Sans via next/font/google, aplicar a <html>/<body>
│   ├── (public)/
│   │   ├── page.tsx                        # MOD — landing redesenhada (Tailwind)
│   │   ├── page.test.tsx                   # MOD
│   │   ├── login/
│   │   │   ├── page.tsx                    # MOD
│   │   │   └── page.test.tsx               # MOD
│   │   └── register/
│   │       ├── page.tsx                    # MOD
│   │       └── page.test.tsx               # MOD
│   ├── (protected)/
│   │   ├── layout.tsx                      # REWRITE — substituir AdminLTELayout por <AppShell>
│   │   ├── AdminLTELayout.test.tsx         # REMOVE
│   │   ├── dashboard/                      # REMOVE — pasta inteira eliminada
│   │   ├── groups/
│   │   │   ├── page.tsx                    # MOD — Tailwind, EmptyState, skeletons
│   │   │   ├── page.test.tsx               # MOD
│   │   │   ├── new/                        # NOVO — rota dedicada de criação
│   │   │   │   ├── page.tsx
│   │   │   │   └── page.test.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx                # MOD
│   │   │       ├── page.test.tsx           # MOD
│   │   │       ├── invite/                 # NOVO — rota dedicada do fluxo de convite
│   │   │       │   ├── page.tsx
│   │   │       │   └── page.test.tsx
│   │   │       └── members/[memberId]/     # OPCIONAL — fallback de rota se o sheet for deep-linkado
│   │   │           ├── page.tsx
│   │   │           └── page.test.tsx
│   │   └── profile/
│   │       ├── page.tsx                    # MOD — inclui botão "Sair"
│   │       └── page.test.tsx               # MOD
│   └── invite/                             # MOD — visual app-like (já fora do (protected))
│       ├── [token]/page.tsx                # MOD
│       └── [token]/page.test.tsx           # MOD
├── components/
│   ├── ui/                                 # PRIMITIVAS — todos com testes
│   │   ├── Button/                         # REWRITE — variantes pill/outlined/circular
│   │   ├── FormField/                      # REWRITE — input pill com inset shadow do DESIGN.md
│   │   ├── ConfirmModal/                   # MOD — único modal permitido, reestilizado
│   │   ├── Toast/                          # MOD — reestilizado, sem Bootstrap
│   │   ├── ErrorAlert/                     # MOD — usa `--text-negative` do DESIGN.md
│   │   ├── AppShell/                       # NOVO — chassi com bottom tab bar + safe area
│   │   │   ├── AppShell.tsx
│   │   │   └── AppShell.test.tsx
│   │   ├── BottomTabBar/                   # NOVO — Grupos + Perfil, estado ativo verde
│   │   │   ├── BottomTabBar.tsx
│   │   │   └── BottomTabBar.test.tsx
│   │   ├── EmptyState/                     # NOVO — ícone + mensagem + CTA contextual (FR-025)
│   │   │   ├── EmptyState.tsx
│   │   │   └── EmptyState.test.tsx
│   │   ├── BottomSheet/                    # NOVO — visualização rápida read-only
│   │   │   ├── BottomSheet.tsx
│   │   │   └── BottomSheet.test.tsx
│   │   ├── Skeleton/                       # NOVO — wrapper de react-loading-skeleton + SkeletonTheme provider
│   │   │   ├── Skeleton.tsx
│   │   │   ├── SkeletonProvider.tsx
│   │   │   └── Skeleton.test.tsx
│   │   └── Icon/                           # NOVO — wrapper de lucide-react para padronizar size/cor
│   │       ├── Icon.tsx
│   │       └── Icon.test.tsx
│   ├── landing/                            # MOD — refazer com Tailwind, remover glassmorphism roxo
│   ├── login/                              # MOD
│   ├── register/                           # MOD
│   ├── groups/                             # MOD — GroupCard, GroupFilters, GroupList, CreateGroupForm (extraído do modal)
│   ├── invite/                             # MOD — InviteSection, InviteJoinCard
│   ├── profile/                            # MOD — ProfileCard + LogoutButton
│   └── dashboard/                          # REMOVE — pasta inteira
├── lib/
│   ├── cn.ts                               # NOVO — utilitário cn(...inputs) com tailwind-merge + clsx
│   └── cn.test.ts                          # NOVO
└── types/                                  # SEM MUDANÇA — contratos de API intactos
```

**Decisão estrutural**: projeto Next.js App Router único. Tailwind substitui Bootstrap+AdminLTE como framework de estilos; tokens do `DESIGN.md` ficam em `tailwind.config.ts` (theme.extend). Ícones migram de `@fortawesome/fontawesome-free` para `lucide-react` (decisão em Phase 0: menor bundle, tree-shaking nativo, melhor combinação com Tailwind). Não há novos contratos de API.

## Complexity Tracking

| Violação | Por que é necessária | Alternativa mais simples rejeitada porque… |
|----------|----------------------|---------------------------------------------|
| Constituição v1.2.0 proíbe Tailwind explicitamente (Princípio III + Frontend Standards) | A decisão de adotar Tailwind veio da entrada do usuário no `/speckit.plan` e é uma consequência direta da remoção de Bootstrap+AdminLTE, premissa em que a proibição se sustentava. Tailwind alinha-se ao DESIGN.md (tokens customizáveis), reduz CSS hardcoded e suporta variantes responsivas mobile-first sem dependências legadas. | (a) Manter Bootstrap → conflita com a entrada do usuário e com a meta de eliminação total. (b) CSS puro com módulos → reinventaria roda; sem purge automático, mais código a manter. (c) CSS-in-JS (styled-components/emotion) → custo de runtime, conflita com Server Components do App Router. |
| Constituição v1.2.0 fixa Bootstrap 4 + AdminLTE 3.2 como base obrigatória | Mesma justificativa acima — feature inteira é a substituição desse fundamento. | N/A — alternativas equivalentes a "não fazer a feature". |
| Múltiplas rotas novas (`/groups/new`, `/groups/[id]/invite`, possíveis fallbacks de membros) | FR-023 exige rota dedicada como substituto de modal não-confirmatório para fluxos com formulário. Suporta back do navegador, deep-linking e testes simples. | Single-page com modal: viola a regra explícita FR-023. Bottom sheet com formulário: piora UX em telas pequenas para fluxos multi-passo e dificulta validação inline. |
| `lucide-react` como nova dependência | Substitui `@fortawesome/fontawesome-free` (que era injetado via AdminLTE) por uma lib de ícones React-first, tree-shakeable, leve, com paridade visual mínima ao Font Awesome. | (a) Manter Font Awesome via npm próprio → bundle grande, CSS adicional, sem tree-shaking nativo. (b) SVG inline próprio → custo de manutenção desproporcional para 20–30 ícones. |
| `tailwind-merge` + `clsx` como utilitários | Compor classes Tailwind condicionais (especialmente nas variantes de Button/Badge/EmptyState) sem conflitos de utilitárias é dor conhecida; estas libs são padrão de mercado e somam <5 KB gzip combinadas. | String concatenation manual → bugs sutis de override de utilitárias; sem tree-shaking; manutenção mais frágil. |

Cada violação acima é reconciliada pela própria feature (P6 atualiza constituição para v2.0.0 antes do merge final), preservando o princípio de "código sempre conforme à constituição vigente".

## Próximas Saídas

- **Phase 0** → `research.md` (decisões técnicas + alternativas avaliadas; resolve qualquer NEEDS CLARIFICATION restante)
- **Phase 1** → `data-model.md` (contratos de UI/props das primitivas), `contracts/ui-primitives.md`, `quickstart.md`, atualização do contexto do agente via `update-agent-context.sh`
- **Phase 2** → `tasks.md` é responsabilidade do `/speckit.tasks` (não é gerado aqui)
