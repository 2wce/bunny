import fs from "node:fs";
import path from "node:path";

export function directoryInfo({ directory }: { directory: string }) {
  const dir = path.isAbsolute(directory)
    ? directory
    : path.join(process.cwd(), directory);

  return { exists: fs.existsSync(dir), absolute: dir };
}