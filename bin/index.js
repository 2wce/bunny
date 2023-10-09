#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Copyright (c) 2018-present, Thandolwethu Mpofu.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
const spawn = require("cross-spawn");

process.on("unhandledRejection", (err) => {
  throw err;
});

const args = process.argv.filter((x) => x === "generate");

console.log({ args });

const scriptIndex = args.findIndex(
  (x) =>
    x === "build" ||
    x === "eject" ||
    x === "generate" ||
    x === "start" ||
    x === "test"
);

console.log({ scriptIndex });
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

console.log({ script });
switch (script) {
  case "generate":
    const result = spawn.sync(
      "node",
      nodeArgs
        .concat(require.resolve(`./scripts/${script}.js`))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: "inherit" }
    );
    if (result.signal) {
      if (result.signal === "SIGKILL") {
        console.log(
          "The build failed because the process exited too early. " +
            "This probably means the system ran out of memory or someone called " +
            "`kill -9` on the process."
        );
      } else if (result.signal === "SIGTERM") {
        console.log(
          "The build failed because the process exited too early. " +
            "Someone might have called `kill` or `killall`, or the system could " +
            "be shutting down."
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
  default:
    console.log(`Unknown script "${script}".`);
    console.log("Perhaps you need to update react-scripts?");
    break;
}
