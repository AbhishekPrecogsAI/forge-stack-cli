import { execa } from "execa";

type InstallOptions = {
  framework: string;
  installer: string;
  cwd: string;
  virtualEnv?: boolean;
};

export async function installDependencies(
  options: InstallOptions
) {
  if (options.framework === "fastapi") {
    const pythonCommand = process.platform === "win32"
      ? "py"
      : "python3";

    const pythonArgs = process.platform === "win32"
      ? ["-3"]
      : [];

    if (options.virtualEnv) {
      await execa(pythonCommand, [...pythonArgs, "-m", "venv", ".venv"], {
        cwd: options.cwd,
        stdio: "inherit"
      });
    }

    const pythonExecutable = options.virtualEnv
      ? process.platform === "win32"
        ? ".venv\\Scripts\\python.exe"
        : ".venv/bin/python"
      : pythonCommand;
    const installArgs = options.virtualEnv
      ? ["-m", "pip", "install", "-r", "requirements.txt", "-r", "requirements-dev.txt"]
      : [...pythonArgs, "-m", "pip", "install", "-r", "requirements.txt", "-r", "requirements-dev.txt"];

    await execa(
      pythonExecutable,
      installArgs,
      {
      cwd: options.cwd,
      stdio: "inherit"
      }
    );

    return;
  }

  await execa(options.installer, ["install"], {
    cwd: options.cwd,
    stdio: "inherit"
  });
}
