import { Request, Response } from "express";
import { RegisterUser } from "../validators/registerUser.validator";
import prisma from "../services/database";
import { USER_ROLE_ID } from "../util/constants";

export class UserController {
    static async emailInUse(email: string) {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        return user !== null;
    }

    static async usernameInUse(username: string) {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });

        return user !== null;
    }

    static async registerUser(req: Request, res: Response) {
        const info = req.body as RegisterUser;

        if (await UserController.emailInUse(info.email)) {
            res.status(409).send({
                message: "Email already in use"
            });
            return;
        }

        if (await UserController.usernameInUse(info.username)) {
            res.status(409).send({
                message: "Username already in use"
            });
            return;
        }

        const user = await prisma.user.create({
            data: {
                email: info.email,
                username: info.username,
                displayName: info.displayName,
                password: info.password, // TODO: hash password
                roleId: USER_ROLE_ID,
            }
        });

        // return not implemented
        console.log("registerUser not implemented");
        res.status(204).send();
    }
}
