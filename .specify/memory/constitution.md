<!--
RELATÓRIO DE IMPACTO DA SINCRONIZAÇÃO
=====================================
Mudança de versão: 1.2.0 → 2.0.0  (MAJOR — redefinição backward-incompatible)
Princípios modificados:
  - Princípio III (Consistência de UX): Bootstrap 4 + AdminLTE 3.2 são REMOVIDOS
    como base obrigatória; a base de design vigente passa a ser DESIGN.md +
    Tailwind CSS.
Seções modificadas:
  - Padrões de Frontend: reescrita para refletir a nova stack (Tailwind, sem
    Bootstrap/AdminLTE/jQuery; ícones via lucide-react; tokens via
    tailwind.config.ts).
  - Guia de Estilo: reescrita por completo — adota paleta near-black + verde
    Spotify, tipografia Manrope/Noto Sans via next/font/google, geometria pill/
    circular, regras de modais e skeletons.
  - Fluxo de Desenvolvimento: nova regra de idioma — TODOS os artefatos speckit
    (specs, checklists, planos, tasks) DEVEM ser redigidos em pt-BR a partir
    desta versão.
Seções adicionadas: N/A
Seções removidas:
  - Guia de Estilo §"Landing Page Hero" (mg-hero/mg-hero-title/mg-feature-card):
    removido — pertencia ao tema roxo de glassmorphism que foi descontinuado.
Templates atualizados:
  ✅ .specify/memory/constitution.md (este arquivo)
  ✅ plan-template.md — Constitution Check é genérico; sem mudança.
  ✅ tasks-template.md — sem mudança.
TODOs de acompanhamento:
  - Os scripts de speckit ainda só pré-resolvem `###-...` (sem prefixo
    Gitflow); decisão desta emenda é manter as branches de feature SEM o
    prefixo `feature/` (usar diretamente o nome da spec, ex.: `005-...`).
    A regra Gitflow para `fix/` e `hotfix/` permanece como antes.
-->

# Constituição do Frontend Mystery Gifter

## Princípios Fundamentais

### I. Qualidade de Código

Todo código deste projeto DEVE ser limpo, legível e manutenível. Em específico:

- Todo arquivo e módulo DEVE ter uma única responsabilidade clara (SRP).
- Funções e componentes DEVEM ser pequenos e focados — preferir compor peças pequenas a
  implementações grandes e multipropósito.
- Magic numbers e strings inline DEVEM ser extraídos para constantes nomeadas.
- Código morto, imports não utilizados e blocos comentados NÃO DEVEM ser commitados.
- TypeScript DEVE ser usado em todos os arquivos; `any` é proibido salvo justificativa
  explícita em comentário inline.
- Linting e formatação (ESLint + Prettier) DEVEM passar em todo commit — sem exceção.

**Justificativa**: código consistente e de alta qualidade reduz fricção de onboarding,
previne bugs sutis e mantém a base de código sustentável conforme o time e a feature set
crescem.

### II. Testes Unitários (INEGOCIÁVEL)

Todo componente React e toda função utilitária deste projeto DEVE ter um teste unitário
correspondente. Restrição inegociável que se aplica a todo código novo ou modificado.

- Testes DEVEM ser co-localizados com o arquivo-fonte no mesmo diretório
  (ex.: `Button.tsx` + `Button.test.tsx`); diretórios `__tests__` NÃO podem ser usados.
- Testes DEVEM usar React Testing Library + Jest.
- Cada teste de componente DEVE cobrir: render sem crash, comportamento interativo
  principal e ramificações condicionais de render.
- Testes DEVEM ser escritos antes ou junto da implementação (test-first preferido,
  test-alongside aceitável; test-after NÃO é aceitável).
- PR NÃO pode ser merged se a cobertura de teste dos componentes modificados cair abaixo
  do limiar do projeto (mínimo 80% de cobertura de linhas).
- Testes NÃO DEVEM apoiar-se em detalhes de implementação (sem acesso direto a state
  interno ou refs); testar comportamento sob a ótica do usuário.

**Justificativa**: testes unitários são a principal rede de segurança para refatoração
e novas features. Exigi-los para todo componente previne regressões não detectadas e
documenta o comportamento esperado.

### III. Consistência de Experiência do Usuário

A UI DEVE apresentar uma experiência coerente e previsível em todas as telas e estados.

- O Style Guide definido nesta constituição (ver seção **Style Guide**), em conjunto com
  o `DESIGN.md` na raiz do repositório, são o **contrato visual obrigatório**. Conflitos
  entre os dois são resolvidos em favor do `DESIGN.md`.
