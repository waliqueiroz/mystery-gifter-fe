# Pesquisa Técnica — 005-mobile-ui-redesign

**Data**: 2026-06-17
**Escopo**: Resolver decisões técnicas das premissas em `plan.md` e qualquer NEEDS CLARIFICATION remanescente.

---

## 1. Configuração do Tailwind para refletir o DESIGN.md

**Decisão**: usar `tailwind.config.ts` com `theme.extend` para registrar tokens do DESIGN.md como configuração de design (cores, radii, sombras, espaçamentos, fontes); expor os mesmos tokens como CSS custom properties em `globals.css` para reuso em casos onde Tailwind utilitário não basta (ex.: gradientes complexos, `inset` border-shadow combinations).

**Justificativa**:
- Tokens em `theme.extend` se tornam utilitários nativos (`bg-mg-bg`, `text-mg-text`, `rounded-mg-pill`) com tree-shaking.
- CSS custom properties em paralelo permitem reusar os mesmos valores em `style={{ "--var": ... }}` em casos raros, sem hardcode.
- Variantes responsivas do Tailwind (`sm:`, `md:`, etc.) substituem a tabela de breakpoints do DESIGN.md sem código adicional.
- `darkMode: 'class'` desativado em favor de `dark` como classe forçada no `<html>` (modo escuro obrigatório FR-012).

**Esboço do `tailwind.config.ts`**:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mg: {
          bg: '#121212',
          surface: '#181818',
          'surface-2': '#1f1f1f',
          'surface-3': '#252525',
          'surface-4': '#272727',
          green: '#1ed760',
          'green-border': '#1db954',
          text: '#ffffff',
          'text-muted': '#b3b3b3',
          'text-near-white': '#cbcbcb',
          'text-light': '#fdfdfd',
          'text-negative': '#f3727f',
          'text-warning': '#ffa42b',
          'text-announcement': '#539df5',
          border: '#4d4d4d',
          'border-light': '#7c7c7c',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'var(--font-noto-sans)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        title: ['var(--font-manrope)', 'var(--font-noto-sans)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: { btn: '0.1em' /* ~1.4–2px conforme tamanho */ },
      borderRadius: { pill: '9999px', 'pill-lg': '500px', card: '8px', 'card-sm': '6px' },
      boxShadow: {
        'mg-card': 'rgba(0,0,0,0.3) 0px 8px 8px',
        'mg-dialog': 'rgba(0,0,0,0.5) 0px 8px 24px',
        'mg-inset': 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset',
      },
      maxWidth: { app: '480px' /* container mobile-like em desktop */ },
    },
  },
  plugins: [],
}

export default config
```

**Alternativas consideradas**:
- CSS Modules + variáveis CSS: descartado — sem purge automático, mais código, mais difícil manter consistência.
- UnoCSS: descartado — menos maduro no ecossistema Next.js que Tailwind; benefícios de performance marginal para o porte do app.
- Vanilla Extract / Panda CSS: descartado — adiciona build step e dependência de runtime/compile que não traz valor para a escala do projeto.

---

## 2. Integração de `next/font/google` com Tailwind

**Decisão**: importar Manrope e Noto Sans (cobrindo Arabic, Hebrew, Devanagari, CJK SC) em `src/app/layout.tsx` via `next/font/google`, expor variáveis CSS (`--font-manrope`, `--font-noto-sans`) no `<html>`, e referenciá-las no `tailwind.config.ts` em `theme.fontFamily`.

**Justificativa**:
- `next/font/google` baixa as fontes em build time e auto-self-hospeda (FR-011 + Q3).
- Estratégia com CSS variable elimina duplicação entre Next config e Tailwind config.
- `display: 'swap'` + `adjustFontFallback` controlam CLS automaticamente.
- Noto Sans CJK e Arabic são imports independentes; cada bloco de scripts é carregado sob demanda.

**Esboço**:

```ts
// src/app/layout.tsx
import { Manrope, Noto_Sans } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
})

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic', 'greek'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})
```

Para suporte a Arabic/Hebrew/Devanagari/CJK, importa-se `Noto_Sans_Arabic`, `Noto_Sans_Hebrew`, `Noto_Sans_Devanagari` e `Noto_Sans_SC` em paralelo (cada um expõe sua própria variável; aplicar via `lang="xx"` quando necessário). Para o escopo desta feature (UI em pt-BR), basta Latin + Cyrillic/Greek como cobertura inicial. Outros scripts ficam disponíveis para futuras internacionalizações.

**Alternativas**:
- CDN Google Fonts via `<link>`: rejeitado por FR-011 (proibido) e por degradação de CLS/privacidade.
- Self-host manual via `next/font/local`: rejeitado — exige gestão de WOFF2 no repositório; `next/font/google` faz o mesmo automaticamente.

**Mock para Jest**: criar `__mocks__/next/font/google.ts` retornando objetos com `className`, `style`, e `variable` (`''`). Já há precedente no projeto (ver `__mocks__` na raiz).

---

## 3. `react-loading-skeleton` — compatibilidade e padrão de uso

**Decisão**: adotar `react-loading-skeleton` v3+ como única fonte de skeletons. Envolver a árvore `(protected)` com `<SkeletonTheme baseColor="#1f1f1f" highlightColor="#272727">` para casar com a paleta near-black do DESIGN.md. Wrappers próprios (`<SkeletonBox>`, `<SkeletonText>`, `<SkeletonCircle>`) padronizam tamanhos/raios para evitar configuração ad-hoc.

**Justificativa**:
- v3+ funciona com React 18+ e segue compatível com React 19 (issue em aberto na época da pesquisa? **VERIFICAR no momento da implementação** — se houver incompatibilidade com R19, considerar `react-loading-skeleton` v4 nightly ou fork temporário; o fallback é trivial pois a API é apenas `<Skeleton />`).
- Pequena (≈ 4 KB gzip), zero deps, suporte a animação shimmer (controlável via CSS prop `--animation-duration`).
- Animação respeita `prefers-reduced-motion` quando combinada com a regra global do projeto (`@media (prefers-reduced-motion: reduce)` em `globals.css`).

**Padrão de uso**:

```tsx
// Lista de grupos carregando
<SkeletonTheme baseColor="#1f1f1f" highlightColor="#272727">
  <ul className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <li key={i}>
        <SkeletonCard /> {/* wrapper que monta a forma final do GroupCard */}
      </li>
    ))}
  </ul>
