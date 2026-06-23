# Feature Specification: Migração para Autenticação via Cookie HttpOnly

**Feature Branch**: `008-cookie-auth`
**Created**: 2026-06-22
**Status**: Draft
**Input**: O backend agora suporta autenticação via cookie httpOnly. Precisamos atualizar o frontend para deixar de salvar qualquer informação do usuário no localStorage, integrando o endpoint `/me` para obter dados do usuário autenticado e o endpoint `/logout` para encerrar a sessão.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login com Sessão Segura (Priority: P1)

Ao fazer login com e-mail e senha, o usuário tem sua sessão gerenciada de forma segura pelo servidor, sem armazenar credenciais ou tokens em mecanismos de armazenamento acessíveis ao código da página. O usuário pode fechar e reabrir o navegador e, enquanto a sessão for válida, permanece autenticado.

**Why this priority**: É o ponto de entrada de toda a autenticação. Sem isso, nenhuma outra user story pode ser testada e a migração não tem valor.

**Independent Test**: Pode ser testado fazendo login, inspecionando as ferramentas do browser para confirmar que nenhum dado de autenticação está no localStorage ou sessionStorage, e verificando que a navegação para áreas protegidas funciona normalmente.

**Acceptance Scenarios**:

1. **Given** o usuário não está autenticado, **When** informa e-mail e senha corretos e submete o formulário de login, **Then** é redirecionado para a área protegida e nenhuma informação de autenticação fica visível no localStorage ou sessionStorage do browser.
2. **Given** o usuário está autenticado, **When** recarrega qualquer página protegida, **Then** permanece autenticado sem precisar fazer login novamente.
3. **Given** o usuário está autenticado, **When** o servidor rejeita a sessão com erro de autenticação, **Then** é redirecionado para a tela de login e qualquer acesso à área protegida é bloqueado.
4. **Given** o usuário informou e-mail ou senha incorretos, **When** submete o formulário de login, **Then** visualiza mensagem de erro e permanece na tela de login.

---

### User Story 2 - Logout Completo e Seguro (Priority: P2)

Ao clicar em "Sair", o usuário encerra sua sessão de forma definitiva. Após o logout, ao tentar acessar qualquer página protegida, o usuário é redirecionado para o login.

**Why this priority**: Essencial para segurança. Sem logout funcional, usuários não conseguem encerrar sessão em dispositivos compartilhados, criando risco de acesso não autorizado.

**Independent Test**: Pode ser testado clicando em "Sair" na tela de perfil, tentando acessar uma rota protegida diretamente via URL e confirmando o redirecionamento para login.

**Acceptance Scenarios**:

1. **Given** o usuário está autenticado na tela de perfil, **When** clica em "Sair", **Then** é redirecionado para a tela de login.
2. **Given** o usuário fez logout, **When** tenta navegar diretamente para uma rota protegida, **Then** é redirecionado para o login sem acesso ao conteúdo.
3. **Given** o usuário fez logout, **When** usa o botão "Voltar" do browser para tentar acessar uma página protegida visitada anteriormente, **Then** é redirecionado para o login.

---

### User Story 3 - Verificação de Sessão via Servidor (Priority: P3)

Ao acessar o app (diretamente em URL protegida, após recarregar a página ou abrir nova aba), o app verifica com o servidor se a sessão do usuário ainda é válida antes de exibir o conteúdo protegido, sem depender de dados armazenados localmente no browser.

**Why this priority**: Garante que sessões expiradas ou revogadas no servidor sejam detectadas com precisão. Sem isso, um usuário com token removido do servidor poderia acessar a UI protegida por tempo indeterminado.

**Independent Test**: Pode ser testado acessando uma rota protegida com sessão expirada no servidor e confirmando o redirecionamento para login, sem depender do estado do localStorage.

**Acceptance Scenarios**:

1. **Given** o usuário possui sessão válida no servidor, **When** acessa diretamente uma URL protegida, **Then** o conteúdo da página é exibido sem redirecionamento.
2. **Given** a sessão do usuário expirou ou foi invalidada no servidor, **When** acessa qualquer página protegida, **Then** é redirecionado para o login.
3. **Given** o usuário não tem sessão ativa, **When** acessa a rota de login, **Then** permanece na tela de login (sem redirecionamento automático para área protegida).
4. **Given** o usuário tem sessão ativa, **When** acessa a rota de login diretamente via URL, **Then** é redirecionado para a área protegida.

---

### User Story 4 - Auto-login Pós-Cadastro (Priority: P4)

Após criar uma conta com sucesso, o usuário é automaticamente autenticado e redirecionado para a área protegida, sem precisar fazer login manualmente. Esse comportamento existia antes da migração e deve ser preservado.

**Why this priority**: Experiência de usuário existente que deve ser mantida após a migração. Sua ausência causaria regressão percebida pelos usuários.

**Independent Test**: Pode ser testado criando uma nova conta e confirmando o redirecionamento automático para a área protegida sem passar pela tela de login.

**Acceptance Scenarios**:

1. **Given** o usuário preenche o formulário de cadastro com dados válidos, **When** submete o formulário, **Then** é automaticamente autenticado e redirecionado para a área protegida sem exibir a tela de login.
2. **Given** o cadastro é concluído com sucesso, **When** o usuário acessa a rota de login via URL direta, **Then** é redirecionado para a área protegida (sessão já ativa).

---

