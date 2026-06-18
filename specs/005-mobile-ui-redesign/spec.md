# Especificação da Funcionalidade: Redesenho Mobile-first com Design System Inspirado no Spotify

**Branch da Funcionalidade**: `005-mobile-ui-redesign`
**Criado**: 2026-06-16
**Status**: Rascunho
**Entrada**: Descrição do usuário: "Preciso refatorar toda a interface gráfica do projeto preservando todas as funcionalidades atuais. A ideia é sair do bootstrap e do admin-lte e construir uma interface moderna que se assemelhe a um app de celular, simples e direto, sem essas mecânicas de admin/dashboard porque não vi muito valor. Também preciso atualizar todo o design system do projeto. As instruções para isso estão no arquivo DESIGN.MD na raiz do projeto; tudo que está lá deve ser estritamente respeitado, sempre, sem exceções. Atualize a constituição do projeto, o claude MD e quaisquer arquivos de contexto para refletir essas mudanças. Mais uma coisa: daqui pra frente todas as SPECs devem ser geradas em pt-br, sem exceção, por mais que os scripts estejam otimizados para o inglês."

## Clarifications

### Sessão 2026-06-17

- Q: Qual padrão de navegação app-like consumir nos diferentes breakpoints? → A: Bottom tab bar persistente em todas as larguras, com conteúdo centralizado e largura máxima no desktop (composição de destinos definida em Q5).
- Q: Qual padrão default substitui modais não-confirmatórios? → A: Híbrido — rota dedicada para fluxos com múltiplos passos ou formulários (criação de grupo, convite, edição); bottom sheet deslizante para visualização rápida de detalhes (ex.: detalhes de membro).
- Q: Qual estratégia de carregamento para Manrope e Noto Sans? → A: `next/font/google` — Next.js baixa as fontes em build time e auto-self-hospeda no próprio domínio, sem requisições externas em runtime.
- Q: Qual padrão visual representa estados vazios (lista sem itens, busca sem resultados)? → A: Componente compartilhado `EmptyState` com ícone, mensagem curta em pt-BR e CTA contextual; mesma estrutura em todos os contextos.
- Q: Como "Sair" se posiciona na bottom tab bar para evitar toques acidentais? → A: "Sair" NÃO é um tab da bottom bar; vira ação dentro da página de Perfil (botão pill secundário). A bottom tab bar fica com apenas **Grupos** e **Perfil**.

## Cenários do Usuário & Testes *(obrigatório)*

### História do Usuário 1 — Nova Fundação Visual em Todas as Telas (Prioridade: P1)

Como usuário do Mystery Gifter, quando eu acessar qualquer tela do produto (landing pública, login, cadastro ou áreas autenticadas), quero ter uma experiência visual coerente e moderna no estilo "app de celular", com fundo escuro imersivo, botões em formato pill, tipografia compacta e o verde Spotify como único acento de marca, para que o produto pareça polido, focado em conteúdo e direto ao ponto — em contraste com o visual atual de painel administrativo.

**Por que esta prioridade**: A nova base visual condiciona todo o restante da refatoração. Sem ela, nenhuma outra tela pode ser migrada de forma consistente. Esta história precisa ser entregue primeiro porque define os tokens, primitivas e regras que as demais histórias consomem. Ao mesmo tempo, é independentemente testável: ao final dela, qualquer tela já existente passa a respirar a nova identidade, mesmo que algumas refinements específicas venham depois.

**Teste Independente**: Pode ser totalmente testado abrindo qualquer rota do produto após o merge da história, conferindo que (1) nenhum estilo de Bootstrap 4 ou AdminLTE 3.2 está mais aplicado, (2) o fundo é o preto profundo definido no DESIGN.md, (3) botões, inputs e cartões assumem a geometria pill/circular e (4) o verde de marca aparece apenas em chamadas para ação e estados ativos.

**Cenários de Aceitação**:

