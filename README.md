# 🛡️ Core Libs

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
- **TypeScript** com **Project References**
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
├── tsconfig.json               # Referências entre os pacotes
└── README.md                   # Este arquivo
```

----

## 🚀 Scripts disponíveis

### 🔧 Limpar builds antigos
```bash
npm run clean:all
```
Remove as pastas `dist/` de todos os pacotes.

### 📇 Buildar todos os pacotes
```bash
npm run build:all
```
Compila os pacotes na ordem correta via `tsc -b` com `references`.

### 🚪 Gerar index.ts automaticamente (barrel)
```bash
npm run barrel
```
Gera um `index.ts` exportando tudo da pasta `src` automaticamente.

### 📦 Publicar todos os pacotes no GitHub Packages
```bash
npm run publish:all
```
Publica manualmente todos os pacotes.

Requer variável `NPM_TOKEN` com permissão de `write:packages`.

----

## 🔄 Versionamento com Changesets
Este monorepo utiliza `changesets` para versionar e publicar **apenas os pacotes alterados**.

### 1. Criar um changeset
```bash
npx changeset
```

### 2. Atualizar versões e changelogs
```bash
npm run version-packages
```

### 3. Commit e push
```bash
git add .
git commit -m "version bump via changeset"
git push origin main
```

O workflow de release detecta e publica os pacotes alterados.

---

## 🔐 Autenticação com GitHub Packages

`.npmrc` local ou no CI:
```ini
@splitwave-br:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Local:
```bash
export NPM_TOKEN=ghp_seu_token_aqui
```

CI/CD:
Configurar em:
```
Settings > Secrets and variables > Actions > New secret
```

---

## 📊 Desenvolvimento Híbrido (Project References + GitHub Packages)

Este monorepo segue uma abordagem híbrida que combina o melhor dos dois mundos:

- **Project References (tsc -b)** para desenvolvimento local
- **Importação de pacotes publicados** via GitHub Packages no ambiente de CI/CD

### 🔨 Durante o desenvolvimento local

Utilize Project References com `tsc -b` para compilar todos os pacotes interdependentes:

```bash
npx tsc -b
```

Ou, se preferir:

```bash
npm run build  # (recomendado)
```

Certifique-se de que:
- Cada `tsconfig.lib.json` possui `composite: true`, `include: ["src"]`, e `rootDir: "src"`
- O pacote dependente (`queue`) possui `references` corretas para os outros pacotes (`core`, `context-service`, etc.)
- Existe um `tsconfig.json` na raiz com:

```json
{
  "files": [],
  "references": [
    { "path": "packages/core" },
    { "path": "packages/context-service" },
    { "path": "packages/queue" },
    { "path": "packages/events" },
    { "path": "packages/health" },
    { "path": "packages/acquirers" }
  ]
}
```

### 🚢 Durante o CI/CD

No ambiente de pipeline (GitHub Actions), os pacotes são instalados diretamente via GitHub Packages:

- O arquivo `.npmrc` está configurado para consumir os pacotes publicados:

```ini
@splitwave-br:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

- Cada pacote define suas dependências como:

```json
"@splitwave-br/core": "^0.0.4"
```

- O `npm install` resolve os pacotes publicados, e o `build` é feito apenas do pacote desejado:

```yaml
- name: Install dependencies
  run: npm install

- name: Build queue
  run: npm run build --workspace=@splitwave-br/queue
```

### 🧹 Dica: limpar e rebuildar localmente

```bash
npm run clean:all && npm run build
```

Caso enfrente erros do tipo `TS6307`, `TS6059` ou relacionados a `rootDir`, execute:

```bash
rm -rf packages/*/dist packages/*/*.tsbuildinfo
npx tsc -b
```

---

Com isso, você garante produtividade no desenvolvimento e estabilidade na publicação ❤️

Se tiver dúvidas sobre como configurar seus `tsconfig` corretamente, veja os exemplos em `packages/*/tsconfig.lib.json` ou consulte a documentação oficial do [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html).

