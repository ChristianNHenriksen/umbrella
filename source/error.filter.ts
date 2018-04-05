import { ErrorRequestHandler } from "express";

export const ErrorFilter = {
    create(silent: boolean): ErrorRequestHandler {
        return (error, request, response, next) => {
            if ( !silent )
                console.error(error);

            if ( error.constructor === Array )
                return response.status(400).end(error.join("\n"));

            if ( error instanceof Error ) {
                return response.status(500).end(error.message);
            }

            response.status(500).end(error);
        };
    }
};