1. **Dado** um visitante abrindo a landing pública, **Quando** a página carrega, **Então** o fundo é o preto profundo definido no DESIGN.md, a tipografia adota Manrope como família principal (títulos e UI) com Noto Sans cobrindo scripts globais e fallbacks de sistema, e nenhum componente visual herda mais classes de Bootstrap ou AdminLTE.
2. **Dado** um usuário em qualquer tela, **Quando** ele observa os botões primários, **Então** todos têm formato pill (raio entre 500px e 9999px) e os botões circulares de ação (ex.: play/sorteio) têm raio 50%.
3. **Dado** um usuário em qualquer tela, **Quando** ele observa os rótulos dos botões, **Então** os rótulos estão em maiúsculas com letter-spacing entre 1.4px e 2px conforme o DESIGN.md.
4. **Dado** um usuário em qualquer tela, **Quando** ele observa elementos elevados (modais, menus, cartões em hover), **Então** as sombras seguem os níveis de elevação descritos no DESIGN.md (`rgba(0,0,0,0.3)` para cartões e `rgba(0,0,0,0.5)` para diálogos).
5. **Dado** um usuário em qualquer tela, **Quando** ele observa o uso de cor, **Então** o verde de marca aparece exclusivamente em controles funcionais (botões primários, estado ativo da navegação, CTAs) e nunca como elemento decorativo.

---

### História do Usuário 2 — Navegação Estilo Aplicativo Substituindo o Painel Admin (Prioridade: P2)

Como usuário autenticado, quero navegar entre as áreas do produto (Grupos e Perfil) através de uma navegação simples, persistente e direta no estilo de um aplicativo mobile — sem sidebar colapsável, sem topo administrativo e sem o conceito de "dashboard" intermediário — e quero acessar a ação "Sair" de dentro do meu Perfil, para que eu consiga chegar a qualquer destino em um toque e ao mesmo tempo evite encerrar a sessão por toque acidental.

**Por que esta prioridade**: A remoção do painel administrativo (AdminLTE) é o que descaracteriza o produto como "ferramenta de gestão" e o aproxima de um aplicativo. Esta história entrega o esqueleto de navegação no qual todas as áreas autenticadas vão viver. Vem em P2 porque depende dos tokens de design da P1, mas precede as histórias de telas específicas (grupos, perfil) que consomem este chassi.

**Teste Independente**: Pode ser testado fazendo login e verificando que (1) não existe mais um layout de painel com sidebar/header administrativo, (2) há uma bottom tab bar persistente em todas as larguras de tela com apenas Grupos e Perfil como destinos, (3) ao acessar a aplicação logado o usuário cai diretamente na lista de grupos (não há mais a tela "dashboard" como hub intermediário), (4) a ação "Sair" está acessível como botão dentro da página de Perfil (não há tab "Sair"), e (5) a navegação se mantém funcional e legível em larguras de tela de 320px até desktop.

**Cenários de Aceitação**:

1. **Dado** um usuário autenticado, **Quando** ele acessa a aplicação logado, **Então** ele é levado diretamente à lista de grupos como tela inicial, sem passar por uma tela intermediária de "dashboard".
2. **Dado** um usuário autenticado em qualquer tela protegida, **Quando** ele observa a navegação, **Então** existe uma **bottom tab bar persistente em todas as larguras** com apenas dois destinos — **Grupos** e **Perfil** —, sem sidebar colapsável, topo administrativo, top app bar ou qualquer variação responsiva da primitiva de navegação.
3. **Dado** um usuário autenticado em qualquer tela protegida, **Quando** ele toca/clica em "Grupos" ou "Perfil" na bottom tab bar, **Então** a navegação acontece em um único toque, sem submenus.
4. **Dado** um usuário autenticado, **Quando** ele acessa a página de Perfil, **Então** encontra a ação "Sair" como botão dedicado na própria página (não há tab "Sair" na bottom bar) e o toque encerra a sessão diretamente — o posicionamento dentro de Perfil em si protege contra toques acidentais.
5. **Dado** um usuário autenticado, **Quando** ele acessa a aplicação em uma tela de 320px de largura, **Então** a navegação e o conteúdo permanecem legíveis, sem rolagem horizontal, e os alvos de toque atendem ao tamanho mínimo recomendado para uso com o dedo.
6. **Dado** um usuário que tenta acessar a URL antiga `/dashboard`, **Quando** a página carrega, **Então** ele recebe o tratamento padrão de rota inexistente do produto (a rota é completamente eliminada e não há mais nenhum link interno apontando para ela).

---

### História do Usuário 3 — Áreas Públicas Redesenhadas (Landing, Login, Cadastro) (Prioridade: P3)

Como visitante ou usuário em processo de autenticação, quero que as telas públicas (landing, login e cadastro) apresentem a mesma identidade mobile-first, escura e direta do restante do produto, para que minha primeira impressão seja consistente com a experiência autenticada.

