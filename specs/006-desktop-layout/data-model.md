# Modelo de Layout — Feature 006 (Desktop Responsivo)

**Branch**: `006-desktop-layout` | **Data**: 2026-06-21

> Esta feature não introduz novas entidades de dados, endpoints de API ou mudanças
> em serviços. O "modelo" relevante é a estrutura de layout visual — documentada aqui
> como referência para a implementação.

---

## Estrutura de Layout

### Mobile (<896px) — Inalterado

```
┌─────────────────────────────┐
│  [Content Area]             │
│  mx-auto max-w-app px-4     │
│  pt-6 pb-24                 │
│                             │
│  → GroupList / ProfilePage  │
│    / FormPages / etc.       │
│                             │
└─────────────────────────────┘
│  [BottomTabBar - fixo]      │
│  Grupos | Perfil            │
└─────────────────────────────┘
```

### Desktop (≥896px) — Novo

```
┌──────────┬──────────────────────────────┐
│ Sidebar  │  [Content Area]              │
│ 220px    │  flex-1 min-w-0 px-6 py-6   │
│          │                              │
│ ● Gift   │  → GroupList (grid 2-3 col) │
│   Mystery│  → ProfilePage              │
│   Gifter │  → FormPages (max-w-content)│
│          │  → GroupDetail (max-w-cont) │
│ [Grupos] │                              │
│ [Perfil] │                              │
└──────────┴──────────────────────────────┘
(BottomTabBar: desk:hidden — não visível)
```

---

## Tokens de Design (Novos)

| Token | Tailwind Config Key | Valor | Uso |
|-------|--------------------|----|-----|
| Breakpoint `desk` | `screens.desk` | `896px` | Transição mobile → desktop em todo o layout |
| Largura da sidebar | `width.sidebar` | `220px` | Largura fixa da sidebar em desktop |
| Max-width de conteúdo | `maxWidth.content` | `640px` | Formulários e páginas de detalhe no desktop |

---

## Hierarquia de Componentes (Desktop)

```
AppShell
├── SkeletonProvider (mantido)
├── Sidebar [NOVO - desk:flex hidden]
│   ├── SidebarBrand (Gift icon + "Mystery Gifter")
│   └── SidebarNav
│       ├── SidebarLink (Grupos → /groups)
│       └── SidebarLink (Perfil → /profile)
└── <main> [flex-1, sem max-w-app no desktop]
    └── {children}
        ├── GroupList [grid 1→2→3 colunas]
        ├── GroupDetailContent [max-w-content no desktop]
        ├── CreateGroupForm [max-w-content no desktop]
        ├── InviteForm [max-w-content no desktop]
        └── ProfilePage [max-w-content no desktop]
```

---

## Hierarquia de Componentes (Público / Sem Sidebar)

```
RootLayout
└── (public) pages / invite pages
    ├── LoginForm [max-w-content mx-auto no desktop]
    ├── RegisterForm [max-w-content mx-auto no desktop]
    ├── LandingPage [sem mudança — já é marketing page]
    └── InviteAcceptancePage [max-w-content mx-auto no desktop]
```

---

## Invariantes

- A `BottomTabBar` permanece no DOM mas usa `desk:hidden` — não é removida condicionalmente via JS.
- A `Sidebar` é sempre renderizada no DOM mas usa `hidden desk:flex` — visibilidade via CSS.
- Não há state de "modo desktop/mobile" — o layout é puramente declarativo via classes Tailwind.
- Nenhuma mudança em serviços, hooks de dados, contextos ou autenticação.
