import * as p from "@clack/prompts";
import color from "picocolors";
import path from "path";

import { generateTemplate } from "../generators/generateTemplate.js";
import { installDependencies } from "../utils/installDependencies.js";

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function printNextSteps(options: {
  framework: string;
  language: string;
  packageManager: string;
  projectSlug: string;
  installDependenciesNow: boolean;
  tailwind: boolean;
  virtualEnv: boolean;
  celery: boolean;
  docker: boolean;
}) {
  const folder = options.projectSlug;
  const installCommand = options.framework === "fastapi"
    ? options.virtualEnv
      ? "python3 -m venv .venv && .venv/bin/python -m pip install -r requirements.txt -r requirements-dev.txt"
      : "python3 -m pip install -r requirements.txt -r requirements-dev.txt"
    : options.packageManager === "yarn"
      ? "yarn install"
      : options.packageManager === "pnpm"
        ? "pnpm install"
        : "npm install";

  const devCommand = options.framework === "fastapi"
    ? options.virtualEnv
      ? ".venv/bin/python -m uvicorn app.main:app --reload"
      : "python3 -m uvicorn app.main:app --reload"
    : options.packageManager === "yarn"
      ? "yarn dev"
      : options.packageManager === "pnpm"
        ? "pnpm dev"
        : "npm run dev";

  const buildCommand = options.framework === "fastapi"
    ? options.virtualEnv
      ? ".venv/bin/python -m pytest"
      : "python3 -m pytest"
    : options.packageManager === "yarn"
      ? "yarn build"
      : options.packageManager === "pnpm"
        ? "pnpm build"
        : "npm run build";

  console.log("");
  console.log(color.bold("Next steps"));
  console.log(color.bgCyan(color.black(` ${folder} `)));

  if (options.framework === "fastapi") {
    console.log(`cd ${folder}`);
    if (!options.installDependenciesNow) {
      console.log(installCommand);
    }
    console.log(devCommand);
    console.log(buildCommand);
    if (options.celery) {
      console.log(
        options.virtualEnv
          ? ".venv/bin/python -m celery -A app.worker.celery_app.celery_app worker --loglevel=info"
          : "python3 -m celery -A app.worker.celery_app.celery_app worker --loglevel=info"
      );
    }
    if (options.docker) {
      console.log("docker compose up --build");
    }
    return;
  }

  console.log(`cd ${folder}`);
  if (!options.installDependenciesNow) {
    console.log(installCommand);
  }
  console.log(devCommand);
  console.log(buildCommand);

  if (options.docker) {
    console.log("docker build -t forge-app .");
    console.log("docker run -p 3000:3000 forge-app");
  }

  if (options.framework === "react" && options.tailwind) {
    console.log("Tailwind is already wired into the Vite config.");
  }
}

export async function createProject() {
  try {
    console.clear();

    p.intro(color.bgCyan(color.black(" Forge Stack v1 ")));

    const projectNameInput = await p.text({
      message: "Project name?",
      placeholder: "my-app",
      validate(value) {
        if (!value) return "Project name is required";
      }
    });

  if (p.isCancel(projectNameInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const framework = await p.select({
    message: "Choose starter",
    options: [
      { value: "express", label: "Express API" },
      { value: "react", label: "React Vite" },
      { value: "fastapi", label: "FastAPI" }
    ]
  });

  if (p.isCancel(framework)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const frameworkValue = String(framework);
  const language = frameworkValue === "fastapi"
    ? "py"
    : await p.select({
        message: "Project language",
        options: [
          { value: "ts", label: "TypeScript" },
          { value: "js", label: "JavaScript" }
        ]
      });

  if (p.isCancel(language)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const tailwindInput = frameworkValue === "react"
    ? await p.confirm({
        message: "Add Tailwind CSS?"
      })
    : false;

  if (p.isCancel(tailwindInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const virtualEnvInput = frameworkValue === "fastapi"
    ? await p.confirm({
        message: "Create a virtual environment (.venv)?"
      })
    : false;

  if (p.isCancel(virtualEnvInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const celeryInput = frameworkValue === "fastapi"
    ? await p.confirm({
        message: "Add Celery worker?"
      })
    : false;

  if (p.isCancel(celeryInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const loggerInput = frameworkValue === "fastapi"
    ? await p.confirm({
        message: "Add structured logging?"
      })
    : false;

  if (p.isCancel(loggerInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const dockerInput = await p.confirm({
    message: "Add Docker support?"
  });

  if (p.isCancel(dockerInput)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const packageManager = frameworkValue === "fastapi"
    ? "pip"
    : await p.select({
        message: "Package manager",
        options: [
          { value: "npm", label: "npm" },
          { value: "pnpm", label: "pnpm" },
          { value: "yarn", label: "yarn" }
        ]
      });

  if (p.isCancel(packageManager)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const installDependenciesNow = await p.confirm({
    message: "Install dependencies now?"
  });

  if (p.isCancel(installDependenciesNow)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const spinner = p.spinner();

  spinner.start("Generating project...");

  const projectName = String(projectNameInput).trim();
  const projectSlug = toSlug(projectName) || "forge-project";
  const targetPath = path.join(process.cwd(), projectSlug);

  await generateTemplate({
    projectName,
    framework: frameworkValue,
    projectSlug,
    language: String(language),
    tailwind: Boolean(tailwindInput),
    virtualEnv: Boolean(virtualEnvInput),
    celery: Boolean(celeryInput),
    logger: Boolean(loggerInput),
    docker: Boolean(dockerInput),
    targetPath
  });

  spinner.stop("Project generated");

  if (installDependenciesNow) {
    spinner.start("Installing dependencies...");

    await installDependencies({
      framework: frameworkValue,
      cwd: targetPath,
      installer: String(packageManager),
      virtualEnv: Boolean(virtualEnvInput)
    });

    spinner.stop("Dependencies installed");
  }

    p.outro(color.green("Forge Stack completed successfully"));

    printNextSteps({
      framework: frameworkValue,
      language: String(language),
      packageManager: String(packageManager),
      projectSlug,
      installDependenciesNow: Boolean(installDependenciesNow),
      tailwind: Boolean(tailwindInput),
      virtualEnv: Boolean(virtualEnvInput),
      celery: Boolean(celeryInput),
      docker: Boolean(dockerInput)
    });
  } catch (error) {
    p.outro(color.red("Project creation failed"));
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}