**Por que esta prioridade**: As telas públicas são o ponto de entrada do produto e atualmente carregam estilos de Bootstrap específicos da landing (gradiente roxo, hero glassmorphism). Migrá-las consolida a nova identidade visual em todo o funil de aquisição. Vem em P3 porque pode ser entregue de forma totalmente independente das áreas autenticadas e não bloqueia a P4/P5.

**Teste Independente**: Pode ser testado deslogando e visitando as rotas públicas (`/`, `/login`, `/register`), verificando que cada uma adota o fundo escuro, tipografia, geometria pill, formulários e CTAs do DESIGN.md, e que os fluxos funcionais (cadastro com auto-login, login com retorno por `returnUrl`, navegação para cadastro a partir do login) continuam idênticos aos atuais.

**Cenários de Aceitação**:

1. **Dado** um visitante, **Quando** ele acessa a landing pública, **Então** vê uma hero direta com proposta de valor, CTAs em formato pill seguindo o DESIGN.md, e nenhum vestígio do gradiente roxo/glassmorphism atual.
2. **Dado** um visitante na landing, **Quando** ele clica no CTA de "Cadastrar" ou "Entrar", **Então** é levado para a tela correspondente já com a nova identidade visual aplicada.
3. **Dado** um visitante na tela de cadastro, **Quando** ele preenche o formulário e envia, **Então** o fluxo de auto-login após cadastro segue exatamente como hoje (cadastro + login automático).
4. **Dado** um visitante na tela de login, **Quando** o login é bem-sucedido com `returnUrl` na query string, **Então** o redirecionamento para a URL de retorno acontece como hoje.
5. **Dado** um visitante em qualquer tela pública, **Quando** ele tenta navegar via teclado, **Então** o anel de foco visível segue o padrão do DESIGN.md.

---

### História do Usuário 4 — Lista, Detalhe e Ações de Grupos Redesenhados (Prioridade: P4)

Como usuário autenticado, quero gerenciar meus grupos (listar, buscar, filtrar por status, criar, ver detalhes, convidar membros, ver lista de membros, sortear) através de telas no novo padrão visual e de interação app-like, para que a experiência principal do produto reflita a nova identidade.

**Por que esta prioridade**: Os grupos são a função central do produto. Esta história abrange a maior superfície de UI a ser migrada (lista com filtros, cartões, modais de criação, detalhe, lista de membros, sorteio, convite). Vem em P4 porque depende do chassi de navegação (P2) e da fundação visual (P1).

**Teste Independente**: Pode ser testado por um usuário autenticado percorrendo todos os fluxos de grupos — listar com busca por nome (com debounce), filtros multiselect por status, ordenação, criar novo grupo, abrir detalhe de um grupo, convidar membros, ver lista de membros, ver detalhes de um membro, executar o sorteio — confirmando que cada interação preserva o comportamento funcional atual, que o visual segue integralmente o DESIGN.md, e que nenhuma dessas ações (exceto confirmações destrutivas/críticas como confirmar sorteio ou remover algo) é apresentada em modal.

**Cenários de Aceitação**:

1. **Dado** um usuário autenticado na lista de grupos, **Quando** a lista carrega, **Então** cada cartão segue o padrão de cartão escuro do DESIGN.md (fundo conforme camada de superfície, raio entre 6px e 8px, sombra em hover) e exibe contagem de membros e indicador de propriedade como hoje.
2. **Dado** um usuário na lista de grupos, **Quando** ele utiliza a busca por nome (com debounce) e o filtro multiselect de status, **Então** o comportamento funcional é idêntico ao atual, com os controles seguindo as primitivas do DESIGN.md (input pill, chips/pills para status).
3. **Dado** um usuário autenticado na lista de grupos, **Quando** ele clica em "Criar grupo", **Então** a criação acontece em uma **rota dedicada** (URL própria, com suporte a back do navegador) com o mesmo formulário e validações de hoje.
4. **Dado** um usuário no detalhe de um grupo, **Quando** ele convida um membro (fluxo com formulário e múltiplos passos), **Então** a ação abre em uma **rota dedicada**; **Quando** ele apenas visualiza rapidamente os detalhes de um membro (leitura), **Então** o conteúdo aparece em uma **bottom sheet**; em ambos os casos os comportamentos funcionais permanecem idênticos aos atuais e o visual segue o DESIGN.md.
5. **Dado** um usuário no detalhe de um grupo, **Quando** ele observa o botão de sortear, **Então** este aparece como controle circular ou pill conforme a geometria do DESIGN.md, sem retórica administrativa.
6. **Dado** um usuário que aciona uma ação destrutiva ou irreversível (ex.: confirmar sorteio, excluir item), **Quando** o sistema precisa confirmar a intenção, **Então** um modal de confirmação é usado, e exclusivamente nesse caso, seguindo o padrão de diálogo do DESIGN.md (sombra `rgba(0,0,0,0.5) 0px 8px 24px`, fundo de superfície).
7. **Dado** um usuário em qualquer tela que esteja carregando dados (lista de grupos, detalhe de grupo, lista de membros, perfil, busca/filtragem), **Quando** os dados ainda não chegaram, **Então** o estado de carregamento é apresentado como skeleton (placeholder com a forma final do conteúdo), nunca como spinner.

