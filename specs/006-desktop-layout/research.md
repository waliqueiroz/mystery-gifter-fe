# Pesquisa: Layout Responsivo Desktop (006)

**Branch**: `006-desktop-layout` | **Data**: 2026-06-21

---

## 1. Padrão Sidebar + Bottom Bar (Navegação Dualizada)

**Decisão**: Sidebar fixa à esquerda em ≥896px; bottom tab bar em <896px.

**Justificativa**: Padrão consolidado em toda a indústria de aplicativos web — Spotify, Discord, Slack, YouTube, Linear, Figma, Notion. A dualização (sidebar no desktop, bottom bar no mobile) é o padrão mais reconhecido para apps que precisam de navegação global em ambos os formatos. A implementação é 100% CSS via breakpoints Tailwind (`hidden desk:flex` / `desk:hidden`), sem JavaScript para detecção de viewport — evita flash de conteúdo incorreto e funciona com SSR.

**Alternativas consideradas**:
- **Mesmo layout mobile no desktop, só centralizado** — descartado: criar a feature 006 só para centralizar o conteúdo mobile seria insuficiente e não resolve a experiência desktop.
- **Sidebar com colapso/toggle** — descartado para v1: adiciona complexidade de estado (JS, animação, persistência de preferência) sem benefício imediato. Pode ser feature futura.
- **Navigation Rail (ícones sem texto)** — descartado: app tem apenas 2 itens de nav; rail seria vazio e sem valor de scanning.

---

## 2. Breakpoint de Transição

**Decisão**: `896px` ("Desktop Small" do DESIGN.md §8) — novo token custom `desk` adicionado ao `tailwind.config.ts`.

**Justificativa**: O DESIGN.md §8 define explicitamente que "Sidebar visível" começa em Desktop Small (896–1024px). Um token custom (`desk: '896px'`) no tailwind.config.ts mantém fidelidade ao design system sem depender de breakpoints padrão do Tailwind que não cobrem 896px.

**Alternativas consideradas**:
- **Usar `lg:` (1024px)** — mais padrão no ecossistema Tailwind, mas diverge do DESIGN.md §8, deixando uma faixa de 896–1024px sem a melhoria desktop.
- **Usar `md:` (768px)** — muito cedo; tablets em orientação portrait veriam a sidebar, o que pode ser confuso.

---

## 3. Largura da Sidebar

**Decisão**: `220px` fixo — novo token `sidebar` em `tailwind.config.ts` (`width.sidebar`).

**Justificativa**: Compacto, adequado para 2 itens de nav + identidade da aplicação. Spotify usa ~240px, Slack ~260px. Em 220px, mesmo em Desktop Small (896px), a área de conteúdo ainda tem 676px disponíveis — espaço suficiente para a grade de grupos. Valor adicionado como token para evitar hardcode e permitir ajuste futuro.

**Alternativas consideradas**:
- **240px** — cabível, mas desnecessariamente largo para apenas 2 itens.
- **Largura dinâmica** — descartado para v1: sem colapso, largura fixa é a solução mais simples.

---

## 4. Layout do Conteúdo Principal no Desktop

**Decisão**: No desktop, `AppShell` passa a ser `flex flex-row`. O `<main>` ocupa toda a largura restante (sem `max-w-app` global). Cada tipo de página gerencia sua própria restrição de largura de conteúdo via token `max-w-content` (640px) quando necessário (formulários, detalhe).

**Justificativa**: O atual `max-w-app: 480px` foi projetado para manter a estética app-like em desktop ao custo de desperdiçar espaço horizontal. A feature 006 muda deliberadamente essa decisão: a sidebar ocupa 220px e o restante é espaço útil. A grade de grupos precisa do espaço inteiro para exibir múltiplas colunas. Formulários e páginas de detalhe adicionam seu próprio `max-w-content` para legibilidade (clarificação Q4: coluna única centralizada).

**Token novo**: `max-w-content: '640px'` em `tailwind.config.ts` — faixas mais largas que `max-w-app` mas controladas, para formulários e páginas de detalhe no desktop.

**Alternativas consideradas**:
- **Manter `max-w-app` e só adicionar sidebar** — descartado: conteúdo ficaria em uma faixa de 480px no centro de um espaço de 676px+ — desperdício evidente.
- **Sem `max-w-content` — deixar tudo expandir** — descartado: formulários sem max-width em telas >1200px ficam muito largos e ilegíveis.