- O framework de estilos do projeto é **Tailwind CSS** (com tokens customizados sob
  namespace `mg` em `tailwind.config.ts`). Bootstrap, AdminLTE, jQuery e qualquer outro
  framework CSS legado **NÃO são permitidos** em novos componentes; sua remoção na
  feature 005 marca o fim do suporte a essa stack.
- Estados de carregamento DEVEM usar **skeletons** (via `react-loading-skeleton`);
  spinners são proibidos em qualquer tela, fluxo ou componente.
- Estados vazios DEVEM usar o componente compartilhado `EmptyState` (ícone + mensagem
  em pt-BR + CTA contextual). Variações ad-hoc não são permitidas.
- Modais (overlays bloqueantes com backdrop) DEVEM ser usados **exclusivamente** para
  confirmar ações destrutivas/irreversíveis. Demais fluxos: rota dedicada (criação,
  edição, convite) ou bottom sheet (visualização rápida read-only).
- Elementos interativos (botões, links, formulários) DEVEM seguir padrões consistentes
  de feedback: estado desabilitado durante submissão, mensagens de erro visíveis em
  falha, confirmação de sucesso.
- Acessibilidade DEVE ser considerada: todo elemento interativo DEVE ser navegável por
  teclado, expor `:focus-visible` com anel verde, e ter `aria-label` ou `aria-current`
  adequados onde a semântica nativa não basta.
- Design responsivo é **mobile-first**; a estética app-like persiste em todas as
  larguras (em desktop o conteúdo permanece centralizado dentro de `max-w-app`, não
  expande como painel).

**Justificativa**: UX consistente constrói confiança do usuário e reduz carga de
suporte. Mover a base de Bootstrap+AdminLTE para Tailwind+DESIGN.md (Mystery Gifter v2
— feature 005) eliminou ~600 KB de CSS legado, permitiu primitivas unificadas de
modal/skeleton/empty e desbloqueou um visual moderno coerente com a posição de produto.

### IV. Padrões de Performance

A aplicação DEVE atingir os seguintes alvos de performance, medidos por Lighthouse ou
Core Web Vitals em CI:

- **LCP (Largest Contentful Paint)**: ≤ 2.5 s em desktop, ≤ 4.0 s em mobile (3G simulado).
- **CLS (Cumulative Layout Shift)**: ≤ 0.1 em todas as páginas.
- **INP (Interaction to Next Paint)**: ≤ 200 ms para interações principais.
- Imagens DEVEM usar o `<Image>` do Next.js com `width`, `height` e `priority`
  apropriados — tags `<img>` cruas são proibidas.
- Bundles JavaScript DEVEM ser code-split por rota; código de feature NÃO DEVE entrar
  no payload inicial salvo se necessário ao primeiro render.
- Scripts de terceiros DEVEM ser carregados com `next/script` usando uma `strategy`
  apropriada (`lazyOnload` por padrão).

**Justificativa**: performance de frontend impacta diretamente retenção de usuário e
SEO. Alvos explícitos e mensuráveis previnem que regressões passem despercebidas
durante o desenvolvimento de features.

### V. Boas Práticas do Next.js & Simplicidade

Este projeto DEVE seguir as convenções oficiais do App Router do Next.js e padrões
estabelecidos pela comunidade. Complexidade DEVE ser justificada — a solução mais
simples que atende aos requisitos é sempre preferida (YAGNI).

- Usar o App Router (`app/`) para todo roteamento; o Pages Router NÃO pode ser usado.
- Segmentos de rota (nomes de diretório sob `app/`) DEVEM estar em inglês — ex.:
  `/register`, não `/registro`. Texto e rótulos de UI permanecem em pt-BR; só o caminho
  URL é em inglês.
- Server Components DEVEM ser o padrão; adicionar `"use client"` apenas quando
  interatividade, APIs do browser ou hooks exigirem — e documentar o motivo no topo
  do arquivo.
- Data fetching DEVE usar Server Components + `fetch` com opções de cache apropriadas,
  ou Server Actions para mutações; `useEffect` para data fetching no cliente é proibido
  salvo quando não houver alternativa server-side.
- Route handlers (`app/api/`) DEVEM ser usados apenas para endpoints que realmente
  exigem lógica server-side; evite criar rotas que apenas fazem proxy de um backend
  existente.
- Estado global DEVE ser minimizado; prefira URL state, server state
  (React Query / SWR) ou React context com escopo de subárvore a um store global.
- Dependências DEVEM ser avaliadas quanto a impacto de bundle antes da adoção; prefira
  capacidades nativas do browser/Next.js a libs de terceiros para tarefas padrão.