---

### História do Usuário 5 — Perfil Redesenhado e Fluxo de Convite (Prioridade: P5)

Como usuário autenticado, quero acessar minha página de perfil e a página de aceitar convite com a nova identidade visual, para que toda a área autenticada esteja coerente.

**Por que esta prioridade**: Perfil e fluxo de convite são telas mais simples e com menor uso do que grupos, por isso ficam por último. Não bloqueiam nenhuma outra história e podem ser entregues em paralelo com a P4 se houver capacidade.

**Teste Independente**: Pode ser testado por um usuário autenticado abrindo a página de perfil e visualizando seus dados (nome, sobrenome, e-mail, data de criação), e por um usuário acessando uma URL de convite válida e confirmando que a tela é apresentada na nova identidade visual, com o fluxo de aceite/redirecionamento funcionando como hoje.

**Cenários de Aceitação**:

1. **Dado** um usuário autenticado, **Quando** ele abre a página de perfil, **Então** seus dados (nome, sobrenome, e-mail, data de criação da conta) aparecem em uma tela no novo padrão app-like, sem mecânicas de painel administrativo, e a ação "Sair" aparece como botão dedicado na própria página de Perfil.
2. **Dado** um usuário (autenticado ou não), **Quando** ele abre uma URL de convite, **Então** a página segue a nova identidade visual e o fluxo funcional (aceite com login obrigatório, redirecionamento via `returnUrl`) permanece idêntico ao atual.

---

### História do Usuário 6 — Governança Atualizada (Constituição, CLAUDE.md, Contextos) (Prioridade: P6)

Como membro da equipe (humano ou agente), quero que a constituição do projeto, o `CLAUDE.md` e os demais arquivos de contexto reflitam o novo design system, a remoção de Bootstrap/AdminLTE, o padrão de UX estilo aplicativo e a adoção do português brasileiro como idioma oficial das specs, para que toda a documentação de governança esteja alinhada à nova realidade do produto a partir do merge desta funcionalidade.

**Por que esta prioridade**: A governança deve refletir o estado real do projeto, mas só faz sentido atualizá-la depois de fechar o escopo do redesenho. Vem por último para garantir que o texto de governança não desencontre do código entregue.

**Teste Independente**: Pode ser testado lendo a constituição, o `CLAUDE.md` e os arquivos de contexto após o merge e confirmando que (1) referências a Bootstrap 4 e AdminLTE 3.2 como base de design foram removidas, (2) o novo design system referenciado pelo DESIGN.md é o padrão obrigatório, (3) a política de idioma das specs aponta para pt-BR e (4) o estilo de UI exigido descreve a abordagem mobile-first sem mecânicas administrativas.

**Cenários de Aceitação**:

1. **Dado** um leitor da constituição do projeto, **Quando** ele procura por menções a Bootstrap 4 e AdminLTE 3.2 como fundação visual, **Então** essas menções foram substituídas pela referência ao DESIGN.md e ao token namespace atual.
2. **Dado** um leitor da constituição, **Quando** ele consulta a política de idioma de specs/checklists/planos, **Então** o texto exige português brasileiro (pt-BR) como idioma oficial para todos os artefatos de speckit a partir desta data.
3. **Dado** um leitor do `CLAUDE.md`, **Quando** ele consulta o resumo do stack visual e o style guide, **Então** o conteúdo descreve a nova fundação (DESIGN.md, geometria pill, paleta escura, ausência de Bootstrap/AdminLTE) e remove as instruções obsoletas.
4. **Dado** qualquer arquivo de contexto do projeto que mencione Bootstrap 4 ou AdminLTE 3.2 como dependências de UI, **Quando** ele é lido após o merge, **Então** essa menção foi removida ou atualizada para refletir o estado real.