</SkeletonTheme>
```

**Decisão sobre delay**: aplicar **150 ms de delay** antes de mostrar skeleton (evita "flash" em respostas rápidas) via hook `useDelayedFlag(loading, 150)` próprio. Padrão amplamente recomendado; valor diferido para o plano (não aparece na spec).

**Alternativas**:
- Spinner CSS próprio: proibido por FR-024.
- Skeleton manual com `animate-pulse` do Tailwind: viável mas exige duplicar lógica; perde a flexibilidade de shimmer e a API declarativa do `react-loading-skeleton`. Esta opção fica como plano B se a v3 não funcionar em React 19.

---

## 4. Biblioteca de ícones — substituir Font Awesome

**Decisão**: adotar `lucide-react`.

**Justificativa**:
- Tree-shakeable por padrão (cada ícone é um componente React separado).
- ~22 KB para os 30 ícones esperados (vs ~400 KB de Font Awesome Free).
- API React-first, props nativas para `size`, `strokeWidth`, `color` — combina com Tailwind utilitários.
- Estilo line-art alinhado ao DESIGN.md ("achromatic" UI; ícones discretos).
- Licença ISC; sem fontes web.

**Wrapper `Icon`**: padroniza `size={20}` e `aria-hidden={true}` por default; impõe paleta via `className`.

**Alternativas**:
- Font Awesome via npm: bundle pesado mesmo com `@fortawesome/react-fontawesome`; CSS adicional; não tree-shakeable nativamente sem effort.
- Heroicons: ótimos, mas menor cobertura para uso específico (ex.: ícone para sorteio, convite).
- SVG inline próprio: custo de manutenção desproporcional.

---

## 5. Bottom Sheet — primitiva acessível

**Decisão**: implementar `<BottomSheet>` próprio sobre **Radix UI Dialog** (`@radix-ui/react-dialog`) com customização de animação (slide from bottom) e padrão de gesto (drag-to-dismiss em mobile, opcional na primeira versão — pode ficar como `MAY` em vez de `MUST`). Radix é stateless, headless e cuida de focus trap, `aria-*` e ESC para fechar.

**Justificativa**:
- Reutiliza a mesma base que vai sustentar o `ConfirmModal` (ambos rolam sobre Dialog do Radix), consolidando comportamento de acessibilidade.
- Radix é o padrão de mercado e suporta React 19.
- Pequeno overhead (~6 KB gzip por componente, tree-shaking por feature).

**Alternativas**:
- Headless UI (`@headlessui/react`): também viável; rejeitado por menor flexibilidade para bottom sheets específicos.
- Vaul: lib específica de bottom sheets para React. Boa, porém adiciona dependência só para isso; Radix Dialog cobre o caso e já cobre confirmações.
- Custom from scratch: acessibilidade dá muito trabalho para fazer certo; perda de tempo.

---

## 6. `ConfirmModal` — reaproveitar Radix Dialog

**Decisão**: reescrever `ConfirmModal` em cima do mesmo `@radix-ui/react-dialog` usado pelo `BottomSheet`, com layout estilo "diálogo central" (não slide). Mantém a API atual (`<ConfirmModal isOpen onConfirm onCancel title body confirmText cancelText />`) para minimizar diff nos consumidores.

**Justificativa**: aproveitar acessibilidade do Radix, eliminar dependência implícita de jQuery (modal do Bootstrap), e consolidar todas as superfícies sobrepostas (única confirmação + bottom sheets) numa única base.

---

## 7. Bottom Tab Bar — safe area iOS e accessibility

**Decisão**: `BottomTabBar` é um `<nav aria-label="Navegação principal">` fixo (`fixed bottom-0 inset-x-0`) com `padding-bottom: env(safe-area-inset-bottom)` via `pb-[env(safe-area-inset-bottom)]` (Tailwind arbitrary value). Cada tab é um `<Link>` do Next com `aria-current="page"` quando ativa. Apenas dois itens: Grupos e Perfil (ver clarificação Q5). Estado ativo usa `text-mg-green`; inativo usa `text-mg-text-muted`.

**Justificativa**:
- `env(safe-area-inset-bottom)` evita que a barra fique embaixo da home indicator no iOS.
- `<nav>` + `aria-current` é o padrão de acessibilidade do MDN para navegação de site/app.
- O conteúdo da rota tem `padding-bottom` suficiente para não ficar coberto pela barra (`pb-20` em mobile; no desktop o sheet fica centralizado, então não há sobreposição).

---

## 8. Estratégia de remoção de Bootstrap/AdminLTE/jQuery

**Decisão (ordem de operações na implementação)**:
1. Instalar Tailwind + dependências novas e adicionar configuração (sem remover legado ainda).
2. Reescrever primitivas UI (Button, FormField, Toast, ErrorAlert, ConfirmModal) com Tailwind.
3. Reescrever AppShell + páginas autenticadas usando primitivas novas.
4. Reescrever páginas públicas.
5. Eliminar `(protected)/dashboard/`, `theme.css`, AdminLTELayout.
6. Remover dependências do `package.json` (`bootstrap`, `admin-lte`, `jquery`, `popper.js`, `@fortawesome/fontawesome-free`, `@types/jquery`).
7. Verificar bundle final via `next build` (SC-002).
8. Atualizar governança (P6).

**Justificativa**: a ordem mantém o produto sempre buildável; cada PR de história intermediária pode coexistir com a base antiga até a última história remover tudo. O `package.json` só perde as deps quando NENHUM `import` referenciar mais Bootstrap/AdminLTE.

---

## 9. Compatibilidade de testes existentes

**Risco identificado**: testes atuais podem fazer `expect(...).toHaveClass('btn-primary')` ou similares — assertivas em classes Bootstrap específicas.

**Decisão**: durante a refatoração de cada componente, atualizar testes para asserções por **comportamento** e por **atributos semânticos** (role, name) em vez de classes utilitárias. Permanece coerente com o Princípio II ("testes MUST NOT use implementation details").

**Justificativa**: testes baseados em classes acoplados ao framework antigo são parte do legado a ser eliminado; o esforço de atualizá-los é parte das tarefas de cada história, não trabalho adicional.

---

## 10. Configuração do PostCSS / globals.css

**Decisão**:

`postcss.config.mjs`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

`src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* tokens espelhados como CSS custom properties para uso fora de utilitários */
  --mg-bg: #121212;
  --mg-green: #1ed760;
  /* ...demais tokens... */
  --mg-transition: 200ms ease-in-out;
}

