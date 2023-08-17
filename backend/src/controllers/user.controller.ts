import { Request, Response } from "express";
import { USER_ROLE_ID } from "../util/constants";
import { RegisterUser } from "../validators/registerUser.validator";
import { CreateUser, UserService } from "../services/user.service";

export class UserController {
    static async registerUser(req: Request, res: Response) {
        const info = req.body as RegisterUser;

        if (await UserService.emailInUse(info.email)) {
            res.status(409).send({
                message: "Email already in use"
            });
            return;
        }

        if (await UserService.usernameInUse(info.username)) {
            res.status(409).send({
                message: "Username already in use"
            });
            return;
        }

        const data: CreateUser = {
            email: info.email,
            username: info.username,
            displayName: info.displayName,
            password: info.password,
            roleId: USER_ROLE_ID
        }

        await UserService.register(data);

        res.status(204).end();
    }
}
