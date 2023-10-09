/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require("fs");
const path = require("path");

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleGenerator = require("./module/index.js");
// const containerGenerator = require("./container/index.js");
// const pageGenerator = require("./page/index.js");
// const routeGenerator = require("./route/index.js");

module.exports = (plop) => {
  plop.setGenerator("module", moduleGenerator);
  // plop.setGenerator("model", containerGenerator);
  // plop.setGenerator("controller", pageGenerator);
  // plop.setGenerator("service", routeGenerator);
  // plop.setGenerator("route", routeGenerator);
  plop.addHelper("directory", (comp) => {
    try {
      fs.accessSync(path.join(resolveApp("app"), comp), fs.F_OK);
      return `app/${comp}`;
    } catch (e) {
      // @TODO: this will change
      return `components/${comp}`;
    }
  });
  plop.addHelper("curly", (object, open) => (open ? "{" : "}"));
};
