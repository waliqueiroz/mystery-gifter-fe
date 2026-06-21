# Mystery Gifter — Frontend

Interface web do Mystery Gifter, um sistema de amigo secreto online.  
Backend: https://github.com/waliqueiroz/mystery-gifter-api

## Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Linguagem**: TypeScript 5
- **Estilização**: Tailwind CSS com tokens customizados
- **Testes**: Jest + React Testing Library
- **Ícones**: Lucide React | **Overlays**: Radix UI Dialog

## Pré-requisitos

- Node.js 22+
- npm 10+
- Backend rodando em `http://localhost:8080` (ver [repositório do backend](https://github.com/waliqueiroz/mystery-gifter-api))

## Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base do backend (usado pelo proxy Next.js) | `http://localhost:8080` |

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

## Rodando com Docker

```bash
docker compose up --build
```

Por padrão o container aponta para `http://host.docker.internal:8080` (o backend rodando no host). Para apontar para outra URL:

```bash
NEXT_PUBLIC_API_URL=http://meu-backend:8080 docker compose up --build
```

> **Linux**: descomente `extra_hosts` no `docker-compose.yml` para habilitar `host.docker.internal`.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm test` | Testes unitários |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run lint` | ESLint |
| `npm run type-check` | Verificação de tipos TypeScript |
| `npm run format` | Prettier |

## Licença

Apache 2.0 — veja [LICENSE](./LICENSE).
