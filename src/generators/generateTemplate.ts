import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

type GenerateOptions = {
  projectName: string;
  framework: string;
  projectSlug: string;
  language: string;
  tailwind: boolean;
  virtualEnv: boolean;
  celery: boolean;
  logger: boolean;
  docker: boolean;
  targetPath: string;
};

export async function generateTemplate(
  options: GenerateOptions
) {
  const templateName = options.framework === "react"
    ? `react-vite-${options.language}`
    : options.framework === "fastapi"
      ? "fastapi-py"
      : `express-${options.language}`;

  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const templateCandidates = [
    path.resolve(moduleDir, "../templates", templateName),
    path.resolve(moduleDir, "../../src/templates", templateName),
    path.resolve(process.cwd(), "src/templates", templateName)
  ];

  let templatePath: string | undefined;

  for (const candidate of templateCandidates) {
    if (await fs.pathExists(candidate)) {
      templatePath = candidate;
      break;
    }
  }

  if (!templatePath) {
    throw new Error(`Template not found: ${templateName}`);
  }

  if (await fs.pathExists(options.targetPath)) {
    throw new Error(`Target directory already exists: ${options.targetPath}`);
  }

  await fs.copy(templatePath, options.targetPath);

  const packageJsonPath = path.join(options.targetPath, "package.json");

  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = options.projectSlug;

    if (options.framework === "react" && options.tailwind) {
      packageJson.devDependencies = {
        ...(packageJson.devDependencies ?? {}),
        "@tailwindcss/vite": "^4.0.0",
        tailwindcss: "^4.0.0"
      };
    }

    packageJson.dependencies = {
      ...(packageJson.dependencies ?? {}),
      ...(options.framework === "react" ? { "react-router-dom": "^6.30.3" } : {})
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  if (options.framework === "react" && options.tailwind) {
    await fs.writeFile(
      path.join(options.targetPath, options.language === "js" ? "vite.config.js" : "vite.config.ts"),
      `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
`
    );

    await fs.writeFile(
      path.join(options.targetPath, "src/style.css"),
      `@import "tailwindcss";

:root {
  color-scheme: dark;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #e2e8f0;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.24), transparent 34%),
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 30%),
    linear-gradient(180deg, #020617 0%, #0f172a 100%);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
}

body {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
  padding: clamp(1.5rem, 4vw, 4rem);
}

.app-shell-grid,
.shell-sidebar,
.shell-content,
.shell-card,
.info-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.56);
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px rgba(2, 6, 23, 0.45);
}

.app-shell-grid {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  gap: 2rem;
  min-height: calc(100vh - 6rem);
  align-items: stretch;
  border-radius: 36px;
  padding: 1.5rem;
}

.shell-sidebar {
  display: grid;
  gap: 1.5rem;
  align-content: start;
  padding: 1.5rem;
  border-radius: 28px;
}

.shell-content {
  border-radius: 28px;
  padding: 1.5rem;
}

.shell-card {
  border-radius: 24px;
  padding: clamp(2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #bae6fd;
}

.shell-brand {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.1;
  color: #f8fafc;
}

.shell-copy {
  margin: 0;
  color: #cbd5e1;
}

.shell-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.info-card {
  display: grid;
  gap: 0.35rem;
  padding: 1.25rem;
  border-radius: 20px;
}

.info-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.info-value {
  font-size: 1rem;
  color: #f8fafc;
}

.badge {
  width: fit-content;
  margin: 0 0 1.25rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  background: rgba(14, 165, 233, 0.12);
  color: #7dd3fc;
  font-size: 0.875rem;
}

.hero-title {
  margin: 0;
  max-width: 12ch;
  font-size: clamp(2.75rem, 6vw, 5.5rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: #f8fafc;
}

.lead {
  max-width: 58ch;
  margin: 1.5rem 0 0;
  font-size: 1.05rem;
  color: #cbd5e1;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  margin-top: 2rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
}

.button-primary {
  background: linear-gradient(135deg, #67e8f9, #38bdf8);
  color: #082f49;
}

.button-secondary {
  border-color: rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.45);
}

.mini-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.panel-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.panel-row:last-child {
  border-bottom: 0;
}

.panel-row span {
  color: #94a3b8;
}

.panel-row strong {
  color: #f8fafc;
}

@media (max-width: 900px) {
  .app-shell-grid {
    grid-template-columns: 1fr;
  }

  .mini-grid {
    grid-template-columns: 1fr;
  }
}
`
    );
  }

  if (options.docker) {
    if (options.framework === "fastapi") {
      await fs.writeFile(
        path.join(options.targetPath, "Dockerfile"),
        `FROM python:3.12-slim AS builder

WORKDIR /app

ENV VENV_PATH=/opt/venv
RUN python -m venv $VENV_PATH
ENV PATH="$VENV_PATH/bin:$PATH"

COPY requirements.txt requirements-dev.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt -r requirements-dev.txt

FROM python:3.12-slim AS runtime

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

COPY --from=builder /opt/venv /opt/venv
COPY app ./app
COPY .env.example ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
`
      );
    } else {
      await fs.writeFile(
        path.join(options.targetPath, "Dockerfile"),
        `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`
      );
    }
  }

  if (options.framework === "fastapi") {
    if (!options.logger) {
      await fs.remove(path.join(options.targetPath, "app/core/logging.py"));
    }

    if (!options.celery) {
      await fs.remove(path.join(options.targetPath, "app/worker/celery_app.py"));
      await fs.remove(path.join(options.targetPath, "app/worker/tasks.py"));
      await fs.remove(path.join(options.targetPath, "docker-compose.yml"));
    }

    if (options.virtualEnv) {
      await fs.writeFile(
        path.join(options.targetPath, ".python-version"),
        "3.12\n"
      );
    }

    if (options.celery) {
      await fs.writeFile(
        path.join(options.targetPath, "docker-compose.yml"),
        `services:
  api:
    build:
      context: .
      target: runtime
    ports:
      - "8000:8000"
    env_file:
      - .env.example
    depends_on:
      - redis

  worker:
    build:
      context: .
      target: runtime
    command: celery -A app.worker.celery_app.celery_app worker --loglevel=info
    env_file:
      - .env.example
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
`
      );
    }

    if (options.logger) {
      await fs.writeFile(
        path.join(options.targetPath, "app/core/logging.py"),
        `import logging

import structlog

def configure_logging() -> None:
    logging.basicConfig(
        format="%(message)s",
        level=logging.INFO,
    )

    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )
`
      );
    }

    if (options.celery) {
      await fs.writeFile(
        path.join(options.targetPath, "app/worker/celery_app.py"),
        `from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "forge_fastapi",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.task_routes = {
    "app.worker.tasks.send_welcome_email": {"queue": "default"},
}
`
      );

      await fs.writeFile(
        path.join(options.targetPath, "app/worker/tasks.py"),
        `from app.worker.celery_app import celery_app

@celery_app.task(name="app.worker.tasks.send_welcome_email")
def send_welcome_email(email: str) -> str:
    return f"queued welcome email for {email}"
`
      );
    }

  }

  const readme = options.framework === "react"
    ? [
        `# ${options.projectName}`,
        "",
        options.tailwind
          ? "React Vite starter with Tailwind CSS generated with Forge Stack."
          : "React Vite starter generated with Forge Stack.",
        "",
        "## Run",
        "",
        "```bash",
        `cd ${options.projectSlug}`,
        "npm install",
        "npm run dev",
        "```",
        "",
        "## Structure",
        "",
        `- \`src/App.${options.language === "js" ? "jsx" : "tsx"}\` for the main app shell`,
        "- `src/style.css` for global styles",
        `- \`vite.config.${options.language === "js" ? "js" : "ts"}\` for Vite configuration`,
        "",
        "## Scripts",
        "",
        "- `npm run dev`",
        "- `npm run build`",
        "- `npm run start`",
        "",
        `Language: ${options.language}`,
        `Tailwind: ${options.tailwind}`,
        `Docker: ${options.docker}`
      ].join("\n")
    : options.framework === "fastapi"
      ? [
          `# ${options.projectName}`,
          "",
          "Enterprise FastAPI starter generated with Forge Stack.",
          "",
          "## Run",
          "",
          "```bash",
          `cd ${options.projectSlug}`,
          ...(options.virtualEnv ? ["python3 -m venv .venv"] : []),
          options.virtualEnv
            ? ".venv/bin/python -m pip install -r requirements.txt -r requirements-dev.txt"
            : "python3 -m pip install -r requirements.txt -r requirements-dev.txt",
          options.virtualEnv
            ? ".venv/bin/python -m uvicorn app.main:app --reload"
            : "python3 -m uvicorn app.main:app --reload",
          options.virtualEnv
            ? ".venv/bin/python -m pytest"
            : "python3 -m pytest",
          ...(options.celery
            ? [
                options.virtualEnv
                  ? ".venv/bin/python -m celery -A app.worker.celery_app.celery_app worker --loglevel=info"
                  : "python3 -m celery -A app.worker.celery_app.celery_app worker --loglevel=info"
              ]
            : []),
          ...(options.docker ? ["docker compose up --build"] : []),
          "```",
        "",
          "## Features",
        "",
          `- Virtual environment: ${options.virtualEnv}`,
          `- Celery worker: ${options.celery}`,
          `- Structured logging: ${options.logger}`,
          `- Docker: ${options.docker}`,
          "",
          "## Layout",
          "",
          "- `app/main.py` FastAPI application entrypoint",
          "- `app/core` application settings and logging",
          "- `app/api/v1` versioned HTTP routes",
          "- `app/worker` Celery integration",
          "",
          "## Commands",
          "",
          ...(options.virtualEnv
            ? ["- `python3 -m venv .venv`"]
            : []),
          options.virtualEnv
            ? "- `.venv/bin/python -m pip install -r requirements.txt -r requirements-dev.txt`"
            : "- `python3 -m pip install -r requirements.txt -r requirements-dev.txt`",
          options.virtualEnv
            ? "- `.venv/bin/python -m uvicorn app.main:app --reload`"
            : "- `python3 -m uvicorn app.main:app --reload`",
          options.virtualEnv
            ? "- `.venv/bin/python -m pytest`"
            : "- `python3 -m pytest`",
          ...(options.celery
            ? [
                options.virtualEnv
                  ? "- `.venv/bin/python -m celery -A app.worker.celery_app.celery_app worker --loglevel=info`"
                  : "- `python3 -m celery -A app.worker.celery_app.celery_app worker --loglevel=info`"
              ]
            : []),
        "",
          "## Endpoints",
        "",
        "- `GET /health`",
          "- `GET /api/v1/health`",
          "",
          `Docker: ${options.docker}`
        ].join("\n")
    : [
        `# ${options.projectName}`,
        "",
        "Express.js + TypeScript modular monolith starter generated with Forge Stack.",
        "",
        "## Run",
        "",
        "```bash",
        `cd ${options.projectSlug}`,
        "npm install",
        "npm run dev",
        "```",
        "",
        "## Structure",
        "",
        "- `src/config` for runtime settings and environment validation",
        "- `src/modules` for feature-based vertical slices",
        "- `src/shared` for reusable middleware, errors, and routing",
        "",
        "## Included module",
        "",
        "- Health endpoint at `GET /api/v1/health`",
        "",
        "## Scripts",
        "",
        "- `npm run dev`",
        "- `npm run build`",
        "- `npm start`",
        "",
        `Language: ${options.language}`,
        `Docker: ${options.docker}`
      ].join("\n");

  await fs.writeFile(
    path.join(options.targetPath, "README.md"),
    readme
  );
}
