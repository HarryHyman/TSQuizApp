import { Request, Response } from "express";

export class UserController {
    static async registerUser(req: Request, res: Response) {
        // return not implemented
        console.log("registerUser not implemented");
        res.status(204).send();
    }
}
