import chalk from "chalk";

export function printGitHint(paths: string[]): void {
  if (paths.length === 0) return;
  console.log(chalk.dim("\nSuggested git commands:"));
  console.log(chalk.cyan(`  git add ${paths.join(" ")}`));
  console.log(chalk.cyan(`  git commit -m "specx: update artifacts"`));
}