---

### Casos de Borda

- **Conteúdo de usuário muito longo** (nomes de grupo extensos, listas com dezenas de membros): cartões e listas devem truncar com elipse ou rolar de forma consistente com a densidade compacta proposta pelo DESIGN.md, sem quebrar o leiaute app-like.
- **Conexão lenta**: todo estado de carregamento DEVE ser apresentado como skeleton (placeholder com a forma final do conteúdo) seguindo a paleta escura; spinners não são permitidos em nenhuma tela; o verde de marca só pode aparecer em indicadores funcionais e nunca como retorno ao visual padrão de Bootstrap durante a transição.
- **Preferência do sistema por modo claro**: o produto permanece sempre em modo escuro, ignorando `prefers-color-scheme: light`, conforme já estabelecido no DESIGN.md.
- **Preferência do sistema por movimento reduzido**: animações e transições devem respeitar `prefers-reduced-motion`, mantendo a identidade visual mas suprimindo movimento.
- **Telas muito largas (>1280px)**: o conteúdo permanece app-like (largura máxima centralizada) em vez de se espalhar como dashboard; espaço extra fica como vazio escuro.
- **Telas muito estreitas (<360px)**: a navegação inferior e os formulários permanecem usáveis, sem rolagem horizontal.
- **Foco via teclado**: o anel de foco é tratado como estado funcional, não decorativo, e portanto pode adotar o verde de marca conforme orientado no DESIGN.md, sem violar a regra de "verde só em controles funcionais".
- **Estados de erro de formulário**: usar `--text-negative` (`#f3727f`) conforme DESIGN.md, e não a paleta vermelha anterior; mensagens permanecem em pt-BR.
- **Tokens semânticos não previstos no DESIGN.md** (ex.: success secundário): caso surja necessidade, devem ser adicionados como tokens novos no arquivo central de tema antes do uso, jamais codificados inline.
- **Reuso de marca anterior**: o roxo `#6B46C1` (`--mg-primary` atual) deve sair de todas as superfícies; nenhum vestígio do gradiente roxo da hero antiga deve permanecer.
- **Estados vazios sem CTA possível**: quando o contexto não comporta um CTA (ex.: usuário sem permissão para a ação de criação), o `EmptyState` é renderizado apenas com ícone e mensagem, omitindo o CTA — nunca substituído por outra primitiva.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: O produto DEVE ser refatorado para remover por completo as dependências visuais de Bootstrap 4.6 e AdminLTE 3.2, incluindo seus arquivos CSS/JS e quaisquer pacotes complementares (ex.: jQuery, popper.js) que existam exclusivamente para suportá-los.
- **FR-002**: Todas as superfícies visuais (telas públicas, autenticadas, modais, toasts, formulários, navegação) DEVEM seguir estritamente o DESIGN.md em todos os seus aspectos: paleta de cores, tipografia, geometria de componentes, sombras/elevação, densidade, princípios de Do/Don't e diretrizes de responsividade.
- **FR-003**: O produto DEVE preservar 100% das funcionalidades existentes antes da refatoração — cadastro com auto-login, login com `returnUrl`, listagem/busca/filtragem/ordenação de grupos, criação de grupo, detalhe de grupo, lista de membros, visualização de detalhes de membro, sorteio, convite por link, perfil do usuário, redirecionamento em 401, e todos os comportamentos cobertos pelos testes unitários atuais; o que muda é a apresentação (modais não-confirmatórios passam a ser rotas/páginas/painéis), não o comportamento.
- **FR-004**: O produto DEVE substituir o leiaute administrativo (sidebar + header AdminLTE) por uma **bottom tab bar persistente em todas as larguras de tela**, contendo apenas dois destinos — **Grupos** e **Perfil** —, com no máximo um toque para chegar a qualquer um deles, sem submenus, sem top app bar adicional e sem variação responsiva da primitiva de navegação. A ação "Sair" NÃO compõe a bottom tab bar; ela DEVE ser oferecida como botão dentro da página de Perfil. O conteúdo da rota corrente fica centralizado com largura máxima nas telas grandes (>1280px) em vez de se espalhar como painel.
- **FR-005**: Ao acessar a aplicação autenticado, o usuário DEVE cair diretamente na lista de grupos como tela inicial; a rota `/dashboard` DEVE ser completamente eliminada do produto (segmento removido do `app/`, sem redirecionamento) e nenhum link interno DEVE apontar mais para ela.
- **FR-006**: Todos os tokens visuais (cores, raios, espaçamentos, tipografia, sombras) DEVEM ser declarados nos arquivos de configuração de tema central do projeto — `tailwind.config.ts` (theme.extend) e/ou CSS custom properties em `src/app/globals.css` —, e nenhum valor de cor (hex/rgb/hsl), raio, sombra ou tamanho tipográfico DEVE aparecer hardcoded em outros arquivos da árvore `src/`.
- **FR-007**: Tokens de tema customizados DEVEM viver sob o **namespace `mg`** (ex.: `colors.mg.bg`, `colors.mg.green`, `--mg-bg`, `--mg-green`) para evitar colisão com tokens nativos do Tailwind. Classes utilitárias do projeto que **não venham do Tailwind** (componentes próprios em CSS, animações nomeadas, classes auxiliares em `globals.css`) DEVEM ser prefixadas com `mg-` (ex.: `mg-app-shell`, `mg-shimmer`).
- **FR-008**: O verde de marca (`#1ed760`) DEVE ser aplicado exclusivamente em controles funcionais (CTAs primários, estado ativo de navegação, botões de play/ação principal); seu uso decorativo é proibido.
- **FR-009**: Botões DEVEM seguir a geometria pill (raio 500px–9999px) ou circular (raio 50%) conforme o papel definido no DESIGN.md; botões retangulares "padrão Bootstrap" são proibidos.
- **FR-010**: Rótulos de botão de ação DEVEM ser apresentados em maiúsculas com letter-spacing entre 1.4px e 2px, conforme o DESIGN.md.
- **FR-011**: A tipografia DEVE adotar **Manrope** (variável, licença OFL) como família principal tanto para títulos quanto para UI, com **Noto Sans** (Arabic, Hebrew, Devanagari, CJK SC) cobrindo scripts não-latinos e fallback final para a pilha de sistema (`Helvetica Neue`, `Helvetica`, `Arial`, `sans-serif`). Esta pilha substitui formalmente SpotifyMixUI/CircularSp do DESIGN.md, preservando a intenção visual (geométrica, levemente humanista, terminais arredondados, suporte global) com fontes livres e self-hostáveis. Os pesos 400, 600 e 700 e os letter-spacings 1.4–2px do DESIGN.md DEVEM ser mantidos integralmente. As fontes DEVEM ser carregadas via `next/font/google` (baixadas em build time, auto-self-hospedadas no próprio domínio, sem requisições externas em runtime); o uso de `<link>` para CDN externo de fontes é proibido.
- **FR-012**: O produto DEVE manter o modo escuro obrigatório em todas as telas e ignorar a preferência do sistema por modo claro.
- **FR-013**: O produto DEVE respeitar `prefers-reduced-motion`, suprimindo animações e transições para usuários com essa preferência.
- **FR-014**: Todos os elementos interativos DEVEM exibir um anel de foco visível via `:focus-visible`, atendendo aos critérios de acessibilidade do DESIGN.md.
- **FR-015**: O contraste mínimo entre texto e fundo DEVE ser ≥ 4.5:1 em todas as combinações utilizadas (WCAG AA).
- **FR-016**: Elementos puramente decorativos DEVEM carregar `aria-hidden="true"` para que sejam invisíveis a leitores de tela.
- **FR-017**: Todos os textos visíveis ao usuário final DEVEM permanecer em português brasileiro (pt-BR), conforme já estabelecido no projeto.
- **FR-018**: Cada componente novo ou refatorado DEVE possuir teste unitário cobrindo renderização, comportamento interativo e ramificações condicionais, mantendo a cobertura mínima do projeto.
- **FR-019**: A constituição do projeto DEVE ser atualizada para (a) remover Bootstrap 4.6 e AdminLTE 3.2 como base de design, (b) referenciar o DESIGN.md como fonte única do style guide, (c) descrever a navegação app-like como padrão, (d) exigir que todos os artefatos de speckit (specs, checklists, planos, tasks) sejam redigidos em português brasileiro, e (e) atualizar a versão conforme a política semântica vigente.
- **FR-020**: O arquivo `CLAUDE.md` e quaisquer outros arquivos de contexto de agente (incluindo memórias persistentes referentes ao stack ou ao idioma de documentação) DEVEM ser atualizados para refletir a nova fundação visual, a remoção de Bootstrap/AdminLTE, a navegação app-like e a política de idioma pt-BR para specs.
- **FR-021**: A configuração de dependências do projeto (`package.json`) DEVE ser atualizada para remover as dependências `bootstrap`, `admin-lte`, `jquery`, `popper.js` (e quaisquer outras que sirvam exclusivamente a Bootstrap/AdminLTE), substituindo-as conforme necessário pelas dependências do novo padrão.
- **FR-022**: O produto DEVE ser usável em larguras de tela a partir de 320px sem rolagem horizontal e DEVE manter a estética app-like (largura máxima centralizada em vez de leiaute administrativo) em telas grandes (>1280px).
- **FR-023**: Modais (diálogos sobrepostos) DEVEM ser usados exclusivamente para confirmação de ações destrutivas, irreversíveis ou de alto impacto (ex.: confirmar sorteio, confirmar exclusão). Os demais fluxos que hoje usam modal DEVEM seguir o padrão híbrido: **rota dedicada** (URL própria) para fluxos com formulário ou múltiplos passos (ex.: criação de grupo, convite, edição) e **bottom sheet deslizante** para visualização rápida e read-only (ex.: detalhes de membro). Outras primitivas (full-page overlay sem URL, expansão inline) NÃO são permitidas como substitutas de modais.
- **FR-024**: Todos os estados de carregamento de dados, sem exceção, DEVEM ser apresentados como skeletons (placeholders com a forma final do conteúdo); o uso de spinners é proibido em qualquer tela, fluxo ou componente do produto.
- **FR-025**: Todo estado vazio (lista sem itens, busca sem resultados, lista de membros vazia, lista de convites vazia, etc.) DEVE ser representado pelo mesmo componente compartilhado `EmptyState`, contendo (a) um ícone seguindo a paleta escura, (b) uma mensagem curta em pt-BR descrevendo o que está vazio, e (c) um CTA contextual relevante à tela (ex.: "Criar grupo" na lista de grupos vazia, "Convidar membro" na lista de membros vazia, "Limpar filtros" em buscas sem resultados). Variações ad-hoc por tela (texto solto, ilustrações próprias, ausência de CTA) NÃO são permitidas.

