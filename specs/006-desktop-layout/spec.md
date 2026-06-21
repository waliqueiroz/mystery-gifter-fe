# Feature Specification: Layout Responsivo Desktop

**Feature Branch**: `006-desktop-layout`  
**Created**: 2026-06-20  
**Status**: Draft  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegação lateral persistente no desktop (Priority: P1)

Um usuário que acessa a aplicação em um computador ou monitor amplo atualmente vê a barra de navegação ancorada na parte inferior da tela — um padrão projetado para polegar em dispositivos móveis, que fica fora do lugar em telas largas. Nesta história, quando o usuário abre o app em uma tela desktop, ele encontra uma barra lateral de navegação permanente à esquerda, substituindo completamente a bottom tab bar. Os itens de navegação são os mesmos (Grupos e Perfil), e o item ativo é destacado com o verde de marca.

**Why this priority**: Sem a sidebar, toda a experiência desktop parece "quebrada" — o padrão de navegação contradiz a expectativa de quem usa o computador. Corrigir isso é o alicerce de qualquer melhoria de experiência desktop.

**Independent Test**: Pode ser testado abrindo a aplicação em uma janela com largura ≥896px e verificando que a bottom tab bar sumiu e uma sidebar com os links de navegação aparece à esquerda.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado em uma tela com largura ≥896px, **When** ele acessa qualquer página autenticada, **Then** ele vê uma barra lateral de navegação à esquerda com os itens Grupos e Perfil, sem a bottom tab bar visível.
2. **Given** um usuário autenticado na sidebar, **When** ele clica em "Grupos", **Then** é levado para a lista de grupos e o item "Grupos" na sidebar fica destacado com o verde de marca.
3. **Given** um usuário autenticado na sidebar, **When** ele clica em "Perfil", **Then** é levado para a página de perfil e o item "Perfil" na sidebar fica destacado com o verde de marca.
4. **Given** um usuário autenticado em uma tela com largura <896px, **When** ele acessa qualquer página autenticada, **Then** a bottom tab bar continua presente na base da tela, sem nenhuma mudança em relação ao layout atual.

---

### User Story 2 - Grade de grupos otimizada para desktop (Priority: P2)

Na tela desktop, a lista de grupos exibe os cartões em coluna única, o que desperdiça o espaço horizontal disponível. Quando um usuário tem muitos grupos, ele precisa rolar muito para visualizá-los. Nesta história, em telas desktop, os grupos são apresentados em uma grade com múltiplas colunas, permitindo que mais grupos sejam visíveis sem rolagem e melhorando o escaneamento visual.

**Why this priority**: A lista de grupos é a tela principal pós-login. Melhorar a densidade de informação nela impacta diretamente a usabilidade diária no desktop, logo após a navegação ser corrigida (P1).

**Independent Test**: Pode ser testado acessando a lista de grupos em uma tela com largura ≥1024px e verificando que os cartões são exibidos em pelo menos 2 colunas lado a lado.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado com vários grupos cadastrados em uma tela ≥1024px, **When** ele acessa a lista de grupos, **Then** os cartões de grupo são exibidos em grade com pelo menos 2 colunas.
2. **Given** a lista de grupos em tela desktop, **When** o usuário redimensiona a janela para <896px, **Then** os cartões voltam a ser exibidos em coluna única sem quebra visual.
3. **Given** a lista de grupos em tela desktop com filtros ativos, **When** os resultados são exibidos, **Then** os cartões filtrados mantêm o layout em grade.
4. **Given** a lista de grupos em tela desktop com estado de skeleton (carregando), **When** o loading está ativo, **Then** os skeletons também seguem o layout em grade.

---

### User Story 3 - Páginas de formulário e detalhe adequadas para desktop (Priority: P3)

Páginas como "Novo grupo", "Convidar membro" e "Detalhe do grupo" atualmente se esticam ou ficam estreitas de forma estranha em telas largas. O usuário desktop espera que formulários sejam centralizados com largura adequada para leitura, e que páginas de detalhe usem o espaço de forma inteligente sem que o conteúdo flutue em uma faixa estreita no centro de uma tela enorme.

**Why this priority**: Após a navegação (P1) e a lista principal (P2), as páginas secundárias completam a coerência visual no desktop. São menos frequentemente acessadas, justificando prioridade P3.

**Independent Test**: Pode ser testado abrindo a página "Novo grupo" em tela desktop e verificando que o formulário tem largura razoável, está centralizado e é visualmente equilibrado na tela.

**Acceptance Scenarios**:

1. **Given** um usuário em tela ≥1024px, **When** ele acessa a página "Novo grupo", **Then** o formulário é apresentado centralizado com largura máxima adequada para leitura, sem ocupar a tela toda.
2. **Given** um usuário em tela ≥1024px, **When** ele acessa o detalhe de um grupo, **Then** o conteúdo é apresentado em coluna única centralizada com largura máxima maior que o mobile, mantendo a mesma hierarquia vertical.
3. **Given** um usuário em tela ≥1024px, **When** ele acessa a página de perfil, **Then** o conteúdo é centralizado com espaçamento adequado.
4. **Given** qualquer página de formulário em tela desktop, **When** o usuário submete o formulário com sucesso, **Then** o fluxo de navegação pós-envio funciona normalmente.

---

### Edge Cases

