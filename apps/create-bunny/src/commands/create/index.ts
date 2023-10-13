import {
  getPackageManagerMeta,
  install
} from "@utils/managers/meta";
import { getWorkspaceDetails } from "@utils/managers/workspace";
import type { CreateCommandArgument, CreateCommandOptions, Project } from "@utils/types";

import { createProject, DownloadError } from "@utils/createProject";
import { tryGitCommit, tryGitInit } from "@utils/git";
import { isDefaultExample } from "@utils/isDefaultExample";
import { isOnline } from "@utils/isOnline";
import * as logger from "@utils/logger";
import { getAvailablePackageManagers } from "@utils/managers";
import { ConvertError } from '@utils/types';
import chalk from "chalk";
import path from "node:path";
import * as prompts from "./prompts";

const { bunnyGradient, bunnyLoader, info, error, warn } = logger;

function handleErrors(err: unknown) {
 if (err instanceof ConvertError && err.type !== "unknown") {
    error(chalk.red(err.message));
    process.exit(1);
    // handle download errors from @bunny/utils
  } else if (err instanceof DownloadError) {
    error(chalk.red("Unable to download template from Github"));
    error(chalk.red(err.message));
    process.exit(1);
  }

  // handle unknown errors (no special handling, just re-throw to catch at root)
  else {
    throw err;
  }
}

const SCRIPTS_TO_DISPLAY: Record<string, string> = {
  build: "Build",
  dev: "Develop",
  test: "Test",
  lint: "Lint",
};

export async function create(
  directory: CreateCommandArgument,
  packageManagerCmd: CreateCommandArgument,
  opts: CreateCommandOptions
) {
  console.log({ opts, directory, packageManagerCmd });
  const {
    packageManager: packageManagerOpt,
    skipInstall,
    skipTransforms,
  } = opts;
  logger.log(chalk.bold(bunnyGradient(`\n>>> BUNNY\n`)));
  info(`Welcome to Bunny Let's get you set up with a new codebase.`);
  logger.log();

  // if both the package manager option and command are provided, the option takes precedence
  const packageManager = packageManagerOpt ?? packageManagerCmd;

  const [online, availablePackageManagers] = await Promise.all([
    isOnline(),
    getAvailablePackageManagers(),
  ]);

  if (!online) {
    error(
      "You appear to be offline. Please check your network connection and try again."
    );
    process.exit(1);
  }
  const { root, projectName } = await prompts.directory({ dir: directory });
  const relativeProjectDir = path.relative(process.cwd(), root);
  const projectDirIsCurrentDir = relativeProjectDir === "";

  // selected package manager can be undefined if the user chooses to skip transforms
  const selectedPackageManagerDetails = await prompts.packageManager({
    manager: packageManager,
    skipTransforms,
  });

  if (packageManager && opts.skipTransforms) {
    warn(
      "--skip-transforms conflicts with <package-manager>. The package manager argument will be ignored."
    );
  }

  const { example, examplePath } = opts;
  const exampleName = example && example !== "default" ? example : "basic";

  let projectData = {} as Awaited<ReturnType<typeof createProject>>;
  try {
    projectData = await createProject({
      appPath: root,
      example: exampleName,
      isDefaultExample: isDefaultExample(exampleName),
      examplePath,
    });
  } catch (err) {
    handleErrors(err);
  }

  const { hasPackageJson, availableScripts } = projectData;

  // create a new git repo after creating the project
  tryGitInit(root, `feat(create-bunny): create ${exampleName}`);

  // read the project after creating it to get details about workspaces, package manager, etc.
  let project: Project = {} as Project;
  try {
    project = await getWorkspaceDetails({ root });
  } catch (err) {
    handleErrors(err);
  }

  // if the user opted out of transforms, the package manager will be the same as the source example
  const projectPackageManager =
    skipTransforms || !selectedPackageManagerDetails
      ? {
          name: project.packageManager,
          version: availablePackageManagers[project.packageManager],
        }
      : selectedPackageManagerDetails;

  info("Created a new Bunny project with the following:");
  logger.log();
  if (project.workspaceData.workspaces.length > 0) {
    const workspacesForDisplay = project.workspaceData.workspaces
      .map((w) => ({
        group: path.relative(root, w.paths.root).split(path.sep)[0] || "",
        title: path.relative(root, w.paths.root),
        description: w.description,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    let lastGroup: string | undefined;
    workspacesForDisplay.forEach(({ group, title, description }, idx) => {
      if (idx === 0 || group !== lastGroup) {
        logger.log(chalk.cyan(group));
      }
      logger.log(
        ` - ${chalk.bold(title)}${description ? `: ${description}` : ""}`
      );
      lastGroup = group;
    });
  } else {
    logger.log(chalk.cyan("apps"));
    logger.log(` - ${chalk.bold(projectName)}`);
  }

  // run install
  logger.log();
  if (hasPackageJson && !skipInstall) {
    // in the case when the user opted out of transforms, but not install, we need to make sure the package manager is available
    // before we attempt an install
    if (
      opts.skipTransforms &&
      !availablePackageManagers[project.packageManager]
    ) {
      warn(
        `Unable to install dependencies - "${exampleName}" uses "${project.packageManager}" which could not be found.`
      );
      warn(
        `Try running without "--skip-transforms" to convert "${exampleName}" to a package manager that is available on your system.`
      );
      logger.log();
    } else if (projectPackageManager.version) {
      logger.log("Installing packages. This might take a couple of minutes.");
      logger.log();

      const loader = bunnyLoader("Installing dependencies...").start();
      await install({
        project,
        to: projectPackageManager,
        options: {
          interactive: false,
        },
      });

      tryGitCommit("feat(create-bunny): install dependencies");
      loader.stop();
    }
  }

  if (projectDirIsCurrentDir) {
    logger.log(
      `${chalk.bold(
        bunnyGradient(">>> Success!")
      )} Your new Bunny project is ready.`
    );
  } else {
    logger.log(
      `${chalk.bold(
        bunnyGradient(">>> Success!")
      )} Created a new Bunny project at "${relativeProjectDir}".`
    );
  }

  // get the package manager details so we display the right commands to the user in log messages
  const packageManagerMeta = getPackageManagerMeta(projectPackageManager);
  if (packageManagerMeta && hasPackageJson) {
    logger.log(
      `Inside ${
        projectDirIsCurrentDir ? "this" : "that"
      } directory, you can run several commands:`
    );
    logger.log();
    availableScripts
      .filter((script) => SCRIPTS_TO_DISPLAY[script])
      .forEach((script) => {
        logger.log(chalk.cyan(`  ${packageManagerMeta.command} run ${script}`));
        logger.log(`     ${SCRIPTS_TO_DISPLAY[script]} all apps and packages`);
        logger.log();
      });
    logger.log(`Bunny project will cache locally by default. For an additional`);
    logger.log(`speed boost, enable Remote Caching with Vercel by`);
    logger.log(`entering the following command:`);
    logger.log();
    logger.log(chalk.cyan(`  ${packageManagerMeta.executable} bunny login`));
    logger.log();
    logger.log(`We suggest that you begin by typing:`);
    logger.log();
    if (!projectDirIsCurrentDir) {
      logger.log(`  ${chalk.cyan("cd")} ${relativeProjectDir}`);
    }
    logger.log(chalk.cyan(`  ${packageManagerMeta.executable} bunny login`));
    logger.log();
  }
}