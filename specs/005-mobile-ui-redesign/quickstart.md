# Quickstart — 005-mobile-ui-redesign

**Data**: 2026-06-17

Guia rápido para rodar, testar e validar localmente o trabalho desta feature.

## Pré-requisitos

- Node.js LTS
- `npm install` na raiz (após o merge da P1, novas deps já estarão no `package.json`)
- Backend rodando em `http://localhost:8080` (ver `next.config.ts` rewrites)

## Instalação das novas dependências (executar na P1)

```bash
npm install -D tailwindcss postcss autoprefixer
npm install tailwind-merge clsx react-loading-skeleton lucide-react @radix-ui/react-dialog

npm uninstall bootstrap admin-lte jquery popper.js @fortawesome/fontawesome-free @types/jquery
```

A última linha só roda depois que todos os imports legados forem removidos (final da P5).

## Arquivos de configuração esperados após P1

- `tailwind.config.ts` — tokens do DESIGN.md em `theme.extend`
- `postcss.config.mjs` — plugins `tailwindcss` + `autoprefixer`
- `src/app/globals.css` — diretivas `@tailwind` + tokens CSS + reset/focus/reduced-motion
- `src/app/layout.tsx` — `next/font/google` para Manrope + Noto Sans, com variáveis CSS

## Rodar localmente

```bash
npm run dev       # http://localhost:3000
npm test          # Jest unit tests
npm run lint
npm run build     # verifica produção (gate de SC-002, SC-004)
```

## Como verificar critérios de sucesso localmente

| Critério | Verificação |
|----------|-------------|
| SC-002 (sem Bootstrap/AdminLTE no bundle) | `npm run build` + `grep -ri "bootstrap\|admin-lte\|jquery" .next` (esperado: 0 ocorrências em assets servidos) |
| SC-004 (sem valores hardcoded fora do tema) | `grep -RnE '#[0-9a-fA-F]{3,6}' src/ --include='*.tsx' --include='*.ts' \| grep -v 'globals.css\|tailwind.config' \| grep -v '^Binary'` (esperado: vazio) |
| SC-005 (320px sem rolagem horizontal) | DevTools → device toolbar → 320×640 → testar todos os fluxos críticos |
| SC-006 (contraste ≥ 4.5:1) | DevTools Accessibility panel ou axe em cada tela representativa |
| SC-008 (botões pill/circular) | `grep -RnE 'rounded(?!-pill|-card|-full)' src/components` (esperado: vazio) |
| SC-011 (sem spinners) | `grep -RinE 'spinner|loading-icon|fa-spin' src/` (esperado: vazio) |
| SC-012 (sem modais não-confirmatórios) | Auditar imports de `ConfirmModal` (único modal permitido) e ausência de qualquer outro componente "Modal" |

## Roteiro de teste manual por história

### P1 — Fundação visual
1. Após o merge de P1, acessar `/` deslogado e qualquer rota protegida.
2. Conferir paleta near-black, ausência de Bootstrap/AdminLTE, geometria pill, verde apenas em CTAs.

### P2 — Navegação
1. Logar.
2. Verificar bottom tab bar sempre visível com **Grupos** e **Perfil** apenas.
3. Acessar `/dashboard` → comportamento de rota inexistente (404 padrão).
4. Acessar página de Perfil → botão "Sair" funcional.

### P3 — Públicas
1. Acessar `/`, `/login`, `/register` deslogado.
2. Concluir cadastro completo (cadastro + auto-login).
3. Login com `returnUrl=/groups/abc` → redirecionar corretamente.

### P4 — Grupos
1. Em `/groups`, testar busca por nome (debounce ~300 ms), multiselect de status, ordenação.
2. Clicar "Criar grupo" → ir para `/groups/new` (URL nova, back funciona).
3. Em `/groups/[id]`, clicar em um membro → bottom sheet abre com detalhes.
4. Clicar "Convidar" → ir para `/groups/[id]/invite`.
5. Acionar sorteio → ConfirmModal aparece; confirmar.

### P5 — Perfil / Convite
1. Em `/profile`, ver dados; clicar "Sair" e confirmar redirecionamento.
2. Acessar uma URL de convite válida (`/invite/<token>`) deslogado e logado.

### P6 — Governança
1. Ler `.specify/memory/constitution.md` → versão 2.0.0, sem menções a Bootstrap/AdminLTE como base, política pt-BR explícita.
2. Ler `CLAUDE.md` → nova stack documentada.
3. Ler `DESIGN.md` → Manrope/Noto Sans registrados como pilha oficial.
4. Ler `MEMORY.md` em `~/.claude/projects/.../memory/` → sem referências obsoletas.

## Solução de problemas comuns

- **Skeletons "piscam" em respostas rápidas** → conferir uso de `useDelayedFlag(loading, 150)` antes do render do skeleton.
- **Fonte não carrega em testes Jest** → verificar `__mocks__/next/font/google.ts` retornando objetos com `className`, `style`, `variable` vazios.
- **Bottom tab bar coberta pela home indicator no iOS** → conferir `pb-[env(safe-area-inset-bottom)]` no `AppShell`.
- **Botão verde aparece sem ser CTA** → revisar contrato 1 em `contracts/ui-primitives.md`; remover `bg-mg-green` de elementos não-funcionais.
