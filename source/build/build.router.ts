import { Router } from "express";
import { Rule } from "paradise";

import { CommandService } from "../command/command.service";

export const BuildRouter = {
    create(commandService: CommandService, buildRule: Rule): Router {
        const router = Router();

        router.post("/", (request, response, next) => {
            buildRule.guard(request.body)
                .then(() => {
                    const repository: string = request.body.repository.full_name;
                    const repositoryPath = `builds/${repository.replace(new RegExp("/", "g"), "-")}`
                    if (commandService.directoryExists(repositoryPath))
                        commandService.removeDirectory(repositoryPath)
                    
                    commandService.makeDirectory(repositoryPath);
                    
                    const gitRepository = `git@bitbucket.org:${repository}.git`
                    commandService.executeCommand(`git clone ${gitRepository} ${repositoryPath}`)
                    
                    const result = commandService.executeCommand(`sh ${repositoryPath}/pipeline.sh`);
                    console.log(result);

                    response.status(200).end();
                })
                .catch(next);
        });

        return router;
    }
};