### Edge Cases

- O que acontece com usuários que têm token antigo no localStorage de sessões anteriores à migração? O sistema deve ignorá-lo e tratar o usuário como não autenticado até que faça login novamente.
- O que acontece quando o cookie de sessão expira enquanto o usuário navega no app? A próxima requisição autenticada recebe erro de sessão inválida e o usuário é redirecionado para login.
- O que acontece se o usuário faz logout em uma aba enquanto outra aba está aberta? A outra aba continua exibindo conteúdo até a próxima requisição autenticada, quando então redireciona para login.
- O que acontece quando qualquer chamada autenticada retorna erro de sessão inválida em qualquer página? O usuário é redirecionado para login independentemente de onde está no app.
- O que acontece se o endpoint de verificação de sessão falhar por erro de rede durante o carregamento da página? O usuário deve ver um estado de erro informativo, sem ficar preso em loading infinito.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE autenticar os usuários exclusivamente por meio do mecanismo de sessão gerenciado pelo servidor, sem persistir credenciais, tokens ou qualquer dado de autenticação no localStorage, sessionStorage ou outros armazenamentos acessíveis ao script da página.
- **FR-002**: O sistema DEVE verificar a validade da sessão do usuário junto ao servidor ao carregar qualquer página protegida, sem depender de dados de autenticação armazenados localmente no browser.
- **FR-003**: O sistema DEVE redirecionar o usuário para a tela de login quando a sessão estiver ausente, expirada ou inválida, em qualquer ponto da navegação ou ao tentar acessar rotas protegidas.
- **FR-004**: O sistema DEVE permitir que o usuário encerre sua sessão de forma explícita por meio da ação "Sair", comunicando o encerramento ao servidor e bloqueando imediatamente o acesso a rotas protegidas.
- **FR-005**: O sistema DEVE recuperar os dados do perfil do usuário autenticado a partir do servidor, por meio do endpoint dedicado, sem depender de informações previamente armazenadas no browser.
- **FR-006**: O sistema DEVE preservar o comportamento de auto-login pós-cadastro: o usuário recém-cadastrado deve ser autenticado e redirecionado para a área protegida sem interação adicional.
- **FR-007**: O sistema DEVE redirecionar o usuário para login quando qualquer chamada autenticada retornar erro de sessão inválida ou expirada, independentemente da página em que o usuário estiver.
- **FR-008**: O sistema DEVE remover toda leitura e escrita de informações de autenticação no armazenamento local do browser.

### Key Entities

- **Sessão de Usuário**: Representa o estado autenticado do usuário, gerenciado integralmente pelo servidor e transmitido automaticamente pelo browser a cada requisição. Não tem representação persistida no armazenamento do browser.
- **Perfil do Usuário Autenticado**: Dados do usuário logado (nome, sobrenome, e-mail, identificador único) recuperados sob demanda a partir do servidor mediante verificação de sessão ativa. Inclui as informações necessárias para personalizar a interface (ex.: exibir nome na tela de perfil).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Após o login bem-sucedido, nenhuma informação de autenticação (token, identificador de usuário, dados de sessão) está presente no localStorage ou sessionStorage do browser.
- **SC-002**: Usuários com sessão válida no servidor conseguem navegar entre todas as rotas protegidas sem solicitações adicionais de login, independentemente de recarregar a página ou abrir novas abas.
- **SC-003**: 100% das tentativas de acesso a rotas protegidas sem sessão válida resultam em redirecionamento para a tela de login.
- **SC-004**: Após o logout, nenhuma rota protegida é acessível sem novo login, mesmo que o usuário use os botões de navegação do browser.
- **SC-005**: O fluxo completo de cadastro (auto-login), navegação em rotas protegidas e logout funciona sem erros visíveis ao usuário e sem regressão no comportamento percebido em relação à versão anterior.
- **SC-006**: Sessões expiradas ou revogadas no servidor são detectadas e o usuário é redirecionado para login na primeira requisição autenticada subsequente.

## Assumptions

- O backend está implantado com os endpoints `/login` (definindo cookie httpOnly), `/logout` e `/users/me` funcionando conforme a documentação da API.
- Todos os endpoints protegidos do backend aceitam autenticação via cookie httpOnly, além do Bearer token. O swagger atual lista apenas Bearer por retrocompatibilidade com clientes de API.
- Usuários com sessões baseadas em token no localStorage serão desconectados automaticamente ao acessar o app pela primeira vez após a migração — esse comportamento é aceitável e esperado.
- O cookie de sessão é gerenciado inteiramente pelo servidor (httpOnly, SameSite=Lax), tornando-o inacessível a scripts da página; esse é o comportamento desejado para segurança.
- O período de validade da sessão (expiração do cookie) é controlado pelo servidor; o frontend não precisa gerenciar expiração local.
- A migração cobre apenas o mecanismo de autenticação; o visual, os fluxos de UI e as funcionalidades de negócio permanecem inalterados.

## Dependencies

- Backend: `POST /api/v1/login` retornando cookie httpOnly `access_token` com SameSite=Lax (além do token no corpo da resposta).
- Backend: `POST /api/v1/logout` encerrando/limpando a sessão do servidor (retorna 204).
- Backend: `GET /api/v1/users/me` retornando dados do usuário autenticado via cookie.
- Backend: todos os endpoints protegidos aceitando o cookie de sessão como forma de autenticação.
