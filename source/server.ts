import { json } from "body-parser";
import * as express from "express";
import { ErrorRequestHandler, Express, RequestHandler, Router } from "express";

export const Server = {
     create(buildRouter: Router): Express {

        const app = express();
        app.use(json());
        app.use("/builds", buildRouter);

        return app;
    }
};
