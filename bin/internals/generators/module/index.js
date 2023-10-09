/**
 * Module Generator
 */

const path = require("path");
const paths = require("../../paths");
const moduleExists = require("../utils/module-exists");

module.exports = {
  description: "Add a module",
  prompts: [
    {
      type: "list",
      name: "type",
      message: "Select the base module type:",
      default: "Detailed",
      choices: () => ["Detailed", "Minimal"],
    },
    {
      type: "input",
      name: "name",
      message: "What should it be called?",
      default: "user",
      validate: (value) => {
        console.log({ value });
        if (/.+/.test(value)) {
          return moduleExists(value)
            ? "A module with this name already exists"
            : true;
        }

        return "The name is required";
      },
    },
    {
      type: "confirm",
      name: "addTests",
      default: true,
      message: "Do you want tests?",
    },
  ],
  actions: (data) => {
    const actions = [
      {
        type: "add",
        path: path.join(paths.appContainers, "{{name}}/controller.ts"),
        templateFile: "./module/controller.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: path.join(paths.appContainers, "{{name}}/route.ts"),
        templateFile: "./module/route.hbs",
        abortOnFail: true,
      },
      // {
      //   type: "add",
      //   path: path.join(paths.appContainers, "{{properCase name}}/styles.ts"),
      //   templateFile: "./component/styles.hbs",
      // },
    ];

    if (data.addTests) {
      actions.push({
        type: "add",
        path: path.join(paths.appContainers, "{{properCase name}}/Loadable.ts"),
        templateFile: "./component/loadable.hbs",
        abortOnFail: true,
      });
    }

    return actions;
  },
};