- O que acontece quando o usuário redimensiona a janela em tempo real de mobile para desktop (e vice-versa)?
- Como a navegação se comporta em telas intermediárias (576–896px)?
- Como as páginas públicas (login, cadastro, aceite de convite) se comportam no desktop? A sidebar não aparece nelas (são telas sem autenticação), mas devem ser igualmente coerentes visualmente.
- O que acontece quando a lista de grupos está vazia ou em estado de erro no layout em grade?
- Como a sidebar se comporta quando há apenas 1 item de grupo na lista (grade com célula solitária)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A interface DEVE exibir uma barra lateral de navegação permanente em telas com largura ≥896px ("Desktop Small" conforme DESIGN.md §8), substituindo completamente a bottom tab bar nessa faixa.
- **FR-002**: A bottom tab bar e o layout mobile DEVEM permanecer sem nenhuma alteração em telas com largura <896px.
- **FR-003**: A sidebar DEVE conter exatamente os mesmos itens de navegação da bottom tab bar atual: "Grupos" e "Perfil".
- **FR-004**: A sidebar DEVE indicar o item ativo visualmente usando o verde de marca do sistema de design (DESIGN.md §2), seguindo a mesma regra da bottom tab bar.
- **FR-005**: A sidebar DEVE exibir, na área superior, um ícone de presente seguido do nome "Mystery Gifter" em texto — padrão ícone + nome, sem depender de arquivo de logo externo.
- **FR-006**: A lista de grupos DEVE exibir os cartões em grade com pelo menos 2 colunas em telas ≥1024px.
- **FR-007**: A lista de grupos em grade DEVE manter o layout de grade durante estados de loading (skeleton), erro e vazio.
- **FR-008**: Páginas de formulário (novo grupo, convidar membro) DEVEM ser apresentadas com largura máxima definida e centralizadas na área de conteúdo em telas desktop.
- **FR-009**: O sistema de design (cores, tipografia, geometria de botões, sombras, tokens) definido no DESIGN.md DEVE ser aplicado consistentemente em todos os novos elementos de layout desktop.
- **FR-010**: A transição entre layouts mobile e desktop DEVE ser fluida e sem quebras visuais quando o usuário redimensiona a janela.
- **FR-011**: As páginas públicas (login, cadastro, aceite de convite) DEVEM apresentar o formulário centralizado com largura máxima definida em telas desktop — mesmo conteúdo do mobile, apenas centralizado na tela larga. Sem layout de duas colunas ou arte lateral.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários em telas com largura ≥896px veem a sidebar de navegação no lugar da bottom tab bar em 100% das páginas autenticadas.
- **SC-002**: Usuários em telas com largura <896px não percebem nenhuma alteração no layout ou comportamento — idêntico ao estado atual.
- **SC-003**: A lista de grupos exibe pelo menos 2 colunas de cartões em telas com largura ≥1024px.
- **SC-004**: Todas as páginas autenticadas e públicas são navegáveis e visualmente coerentes em resoluções entre 320px e 1920px, sem quebras ou elementos sobrepostos.
- **SC-005**: 100% dos testes existentes continuam passando após a implementação, sem regressões.
- **SC-006**: Nenhuma regra do DESIGN.md é violada na versão desktop: cores hardcoded fora dos tokens, botões não-pill, verde decorativo, etc.
- **SC-007**: A sidebar está acessível via teclado (navegação por Tab e Enter), com estados de foco visíveis seguindo o padrão de ring verde já existente.

## Clarifications

### Session 2026-06-20

- Q: O que deve aparecer no topo da sidebar como identidade da aplicação (FR-005)? → A: Ícone Gift + "Mystery Gifter" em texto (padrão ícone + nome)
- Q: Como as páginas públicas (login, cadastro, convite) devem se adaptar no desktop (FR-011)? → A: Formulário centralizado com largura máxima em card — sem layout de duas colunas
- Q: "Sair" deve aparecer na sidebar desktop ou permanecer somente na página de Perfil? → A: Permanece somente na página de Perfil — sem mudança na política atual
- Q: Como deve ser o layout da página de detalhe do grupo no desktop? → A: Coluna única centralizada com largura máxima maior que o mobile — mesma hierarquia vertical, mais espaço

## Assumptions

- A versão desktop usa o mesmo sistema de autenticação e fluxo de dados que a versão mobile — não há mudanças na camada de serviços.
- "Sair" permanece como botão dentro da página de Perfil, não sendo adicionado à sidebar, conforme decisão já estabelecida no design system.
- A sidebar não tem comportamento de colapso na versão inicial — ela é sempre visível e expandida em telas desktop. Um colapso de sidebar pode ser adicionado em feature futura se necessário.
- Telas intermediárias (768–896px, categoria "Tablet Large" do DESIGN.md) seguem o layout mobile (bottom tab bar), não o desktop. A transição ocorre apenas em ≥896px.
- A navegação entre mobile e desktop ao redimensionar não requer animações de transição — a troca de layout é instantânea via breakpoints CSS.
- O número de colunas da grade de grupos pode variar conforme a largura disponível após descontar a largura da sidebar (ex.: 2 colunas em Desktop Small, 3 em Large Desktop). O detalhamento de quantas colunas em cada breakpoint é decisão de implementação.
- As páginas públicas (login, cadastro, convite) não recebem sidebar — são páginas isoladas que precisam apenas de ajuste de max-width e centralização em desktop.
