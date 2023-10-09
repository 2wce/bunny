import chalk from "chalk";
import gradient from "gradient-string";
import ora from "ora";

const BLUE = "#0099F7";
const RED = "#F11712";
const YELLOW = "#FFFF00";

export const bunnyGradient = gradient(BLUE, RED);
export const bunnyBlue = chalk.hex(BLUE);
export const bunnyRed = chalk.hex(RED);
export const yellow = chalk.hex(YELLOW);

export const bunnyLoader = (text: string) =>
  ora({
    text,
    spinner: {
      frames: ["   ", bunnyBlue(">  "), bunnyBlue(">> "), bunnyBlue(">>>")],
    },
  });

export const info = (...args: Array<unknown>) => {
  log(bunnyBlue.bold(">>>"), ...args);
};

export const bold = (...args: Array<string>) => {
  log(chalk.bold(...args));
};

export const dimmed = (...args: Array<string>) => {
  log(chalk.dim(...args));
};

export const item = (...args: Array<unknown>) => {
  log(bunnyBlue.bold("  •"), ...args);
};

export const log = (...args: Array<unknown>) => {
  // eslint-disable-next-line no-console -- logger
  console.log(...args);
};

export const warn = (...args: Array<unknown>) => {
  // eslint-disable-next-line no-console -- warn logger
  console.error(yellow.bold(">>>"), ...args);
};

export const error = (...args: Array<unknown>) => {
  // eslint-disable-next-line no-console -- error logger
  console.error(bunnyRed.bold(">>>"), ...args);
};