import { ObjectSchema, ValidationError } from "joi";
import { NextFunction, Request, Response } from "express";

function isJoiError(object: object): object is ValidationError {
    return "isJoi" in object;
}

export default <T>(validator: ObjectSchema<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await validator.validateAsync(req.body);
            next();
        } catch (e) {
            if (e instanceof Error && isJoiError(e)) {
                return res.status(400).json({
                    message: e.details.map((x) => x.message).join(", "),
                }).end();
            }

            next(e);
        }
    };
};