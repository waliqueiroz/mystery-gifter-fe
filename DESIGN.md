# Design System Inspirado no Spotify

> **Nota de implementação (atualizado 2026-06-17)**
>
> Este documento é a referência visual canônica do Mystery Gifter. As regras abaixo (cores,
> geometria, sombras, tipografia, do/don't) são contrato vinculante para todo o produto.
>
> Algumas escolhas precisaram ser adaptadas para fontes/recursos livres:
>
> - **Tipografia (§3)**: as famílias proprietárias da Spotify (`SpotifyMixUITitle` /
>   `SpotifyMixUI` / `CircularSp`) foram substituídas oficialmente por **Manrope** (Title +
>   UI) + **Noto_Sans** (cobertura de scripts globais), carregadas via `next/font/google`.
> - **Ícones**: como o produto não consome glifos da iconografia proprietária do Spotify,
>   adota-se `lucide-react` — tree-shakeable e alinhado à estética line-art achromatic.
> - **Stack de implementação**: Tailwind CSS com tokens espelhados em `tailwind.config.ts`
>   (theme.extend, namespace `mg`) + CSS custom properties em `globals.css`.
>
> Todas as demais regras seguem inalteradas e são autoridade final em qualquer conflito
> com `CLAUDE.md` ou com a constituição.

## 1. Tema Visual & Atmosfera

A interface web do Spotify é um player de música escuro e imersivo que envolve o ouvinte
em um casulo near-black (`#121212`, `#181818`, `#1f1f1f`) onde a arte de álbum e o
conteúdo se tornam a fonte primária de cor. A filosofia de design é "escuridão
content-first" — a UI recua para a sombra para que música, podcasts e playlists possam
brilhar. Toda superfície é uma variação de carvão, criando um ambiente de teatro onde a
única cor verdadeira vem do icônico Spotify Green (`#1ed760`) e da própria arte do álbum.

A tipografia usa SpotifyMixUI e SpotifyMixUITitle — fontes proprietárias da família
CircularSp (Circular by Lineto, customizadas para o Spotify) com uma pilha de fallback
extensa que inclui Arabic, Hebrew, Cyrillic, Greek, Devanagari e CJK, refletindo o
alcance global do Spotify. O sistema tipográfico é compacto e funcional: 700 (bold) para
ênfase e navegação, 600 (semibold) para ênfase secundária e 400 (regular) para corpo.
Botões usam uppercase com letter-spacing positivo (1.4px–2px) para uma qualidade
sistemática, semelhante a label.

O que distingue o Spotify é sua geometria pill-and-circle. Botões primários usam raio
500px–9999px (pill completo), botões circulares de play usam raio 50% e inputs de busca
são pills de 500px. Combinados com sombras pesadas (`rgba(0,0,0,0.5) 0px 8px 24px`) em
elementos elevados e uma combinação única de inset border-shadow
(`rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset`), o resultado é
uma interface que se parece com um dispositivo de áudio premium — tátil, arredondado e
construído para toque.

**Características-chave:**
- Tema escuro near-black imersivo (`#121212`–`#1f1f1f`) — a UI desaparece atrás do conteúdo
- Spotify Green (`#1ed760`) como único acento de marca — nunca decorativo, sempre funcional
- Pilha tipográfica SpotifyMixUI/CircularSp com suporte a scripts globais
- Botões pill (500px–9999px) e controles circulares (50%) — arredondados, otimizados para toque
- Rótulos de botão em uppercase com letter-spacing amplo (1.4px–2px)
- Sombras pesadas em elementos elevados (`rgba(0,0,0,0.5) 0px 8px 24px`)
- Cores semânticas: vermelho de erro (`#f3727f`), laranja de aviso (`#ffa42b`), azul de info (`#539df5`)
- Arte de álbum como fonte primária de cor — a UI é achromatic por design

## 2. Paleta de Cores & Papéis

### Marca primária
- **Spotify Green** (`#1ed760`): acento primário de marca — botões de play, estados ativos, CTAs
- **Near Black** (`#121212`): superfície de fundo mais profunda
- **Dark Surface** (`#181818`): cartões, containers, superfícies elevadas
- **Mid Dark** (`#1f1f1f`): fundos de botão, superfícies interativas

### Texto
- **White** (`#ffffff`): `--text-base`, texto primário
- **Silver** (`#b3b3b3`): texto secundário, rótulos muted, nav inativa
- **Near White** (`#cbcbcb`): texto secundário ligeiramente mais claro
- **Light** (`#fdfdfd`): branco quase puro para ênfase máxima

### Semântico
- **Negative Red** (`#f3727f`): `--text-negative`, estados de erro
- **Warning Orange** (`#ffa42b`): `--text-warning`, estados de aviso
- **Announcement Blue** (`#539df5`): `--text-announcement`, estados de info

### Superfície & Borda
- **Dark Card** (`#252525`): superfície de cartão elevado
- **Mid Card** (`#272727`): superfície de cartão alternativa
- **Border Gray** (`#4d4d4d`): bordas de botão sobre fundo escuro
- **Light Border** (`#7c7c7c`): bordas de botões outlined, links muted
- **Separator** (`#b3b3b3`): linhas divisórias
- **Light Surface** (`#eeeeee`): botões de modo claro (raro)
- **Spotify Green Border** (`#1db954`): variante de borda em verde

### Sombras
- **Heavy** (`rgba(0,0,0,0.5) 0px 8px 24px`): diálogos, menus, painéis elevados
- **Medium** (`rgba(0,0,0,0.3) 0px 8px 8px`): cartões, dropdowns
- **Inset Border** (`rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset`): combinação border-shadow de inputs

## 3. Regras de Tipografia

### Famílias de fonte

A pilha original do Spotify usa famílias proprietárias (`SpotifyMixUITitle`/`SpotifyMixUI`
sobre `CircularSp`) que não estão disponíveis para uso público. O Mystery Gifter adota como
**pilha oficial** as seguintes substitutas livres (licença OFL), carregadas via
`next/font/google` em build time:

- **Title**: `Manrope` (variável, pesos 400/600/700) — herdeira espiritual da Circular;
  geométrica, levemente humanista, terminais arredondados, voltada para UI.
- **UI / Body**: `Manrope` (mesma família para reduzir variação de cadência e custo de
  carregamento).
- **Cobertura de scripts globais**: `Noto_Sans` (Latin + Cyrillic + Greek por padrão).
  Para Arabic, Hebrew, Devanagari ou CJK, importar `Noto_Sans_Arabic`, `Noto_Sans_Hebrew`,
  `Noto_Sans_Devanagari` e `Noto_Sans_SC` adicionalmente — todos via `next/font/google`,
  cada um exposto como variável CSS própria.
- **Fallback final**: `Helvetica Neue`, `Helvetica`, `Arial`, `sans-serif`.

A pilha proprietária original permanece documentada abaixo como **referência de intenção
visual**, mas não é usada em produção.

#### Pilha de referência (proprietária — não utilizada)

- **Title (referência)**: `SpotifyMixUITitle`, fallbacks: `CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, Helvetica Neue, helvetica, arial, Hiragino Sans, Hiragino Kaku Gothic ProN, Meiryo, MS Gothic`
- **UI / Body (referência)**: `SpotifyMixUI`, mesma pilha de fallback

### Hierarquia

| Papel | Fonte | Tamanho | Peso | Line height | Letter spacing | Notas |
|-------|-------|---------|------|-------------|----------------|-------|
| Section Title | SpotifyMixUITitle | 24px (1.50rem) | 700 | normal | normal | Peso de título bold |
| Feature Heading | SpotifyMixUI | 18px (1.13rem) | 600 | 1.30 (tight) | normal | Headings de seção semibold |
| Body Bold | SpotifyMixUI | 16px (1.00rem) | 700 | normal | normal | Texto enfatizado |
| Body | SpotifyMixUI | 16px (1.00rem) | 400 | normal | normal | Corpo padrão |
| Button Uppercase | SpotifyMixUI | 14px (0.88rem) | 600–700 | 1.00 (tight) | 1.4px–2px | `text-transform: uppercase` |
| Button | SpotifyMixUI | 14px (0.88rem) | 700 | normal | 0.14px | Botão padrão |
| Nav Link Bold | SpotifyMixUI | 14px (0.88rem) | 700 | normal | normal | Navegação ativa |
| Nav Link | SpotifyMixUI | 14px (0.88rem) | 400 | normal | normal | Navegação inativa |
| Caption Bold | SpotifyMixUI | 14px (0.88rem) | 700 | 1.50–1.54 | normal | Metadados em bold |
| Caption | SpotifyMixUI | 14px (0.88rem) | 400 | normal | normal | Metadados |
| Small Bold | SpotifyMixUI | 12px (0.75rem) | 700 | 1.50 | normal | Tags, contadores |
| Small | SpotifyMixUI | 12px (0.75rem) | 400 | normal | normal | Texto fino |
| Badge | SpotifyMixUI | 10.5px (0.66rem) | 600 | 1.33 | normal | `text-transform: capitalize` |
| Micro | SpotifyMixUI | 10px (0.63rem) | 400 | normal | normal | Texto mínimo |

### Princípios
- **Binário bold/regular**: a maior parte do texto é 700 (bold) ou 400 (regular), com 600
  usado com parcimônia. Cria hierarquia visual clara por contraste de peso em vez de
  variação de tamanho.
- **Uppercase em botões como sistema**: rótulos de botão usam uppercase + letter-spacing
  amplo (1.4px–2px), criando uma voz sistemática de "label" distinta do texto de conteúdo.
- **Tamanhos compactos**: o intervalo é 10px–24px — mais estreito do que a maioria dos
  sistemas. A tipografia da Spotify é compacta e funcional, desenhada para varrer
  playlists, não ler artigos.
- **Suporte a scripts globais**: a pilha original Spotify lista Arabic, Hebrew, Cyrillic,
  Greek, Devanagari e CJK. O Mystery Gifter implementa essa cobertura via `Noto_Sans` +
  variantes específicas conforme necessidade futura de internacionalização.

## 4. Estilos de Componentes

### Botões

**Dark Pill**
- Fundo: `#1f1f1f`
- Texto: `#ffffff` ou `#b3b3b3`
- Padding: 8px 16px
- Raio: 9999px (pill completo)
- Uso: pills de navegação, ações secundárias

**Dark Large Pill**
- Fundo: `#181818`
- Texto: `#ffffff`
- Padding: 0px 43px
- Raio: 500px
- Uso: botões primários de navegação do app

**Light Pill**
- Fundo: `#eeeeee`
- Texto: `#181818`
- Raio: 500px
- Uso: CTAs em modo claro (consentimento de cookies, marketing)

**Outlined Pill**
- Fundo: transparente
- Texto: `#ffffff`
- Borda: `1px solid #7c7c7c`
- Padding: 4px 16px 4px 36px (assimétrico para ícone)
- Raio: 9999px
- Uso: botões follow, ações secundárias

**Circular Play**
- Fundo: `#1f1f1f`
- Texto: `#ffffff`
- Padding: 12px
- Raio: 50% (círculo)
- Uso: controles de play/pause

### Cartões & containers
- Fundo: `#181818` ou `#1f1f1f`
- Raio: 6px–8px
- Sem bordas visíveis na maioria dos cartões
- Hover: leve clareamento de fundo
- Sombra: `rgba(0,0,0,0.3) 0px 8px 8px` em estado elevado

### Inputs
- Input de busca: fundo `#1f1f1f`, texto `#ffffff`
- Raio: 500px (pill)
- Padding: 12px 96px 12px 48px (com espaço para ícone)
- Foco: borda muda para `#000000`, outline `1px solid`

### Navegação
- Sidebar escura com SpotifyMixUI 14px peso 700 para ativa, 400 para inativa
- Cor muted `#b3b3b3` para itens inativos, `#ffffff` para ativo
- Botões circulares com ícone (raio 50%)
- Logo Spotify no canto superior esquerdo em verde

## 5. Princípios de Layout

### Sistema de espaçamento
- Unidade base: 8px
- Escala: 1px, 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 14px, 15px, 16px, 20px

### Grid & container
- Sidebar (fixa) + área de conteúdo principal
- Cartões de álbum/playlist em grid
- Now-playing bar full-width na base
- Área de conteúdo responsiva preenche o espaço restante

### Filosofia de whitespace
- **Compressão escura**: a Spotify empacota o conteúdo densamente — grids de playlist,
  listas de faixas e navegação são todos tightly spaced. O fundo escuro oferece descanso
  visual entre elementos sem precisar de gaps grandes.
- **Densidade de conteúdo sobre espaço para respirar**: isto é um app, não um site de
  marketing. Cada pixel serve à experiência de escuta.

### Escala de border-radius
- Mínimo (2px): badges, tags explícitas
- Sutil (4px): inputs, elementos pequenos
- Padrão (6px): containers de arte de álbum, cartões
- Confortável (8px): seções, diálogos
- Médio (10px–20px): painéis, elementos de overlay
- Grande (100px): botões pill grandes
- Pill (500px): botões primários, input de busca
- Pill completo (9999px): pills de navegação, busca
- Círculo (50%): botões de play, avatares, ícones

## 6. Profundidade & Elevação

| Nível | Tratamento | Uso |
|-------|------------|-----|
| Base (Nível 0) | fundo `#121212` | camada mais profunda, page background |
| Surface (Nível 1) | `#181818` ou `#1f1f1f` | cartões, sidebar, containers |
| Elevated (Nível 2) | `rgba(0,0,0,0.3) 0px 8px 8px` | menus dropdown, cartões em hover |
| Dialog (Nível 3) | `rgba(0,0,0,0.5) 0px 8px 24px` | modais, overlays, menus |
| Inset (borda) | `rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset` | bordas de input |

**Filosofia de sombra**: a Spotify usa sombras notavelmente pesadas para um app com tema
escuro. A sombra de opacidade 0.5 e blur de 24px cria um efeito dramático de "flutuando
na escuridão" para diálogos e menus, enquanto a sombra de opacidade 0.3 e blur de 8px
fornece um lift mais sutil para cartões. A combinação única de inset border-shadow em
inputs cria uma qualidade recessed e tátil.

## 7. Faça & Não Faça

### Faça
- Use fundos near-black (`#121212`–`#1f1f1f`) — profundidade por variação de tom
- Aplique Spotify Green (`#1ed760`) apenas para controles de play, estados ativos e CTAs primários
- Use formato pill (500px–9999px) para todos os botões — circular (50%) para controles de play
- Aplique uppercase + letter-spacing amplo (1.4px–2px) em rótulos de botão
- Mantenha a tipografia compacta (intervalo 10px–24px) — isto é um app, não uma revista
- Use sombras pesadas (`opacidade 0.3–0.5`) para elementos elevados em fundos escuros
- Deixe a arte de álbum prover a cor — a UI em si é achromatic

### Não Faça
- Não use Spotify Green decorativamente nem em fundos — é só funcional
- Não use fundos claros para superfícies primárias — a imersão escura é central
- Não pule a geometria pill/circular em botões — botões quadrados quebram a identidade
- Não use sombras finas/sutis — em fundos escuros, sombras precisam ser pesadas para serem visíveis
- Não adicione cores de marca adicionais — verde + cinzas achromatic é a paleta completa
- Não use line-heights relaxados — a tipografia da Spotify é compacta e densa
- Não exponha bordas cinza cruas — use bordas baseadas em sombra ou inset

## 8. Comportamento Responsivo

### Breakpoints
| Nome | Largura | Mudanças principais |
|------|---------|---------------------|
| Mobile Small | <425px | Layout mobile compacto |
| Mobile | 425–576px | Mobile padrão |
| Tablet | 576–768px | Grid de 2 colunas |
| Tablet Large | 768–896px | Layout expandido |
| Desktop Small | 896–1024px | Sidebar visível |
| Desktop | 1024–1280px | Layout desktop completo |
| Large Desktop | >1280px | Grid expandido |

### Estratégia de colapso
- Sidebar: completa → colapsada → escondida
- Grid de álbuns: 5 colunas → 3 → 2 → 1
- Now-playing bar: mantida em todos os tamanhos
- Busca: input pill mantido, largura ajusta
- Navegação: sidebar → bottom bar em mobile

## 9. Guia de Prompts para o Agente

### Referência rápida de cor
- Background: Near Black (`#121212`)
- Surface: Dark Card (`#181818`)
- Text: White (`#ffffff`)
- Texto secundário: Silver (`#b3b3b3`)
- Acento: Spotify Green (`#1ed760`)
- Borda: `#4d4d4d`
- Erro: Negative Red (`#f3727f`)

### Exemplos de prompts de componente
- "Crie um cartão escuro: fundo #181818, raio 8px. Título em 16px SpotifyMixUI peso 700, texto branco. Subtítulo em 14px peso 400, #b3b3b3. Sombra rgba(0,0,0,0.3) 0px 8px 8px em hover."
- "Desenhe um botão pill: fundo #1f1f1f, texto branco, raio 9999px, padding 8px 16px. 14px SpotifyMixUI peso 700, uppercase, letter-spacing 1.4px."
- "Construa um botão circular de play: fundo Spotify Green (#1ed760), ícone #000000, raio 50%, padding 12px."
- "Crie um input de busca: fundo #1f1f1f, texto branco, raio 500px, padding 12px 48px. Inset border: rgb(124,124,124) 0px 0px 0px 1px inset."
- "Desenhe uma sidebar de navegação: fundo #121212. Itens ativos: 14px peso 700, branco. Inativos: 14px peso 400, #b3b3b3."

### Guia de iteração
1. Comece com #121212 — tudo vive na escuridão near-black
2. Spotify Green apenas para highlights funcionais (play, ativo, CTA)
3. Pill em tudo — 500px para grande, 9999px para pequeno, 50% para circular
4. Uppercase + tracking amplo em botões — a voz sistemática de label
5. Sombras pesadas (opacidade 0.3–0.5) para elevação — sombras leves são invisíveis no escuro
6. A arte de álbum fornece toda a cor — a UI permanece achromatic
