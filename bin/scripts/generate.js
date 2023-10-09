const { execSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);
const script = path.join(__dirname, "../internals/generators/index.js");

function initGenerator() {
  const command = `plop --plopfile ${script} ${args[0] || ""}`;

  try {
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (e) {
    return false;
  }
}

initGenerator();
