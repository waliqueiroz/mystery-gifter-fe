# Contratos de Uso — Primitivas de UI (005-mobile-ui-redesign)

**Data**: 2026-06-17

Este documento descreve **como** as histórias consumidoras (P3, P4, P5) DEVEM utilizar as primitivas criadas pelas histórias de fundação (P1, P2). Qualquer uso fora dos contratos abaixo é violação direta do plano.

---

## Contrato 1 — Cores funcionais (FR-008)

| Onde | Cor permitida | Cor proibida |
|------|---------------|--------------|
| Botão primário (CTA principal de uma tela) | `bg-mg-green` | qualquer outra de marca |
| Tab ativo na BottomTabBar | `text-mg-green` | qualquer outra |
| Ícone funcional (play, sortear) em estado ativo | `text-mg-green` | qualquer outra |
| Texto/borda/elemento decorativo | qualquer paleta exceto `mg-green` | `bg-mg-green`, `text-mg-green` |

Verificação: qualquer ocorrência de `mg-green` em arquivos não-funcionais é violação.

---

## Contrato 2 — Geometria de controles (FR-009)

| Componente | Shape obrigatório | Raio |
|------------|-------------------|------|
| Botão primário/secundário | `pill-lg` | `500px` |
| Botão pequeno / nav pill | `pill` | `9999px` |
| Botão de ação principal (sorteio, play) | `circle` | `50%` |
| Cartão | — | `card` (`8px`) ou `card-sm` (`6px`) |
| Input | — | `pill-lg` (`500px`) |

Botões `rounded-md`, `rounded`, `rounded-lg` (Tailwind padrão) **não** são permitidos.

---

## Contrato 2b — Separação entre `ErrorAlert` e `EmptyState variant='error'`

Ambos os componentes existem com responsabilidades distintas. Confundi-los gera drift.

| Caso de uso | Componente correto |
|-------------|--------------------|
| Erro inline em **formulário** (validação de campo, falha de submit) próximo do controle | `ErrorAlert` (banner pequeno, contextual ao formulário) |
| Erro em mensagem flutuante temporária (sucesso/falha de uma ação) | `Toast` |
| Falha ao **carregar uma seção inteira** (lista de grupos, detalhes, lista de membros) — substitui o conteúdo da área | `EmptyState variant='error'` com CTA "Tentar novamente" |
| Seção sem dados (lista vazia, busca sem resultados) | `EmptyState` (variant default) |

Regra prática: se o erro **substitui** o conteúdo de uma região de tela, use `EmptyState variant='error'`; se o erro **anota** uma ação ou um campo, use `ErrorAlert` ou `Toast`.

---

## Contrato 3 — Carregamento (FR-024)

Sequência canônica em todo fluxo que busca dados:

```tsx
const { data, loading, error } = useGroupsQuery(...)
const showSkeleton = useDelayedFlag(loading, 150)

if (error) return <EmptyState variant="error" icon={...} title="..." cta={{ label: 'Tentar novamente', onClick: refetch }} />
if (showSkeleton) return <SkeletonList />
if (!data?.length) return <EmptyState icon={...} title="..." cta={...} />
return <GroupList items={data} />
```

- Spinner em qualquer lugar é violação direta (FR-024 + SC-011).
- `EmptyState` é a primitiva de "vazio" e "erro" (variant=error). Não escrever vazios ad-hoc.

---

## Contrato 4 — Substituição de modais (FR-023)

| Fluxo legado (modal) | Substituto correto |
|----------------------|---------------------|
| Modal "Criar grupo" | **Rota** `/groups/new` |
| Modal "Convidar membro" | **Rota** `/groups/[id]/invite` |
| Modal "Detalhes do membro" | **BottomSheet** (com fallback opcional `/groups/[id]/members/[memberId]` para deep-link) |
| Modal "Confirmar sorteio" | **ConfirmModal** (única exceção permitida) |
| Modal "Confirmar exclusão" | **ConfirmModal** |
| Toast de sucesso/erro | **Toast** existente (não é modal) |

Outros padrões (full-page overlay sem URL, expansão inline) NÃO são permitidos como substituto.

---

## Contrato 5 — Navegação (Q1 + Q5)

- Toda página em `(protected)` é renderizada **dentro** de `<AppShell>` (já fornecido pelo `(protected)/layout.tsx`).
- Nenhuma página redefine sua própria navegação.
- A `BottomTabBar` é fixa: **Grupos** + **Perfil**. Não adicionar tabs por feature.
- "Sair" vive na página `/profile` como botão pill secundário.

---

## Contrato 6 — Tipografia (FR-010, FR-011)

- Toda página/componente herda `font-sans` do `<html>`.
- Títulos usam `font-title` (mesma família, peso 700).
- Rótulos de botão e tabs usam `uppercase` + `tracking-btn` (configurado para 0.1em ≈ 1.4–2px).
- Pesos permitidos: 400, 600, 700. Outros (300, 500, 800) são proibidos.

---

## Contrato 7 — Acessibilidade (FR-014–FR-016)

- Todo elemento interativo (`button`, `a`, `input`, `[tabIndex]`) ganha `:focus-visible` automaticamente via regra global.
- Ícones decorativos: `aria-hidden="true"` (default do `<Icon>`).
- Ícones funcionais (sem label de texto): `aria-label` obrigatório, `aria-hidden="false"`.
- Contraste verificado antes de cada PR (axe ou DevTools) em telas representativas.

---

## Contrato 8 — Composição de classes

- Sempre usar `cn(...)` para classes condicionais (`lib/cn.ts`).
- String concatenation manual ou ternários longos não são permitidos:
  ```tsx
  // ❌
  className={`base ${isActive ? 'text-mg-green' : 'text-mg-text-muted'} ${className ?? ''}`}
  // ✅
  className={cn('base', isActive ? 'text-mg-green' : 'text-mg-text-muted', className)}
  ```

---

## Contrato 9 — Testes

- Asserções em testes não citam classes Tailwind (`expect(...).toHaveClass('bg-mg-green')` é proibido).
- Asserções devem ser por **comportamento** (`getByRole('button', { name: /confirmar/i })`) ou por **estado semântico** (`aria-current`, `aria-invalid`, `aria-disabled`).
- Snapshots HTML completos não são permitidos — testes devem ser granulares por intenção.

---

## Contrato 10 — Estrutura de arquivo por componente

```
components/ui/<Name>/
├── <Name>.tsx
├── <Name>.test.tsx
└── index.ts        # re-export
```

Diretórios `__tests__/` ou `tests/` separados não são permitidos (Constituição II).