---

## 5. Grade de Cartões de Grupo

**Decisão**: CSS Grid nativo via Tailwind — `grid grid-cols-1 desk:grid-cols-2 xl:grid-cols-3`. Aplicado tanto no container de cartões quanto no container de skeletons.

**Justificativa**: CSS Grid é a ferramenta certa para grids multi-coluna responsivos. Tailwind tem suporte completo e idiomático (`grid-cols-*`). O padrão `1 → 2 → 3 colunas` segue a estratégia de colapso do DESIGN.md §8 e é idêntico ao que Spotify e Netflix usam para grids de cards.

**Alternativas consideradas**:
- **Flexbox com `flex-wrap`** — funciona, mas o controle de colunas fixas é menos idiomático e exige cálculos de width nos filhos.
- **CSS Columns** — não adequado para cards interativos (ordem de leitura fica vertical em vez de horizontal).

---

## 6. Identidade na Sidebar

**Decisão**: Ícone `Gift` (lucide-react) + texto "Mystery Gifter" na área superior da sidebar. (Clarificação Q1: Opção B selecionada.)

**Justificativa**: Padrão ícone + nome é o mais reconhecível para sidebar headers. Usa recursos já disponíveis (lucide-react, tipografia Manrope) sem depender de arquivo de logo externo. Alinhado ao espírito do produto.

---

## 7. Layout das Páginas Públicas (Login/Cadastro/Convite)

**Decisão**: Formulário centralizado com `max-w-content mx-auto` em telas desktop — sem layout de duas colunas ou arte lateral. (Clarificação Q2: Opção A selecionada.)

**Justificativa**: Padrão universal de auth pages modernas (Vercel, Linear, Figma, Notion). Foco no formulário, mínimo esforço, zero novos assets. Consistente com a filosofia de densidade do DESIGN.md.

---

## 8. Posicionamento do Botão "Sair"

**Decisão**: "Sair" permanece exclusivamente na página de Perfil. (Clarificação Q3: Opção A selecionada.)

**Justificativa**: Decisão já fundamentada no design system (evitar logout acidental). Em desktop, com a sidebar sempre visível, um botão de logout permanente seria ainda mais arriscado. Consistência com a política estabelecida na feature 005.

---

## 9. Layout da Página de Detalhe do Grupo

**Decisão**: Coluna única centralizada com `max-w-content` no desktop — mesma hierarquia vertical do mobile, mais espaço. (Clarificação Q4: Opção A selecionada.)

**Justificativa**: A hierarquia de conteúdo do detalhe (nome → convite → membros → ações → sortear → resultado) é clara e linear. Uma grade de duas colunas exigiria decisões complexas sobre o que vai em cada lado e poderia quebrar fluxos de leitura. Menor risco de regressão.

---

## 10. Violação Constitucional — Emenda Necessária

**Situação**: A constituição v2.0.0 contém dois pontos em conflito com a feature 006:
- **Princípio III**: "em desktop o conteúdo permanece centralizado dentro de `max-w-app`, não expande como painel"
- **Guia de Estilo / Regras invioláveis**: "Navegação app-like: bottom tab bar persistente em **todas as larguras**"

**Resolução**: O DESIGN.md é a autoridade final sobre conflitos (Princípio III da própria constituição). O DESIGN.md §8 já define a estratégia desktop com sidebar e grid expandido — portanto, as regras da constituição foram escritas antes do planejamento desktop e precisam ser atualizadas.

**Ação**: A Fase 7 do plano inclui uma emenda à constituição v2.0.0 → v2.1.0, atualizando Princípio III e as regras de navegação para refletir o design responsivo implementado. A violação é documentada no Complexity Tracking do `plan.md`.

---

## 11. Componentes Existentes que NÃO Precisam de Mudança

- `ConfirmModal`, `BottomSheet`, `Button`, `FormField`, `EmptyState`, `Toast`, `ErrorAlert`, `Icon`, `Skeleton*` — sem alterações.
- Services e contextos — sem alterações (feature é puramente de layout).
- Auth guards (AuthGuard, GuestGuard) — sem alterações.
- `UserContext` — sem alterações.
