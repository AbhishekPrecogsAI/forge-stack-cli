# Forge Stack v1

Production-grade starter project CLI.

## Features

- Commander.js CLI
- Interactive prompts
- Express TypeScript and JavaScript starter generation
- React Vite starter generation
- React Vite TypeScript and JavaScript templates
- React Router support in React templates
- Modular monolith folder structure
- Docker option
- Tailwind option for React
- Package manager selection
- Automatic dependency install
- Template-based architecture

## Run

```bash
npm install
npm run dev -- create
```

## Build

```bash
npm run build
npm link
forge-stack create
```

## Publish

```bash
npm publish
```

## Install

After publishing, users can install and run the CLI with:

```bash
npm install -g @abhisahani/forge-stack
forge-stack create
```

You can also use `npx`:

```bash
npx @abhisahani/forge-stack create
```

## Curl Install

If you want a curl-based installer, host `install.sh` in your repo and run:

```bash
curl -fsSL https://raw.githubusercontent.com/AbhishekPrecogsAI/forge-stack-cli/main/install.sh | bash
```

That script installs the latest published npm version of `@abhisahani/forge-stack`.
