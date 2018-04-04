import { Router } from "express";

export const BuildRouter = {
    create(): Router {
        const router = Router();

        router.post("/", (request, response, next) => {
            
        });

        return router;
    }
};