**Justificativa**: seguir os padrões pretendidos pelo framework garante compatibilidade
com versões futuras do Next.js, beneficia-se das otimizações nativas e mantém a base
acessível para devs já familiarizados com o ecossistema Next.js.

## Padrões de Frontend

**Linguagem & Runtime**: TypeScript 5+, Node.js LTS
**Framework**: Next.js 15+ (App Router) + React 19
**Estilização**: **Tailwind CSS** com tokens customizados em `tailwind.config.ts`
  (theme.extend, namespace `mg`). Bootstrap, AdminLTE, jQuery, popper.js e Font Awesome
  **NÃO** são permitidos. Classes utilitárias do projeto que não vêm do Tailwind DEVEM ser
  prefixadas com `mg-` (`mg-app-shell`, `mg-shimmer`, etc.). Sem `style` props para
  valores estáticos.
**Configuração de tema**: `tailwind.config.ts` (theme.extend) é fonte primária; CSS custom
  properties em `src/app/globals.css` espelham os mesmos tokens para usos pontuais
  (gradientes, inset shadows). Hardcode de cor/raio/sombra/tipografia fora desses dois
  arquivos é proibido (FR-006 da feature 005).
**Tipografia**: Manrope (família principal) + Noto Sans (scripts globais) carregadas via
  `next/font/google`. Pesos permitidos: 400, 600, 700.
**Ícones**: `lucide-react` (tree-shakeable, React-first). Outras bibliotecas exigem
  emenda à constituição.
**Componentes**: biblioteca compartilhada em `src/components/ui/` — todas as primitivas
  têm teste unitário co-localizado (`<Name>/<Name>.tsx` + `<Name>.test.tsx`).
**Diálogos sobrepostos**: única primitiva permitida é `ConfirmModal` (sobre
  `@radix-ui/react-dialog`). Visualizações rápidas usam `BottomSheet` (mesma base).
**Estados de carregamento**: `react-loading-skeleton` envolvido em `<SkeletonProvider>`
  global. Spinners proibidos.
**Estados vazios**: componente compartilhado `EmptyState` com variants `default | error`.
**Stack de testes**: Jest + jest-environment-jsdom + React Testing Library + ts-jest
  (unitários). Playwright/Cypress (E2E) são opcionais por feature.
**Linting & formatação**: ESLint (ruleset next/core-web-vitals) + Prettier — aplicados
  via pre-commit hook e CI.
**Gate de CI**: todos os testes DEVEM passar, linting DEVE estar limpo e o build DEVE ser
  bem-sucedido antes de qualquer PR ser merged.

## Guia de Estilo

A identidade visual completa do produto está em [`DESIGN.md`](../../DESIGN.md), na raiz do
repositório. Esta seção da constituição **referencia** e **resume** as regras invioláveis;
sempre que houver discrepância, o `DESIGN.md` é a autoridade final.

### Modo Escuro (INEGOCIÁVEL)

- A aplicação opera em **modo escuro obrigatório** em todas as larguras.
- Não há modo claro — `prefers-color-scheme: light` é intencionalmente ignorado.
- O `body` resolve sempre para `var(--mg-bg)` (`#121212`).

### Tokens de Design

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

## Fluxo de Desenvolvimento

1. **Nomenclatura de branches (INEGOCIÁVEL)**: nomes de branches DEVEM seguir os padrões
   abaixo. Branches que não conformam NÃO podem ser merged.

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

## Governança

Esta constituição supera quaisquer outras práticas de desenvolvimento, diretrizes de código
e convenções informais no projeto mystery-gifter-fe.

**Procedimento de emenda**:
1. Propor a emenda em um PR que modifique este arquivo.
2. A descrição do PR DEVE explicar a motivação, a justificativa do bump de versão e listar
   todos os templates e documentos afetados.
3. A emenda exige ao menos uma aprovação de um mantenedor do projeto.
4. No merge, `Last Amended` DEVE ser atualizado para a data do merge e `Version` DEVE
   ser incrementado conforme a política de versionamento semântico documentada abaixo.

**Política de versionamento**:
- MAJOR: remoção ou redefinição backward-incompatible de um princípio existente.
- MINOR: novo princípio ou seção adicionada; expansão material de orientação existente.
- PATCH: esclarecimento, melhoria de wording ou correção de typo sem mudança semântica.

**Revisão de conformidade**: toda revisão de PR DEVE incluir um constitution check.
Violações exigem justificativa explícita documentada na tabela Complexity Tracking do
`plan.md` relevante antes do merge.

**Version**: 2.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-06-17
