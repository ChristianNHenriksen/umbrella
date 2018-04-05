import { json } from "body-parser";
import * as express from "express";
import { ErrorRequestHandler, Express, RequestHandler, Router } from "express";
import { ErrorFilter } from "./error.filter";

export const Server = {
     create(buildRouter: Router, silent: boolean): Express {

        const app = express();
        app.use(json());
        app.use("/builds", buildRouter);
        app.use(ErrorFilter.create(silent));
        
        return app;
    }
};