### Entidades-Chave *(incluir se a funcionalidade envolve dados)*

Esta funcionalidade é primariamente visual e de governança; não introduz novas entidades de domínio nem altera os contratos de API existentes.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: 100% das rotas e telas existentes do produto (públicas e autenticadas) estão migradas para o novo padrão visual no momento do merge — nenhuma tela ainda usa Bootstrap 4 ou AdminLTE 3.2.
- **SC-002**: A análise estática do bundle final mostra 0 (zero) referências a CSS de Bootstrap 4.6 e a CSS/JS de AdminLTE 3.2 carregadas em qualquer rota, e o `package.json` não lista mais essas dependências.
- **SC-003**: 100% dos testes unitários existentes continuam passando após a refatoração, evidenciando preservação funcional; a cobertura mínima do projeto continua atendida.
- **SC-004**: 0 (zero) ocorrências de valores hex, rgb, hsl, raios, sombras ou tamanhos tipográficos hardcoded fora do arquivo central de tema, verificáveis por busca textual no `src/`.
- **SC-005**: Em telas de 320px de largura, todos os fluxos críticos (login, cadastro, lista de grupos, criação de grupo, detalhe de grupo, sorteio, perfil, aceite de convite) podem ser concluídos sem rolagem horizontal.
- **SC-006**: O contraste mínimo de 4.5:1 é atingido em 100% das combinações de texto/fundo nas telas migradas, verificável por ferramenta de auditoria de acessibilidade.
- **SC-007**: O número de telas intermediárias entre o login bem-sucedido e a função principal (lista de grupos) cai para zero — o usuário chega à função principal com no máximo um toque/clique a partir do login.
- **SC-008**: 100% dos botões e CTAs do produto utilizam geometria pill ou circular conforme o DESIGN.md, sem botões retangulares remanescentes.
- **SC-009**: A constituição, o `CLAUDE.md` e os demais arquivos de contexto do projeto não contêm mais menções a Bootstrap 4 ou AdminLTE 3.2 como base de design vigente após o merge.
- **SC-010**: A política de idioma da governança exige pt-BR para todos os artefatos de speckit a partir desta funcionalidade, e esta própria especificação serve como referência cumprindo a nova regra.
- **SC-011**: 0 (zero) ocorrências de spinners (CSS, SVG ou via biblioteca) remanescem no código do produto após o merge, verificáveis por busca textual no `src/`; 100% dos estados de carregamento estão implementados como skeletons.
- **SC-012**: 0 (zero) modais não-confirmatórios remanescem no produto após o merge; todo fluxo de criação ou convite que hoje usa modal está migrado para **rota dedicada** (URL própria), e toda visualização rápida read-only que hoje usa modal está migrada para **bottom sheet** — outras primitivas (full-page overlay sem URL, expansão inline) são proibidas.

