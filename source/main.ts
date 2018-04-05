import { Server } from "./server";
import { BuildRouter, BuildRule } from "./build";
import { CommandService } from "../source/command/command.service";

const commandService = new CommandService();
const buildRouter = BuildRouter.create(commandService, BuildRule);

if (!commandService.directoryExists("builds"))
    commandService.makeDirectory("builds");

Server.create(buildRouter, false).listen(3000, () => console.log(`Listening on port 3000`));
