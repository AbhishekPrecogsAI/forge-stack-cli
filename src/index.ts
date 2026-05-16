#!/usr/bin/env node

import { Command } from "commander";
import { createProject } from "./commands/create.js";

const program = new Command();

program
  .name("forge-stack")
  .description("Production-grade starter project generator")
  .version("1.1.0");

program
  .command("create")
  .description("Create a new project")
  .action(createProject);

program.parse();
