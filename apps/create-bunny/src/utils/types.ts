import { Logger } from "./logger";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export type DependencyList = Record<string, string>;

export interface DependencyGroups {
  dependencies?: DependencyList;
  devDependencies?: DependencyList;
  peerDependencies?: DependencyList;
  optionalDependencies?: DependencyList;
}

export interface PackageJson extends DependencyGroups {
  name: string;
  version: string;
  description?: string;
  private?: boolean;
  packageManager?: string;
  // there can be more in here, but we only care about packages
  workspaces?: Array<string> | { packages?: Array<string> };
  main?: string;
  module?: string;
  exports?: object;
  scripts?: Record<string, string>;
}

export interface PNPMWorkspaceConfig {
  packages?: Array<string>;
}

export type CreateCommandArgument = string | undefined;

export interface CreateCommandOptions {
  packageManager?: PackageManager;
  skipInstall?: boolean;
  skipTransforms?: boolean;
  turboVersion?: string;
  example?: string;
  examplePath?: string;
}

export type ConvertErrorType =
  // package manager general
  | "package_manager-unexpected"
  | "package_manager-already_in_use"
  | "package_manager-unable_to_detect"
  | "package_manager-unsupported_version"
  | "package_manager-could_not_be_found"
  // package manager specific
  | "pnpm-workspace_parse_error"
  | "bun-workspace_glob_error"
  // package.json
  | "package_json-parse_error"
  | "package_json-missing"
  // other
  | "invalid_directory"
  | "error_removing_node_modules"
  // default
  | "unknown";

export interface ConvertErrorOptions {
  type?: ConvertErrorType;
}

export class ConvertError extends Error {
  public type: ConvertErrorType;

  constructor(message: string, opts?: ConvertErrorOptions) {
    super(message);
    this.name = "ConvertError";
    this.type = opts?.type ?? "unknown";
    Error.captureStackTrace(this, ConvertError);
  }
}

export interface InstallArgs {
  project: Project;
  to: RequestedPackageManagerDetails;
  logger?: Logger;
  options?: Options;
}

export interface Options {
  dry?: boolean;
  skipInstall?: boolean;
  interactive?: boolean;
}

export interface PackageManagerInstallDetails {
  name: string;
  template: string;
  command: PackageManager;
  installArgs: Array<string>;
  version: string;
  executable: string;
  semver: string;
  default?: boolean;
}

export interface RequestedPackageManagerDetails {
  name: PackageManager;
  version?: string;
}

export interface Project {
  name: string;
  description?: string;
  packageManager: PackageManager;
  paths: {
    root: string;
    packageJson: string;
    lockfile: string;
    nodeModules: string;
    // pnpm workspace config file
    workspaceConfig?: string;
  };
  workspaceData: {
    globs: Array<string>;
    workspaces: Array<Workspace>;
  };
}

export interface Workspace {
  name: string;
  description?: string;
  paths: {
    root: string;
    packageJson: string;
    nodeModules: string;
  };
}

export interface ReadArgs {
  workspaceRoot: string;
}

export interface CreateArgs {
  project: Project;
  to: AvailablePackageManagerDetails;
  logger: Logger;
  options?: Options;
}

export interface AvailablePackageManagerDetails {
  name: PackageManager;
  version: string;
}

export interface RemoveArgs {
  project: Project;
  to: AvailablePackageManagerDetails;
  logger: Logger;
  options?: Options;
}

export interface CleanArgs {
  project: Project;
  logger: Logger;
  options?: Options;
}

export interface ConvertArgs {
  project: Project;
  to: AvailablePackageManagerDetails;
  logger: Logger;
  options?: Options;
}

export interface DetectArgs {
  workspaceRoot: string;
}

export type ManagerDetect = (args: DetectArgs) => Promise<boolean>;
export type ManagerRead = (args: ReadArgs) => Promise<Project>;
export type ManagerCreate = (args: CreateArgs) => Promise<void>;
export type ManagerRemove = (args: RemoveArgs) => Promise<void>;
export type ManagerClean = (args: CleanArgs) => Promise<void>;
export type ManagerConvert = (args: ConvertArgs) => Promise<void>;

export interface ManagerHandler {
  detect: ManagerDetect;
  read: ManagerRead;
  create: ManagerCreate;
  remove: ManagerRemove;
  clean: ManagerClean;
  convertLock: ManagerConvert;
}