html { color-scheme: dark; }
body { background: var(--mg-bg); color: #ffffff; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

:focus-visible {
  outline: 2px solid var(--mg-green);
  outline-offset: 2px;
}
```

---

## 11. Quem assina o "default" de cada primitiva nas migrações

**Decisão**: criar primeiro as primitivas (Button, FormField, EmptyState, Skeleton wrappers, BottomSheet, AppShell, BottomTabBar) na **História P1**. As demais histórias **CONSOMEM** essas primitivas — não criam variações próprias. Cada PR de história valida as primitivas em uso real e só pode mexer em props já documentadas no contrato (ver `contracts/ui-primitives.md`).

**Justificativa**: evita drift de design entre histórias paralelas (P3/P4/P5 podem rodar em paralelo após P1+P2) e mantém o princípio de "tokens centralizados, componentes consumidores burros".

---

## 12. Itens deferidos da clarificação (revisitados aqui)

- **Delay antes do skeleton**: definido aqui como 150 ms via hook `useDelayedFlag`.
- **Animação do skeleton**: shimmer default do `react-loading-skeleton` (1.5s); respeita `prefers-reduced-motion` via regra global; não há override por componente.
- **Estado de erro pós-skeleton**: mantém o padrão herdado de 004 — substituir o conteúdo da área por um `EmptyState` com `variant="error"` (ícone de alerta + mensagem + CTA "Tentar novamente"). O EmptyState aceita variant `default | error`.