## Premissas

- **PR-001**: O texto do DESIGN.md é tratado como contrato visual de mais alta prioridade; qualquer conflito entre o DESIGN.md e qualquer outro documento (constituição anterior, CLAUDE.md anterior, memórias) é resolvido em favor do DESIGN.md.
- **PR-002**: O verde Spotify (`#1ed760`) substitui formalmente o roxo `#6B46C1` como cor de marca do Mystery Gifter para fins de UI; isso representa uma mudança consciente de identidade aceita pelo solicitante ao homologar o DESIGN.md como referência.
- **PR-003**: As famílias proprietárias citadas no DESIGN.md (SpotifyMixUI/CircularSp) não estão disponíveis para uso público. O produto adota **Manrope** como herdeira espiritual (mesma intenção geométrica, levemente humanista, terminais arredondados, voltada para UI) cobrindo títulos e corpo, complementada por **Noto Sans** (Arabic, Hebrew, Devanagari, CJK SC) para os scripts globais previstos no DESIGN.md, e pela pilha de fallback de sistema. Esta escolha é considerada conforme ao DESIGN.md por preservar todas as suas propriedades observáveis (proporção, peso, letter-spacing, line-height, cobertura global) com fontes de licença OFL self-hospedáveis. O DESIGN.md será atualizado em paralelo na história de governança (P6) para registrar a nova pilha como padrão oficial.
- **PR-004**: O conceito de "dashboard" é removido por completo: a rota `/dashboard` é eliminada do produto (sem redirecionamento) e todos os links internos para essa rota DEVEM ser removidos ou apontados para a lista de grupos antes do merge.
- **PR-005**: A refatoração é executada como uma migração coordenada por história de usuário (P1 → P6); cada PR de história deixa o produto em estado consistente, mesmo que algumas telas só recebam refinements em histórias posteriores.
- **PR-006**: Os tokens semânticos listados no DESIGN.md (warning orange `#ffa42b`, announcement blue `#539df5`) são adotados como parte oficial da paleta do projeto, prontos para uso quando necessário.
- **PR-007**: A estética "app de celular" é aplicada em todas as larguras: em desktop o conteúdo permanece centralizado com largura máxima, em vez de se espalhar como painel administrativo.
- **PR-008**: As mensagens de erro semânticas adotam o vermelho `--text-negative` (`#f3727f`) definido no DESIGN.md, substituindo o `--mg-error` anterior.
- **PR-009**: O nome do prefixo de classes utilitárias (`mg-`) é mantido por familiaridade da equipe; o que muda é o conjunto de tokens subjacentes, não a convenção de nomeação.
- **PR-010**: Esta especificação inaugura a política de redigir todos os artefatos de speckit em pt-BR; a atualização correspondente da constituição e do `CLAUDE.md` é parte do escopo desta própria funcionalidade.
- **PR-011**: "Modal" neste documento significa um diálogo sobreposto bloqueante (overlay com backdrop) cuja única função legítima é capturar a confirmação explícita de uma ação destrutiva, irreversível ou de alto impacto; toasts, menus contextuais, popovers, tooltips, sheets e drawers NÃO são considerados modais para fins desta regra.
- **PR-012**: "Skeleton" significa um placeholder visual que reproduz a forma (blocos, linhas, cartões) do conteúdo final em tons da paleta escura, opcionalmente com animação sutil de shimmer respeitando `prefers-reduced-motion`; substitui completamente spinners em todas as telas, fluxos e componentes.
- **PR-013**: A biblioteca de ícones do produto migra de `@fortawesome/fontawesome-free` (instalada exclusivamente para suportar AdminLTE) para `lucide-react` — React-first, tree-shakeable, paleta line-art alinhada à estética achromatic do DESIGN.md, sem fontes web adicionais.
