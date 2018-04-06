import { Server } from "./server";
import { BuildRouter } from "./build/build.router";
import { BuildRule } from "./build/build.rule";
import { CommandService } from "../source/command/command.service";

const parameters = process.argv.slice(2);
if (parameters.length !== 1)
    throw new Error("The server only accepts one argument: port");

const port = parameters[0];

const commandService = new CommandService();
const buildRouter = BuildRouter.create(commandService, BuildRule);

if (!commandService.directoryExists("builds"))
    commandService.makeDirectory("builds");
    
Server.create(buildRouter, false).listen(port, () => console.log(`Listening on port ${port}`));
