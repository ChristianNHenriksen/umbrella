import { Server } from "./server";
import { BuildRouter } from "./build.router";

const buildRouter = BuildRouter.create();
Server.create(buildRouter).listen(3000, () => console.log(`Listening on port 3000`));
