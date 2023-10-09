import * as logger from "@utils/logger";
import { notifyUpdate } from "@utils/notifyUpdate";
import chalk from "chalk";
import { Command } from "commander";
import * as cliPkg from "../package.json";
import { create } from "./commands";

const createBunnyCli = new Command();

// create
createBunnyCli
  .name(chalk.bold(logger.bunnyGradient("create-bunny")))
  .description("Create a new Bunny project")
  .usage(`${chalk.bold("<project-directory>")} [options]`)
  .argument("[project-directory]")
  // @TODO: will do
  // .addOption(
  //   new Option(
  //     "-m, --package-manager <package-manager>",
  //     "Specify the package manager to use"
  //   ).choices(["npm", "yarn", "pnpm", "bun"])
  // )
  .option(
    "--skip-install",
    "Do not run a package manager install after creating the project",
    false
  )
  .option(
    "--skip-transforms",
    "Do not run any code transformation after creating the project",
    false
  )
  .option(
    "--bunny-version <version>",
    "Use a specific version of bunny (default: latest)"
  )
  .version(cliPkg.version, "-v, --version", "Output the current version")
  .helpOption("-h, --help", "Display help for command")
  .action(create);

createBunnyCli
  .parseAsync()
  .then(notifyUpdate)
  .catch(async (reason) => {
    logger.log();
    logger.error("Unexpected error. Please report it as a bug:");
    logger.log(reason);
    logger.log();
    await notifyUpdate();
    process.exit(1);
  });