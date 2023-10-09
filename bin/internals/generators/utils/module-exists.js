/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require("fs");
const paths = require("../../paths");

const modules = fs.readdirSync(paths.appContainers);

function moduleExists(comp) {
  return modules.indexOf(comp) >= 0;
}

module.exports = moduleExists;
