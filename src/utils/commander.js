import { Command } from "commander";
const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("-p <port>", "puerto del servidor", 8080)
  .option("--mode <mode>", "modo de trabajo", "produccion");

program.parse();

export default program;
