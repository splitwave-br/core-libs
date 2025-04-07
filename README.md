# 🧱 Core Libs

Este repositório é um **monorepo** que centraliza as bibliotecas reutilizáveis do ecossistema Splitwave. Utiliza **Node.js workspaces** e segue um fluxo moderno de versionamento e publicação automatizada com [`changesets`](https://github.com/changesets/changesets).

---

## 📦 Pacotes

| Pacote                     | Descrição                             |
|---------------------------|----------------------------------------|
| `@splitwave-br/core`      | Entidades, enums e exceções base       |
| `@splitwave-br/queue`     | Lógica de filas, processors e jobs     |
| `@splitwave-br/context-service` | Contexto da requisição, tracing e ID's |
| `@splitwave-br/health`    | Verificações de health-check           |
| `@splitwave-br/events`    | Eventos de domínio                     |
| `@splitwave-br/acquirers` | Integrações com adquirentes            |

---

## 🛠️ Tecnologias e Ferramentas

- **Node.js Workspaces**
- **TypeScript**
- **NestJS**
- **Changesets** para versionamento e publicação
- **GitHub Packages** como repositório de pacotes
- **GitHub Actions** para CI/CD

---

## 📁 Estrutura do Projeto

```bash
core-libs/
├── .changeset/                 # Arquivos de controle do changeset
├── .github/workflows/          # Pipelines CI/CD
├── packages/                   # Todos os pacotes
│   ├── core/
│   ├── queue/
│   ├── context-service/
│   └── ...
├── package.json                # Root com scripts e workspaces
├── tsconfig.base.json          # Config TypeScript compartilhada
└── README.md                   # Este arquivo
```

----

🚀 Scripts disponíveis

🔧 Limpar builds antigos
```bash
npm run clean:all
```

Remove as pastas dist/ de todos os pacotes.


🏗️ Buildar todos os pacotes

```bash
npm run build:all
```

Builda todos os pacotes na ordem correta (queue, events, core, context-service, health, acquirers).

🧹 Gerar index.ts automaticamente (barrel)
```bash
npm run barrel
```
Executa o comando barrel para gerar um index.ts com exports automáticos da pasta src.

📦 Publicar todos os pacotes no GitHub Packages
```bash
npm run publish:all
```
Publica todos os pacotes manualmente, na ordem definida.

Requer variável de ambiente NPM_TOKEN configurada com permissão de write:packages.

----

🔁 Versionamento com Changesets
Este monorepo utiliza o Changesets para versionar e publicar apenas os pacotes alterados.

1. Criar um changeset
```bash
npx changeset
```

Escolha o(s) pacote(s) e o tipo de mudança (patch, minor, major).

2. Atualizar versões e changelogs
```bash
npm run version-packages
```
Gera os novos package.json e CHANGELOG.md.

3. Commit e push
```bash
git add .
git commit -m "version bump via changeset"
git push origin main
```
O workflow de release detecta e publica os pacotes com mudanças.

🔐 Autenticação com GitHub Packages
.npmrc (local ou em CI):

```ini
@splitwave-br:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Local:
export NPM_TOKEN=ghp_seu_token_aqui

CI/CD (GitHub Actions):
Configure NPM_TOKEN em:
Settings > Secrets and variables > Actions > New secret

----

📌 Requisitos
Node.js 18+

npm 8+ com suporte a workspaces

----

📝 Licença
Privado — uso exclusivo Splitwave. Todos os direitos reservados.