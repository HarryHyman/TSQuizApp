import { Request, Response } from "express";
import prisma from "../services/database";
import { USER_ROLE_ID } from "../util/constants";
import { RegisterUser } from "../validators/registerUser.validator";

export type CreateUser = {
    email: string,
    username: string,
    displayName: string,
    password: string,
    roleId: number
}

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

    static async createUser(data: CreateUser) {
        const user = await prisma.user.create({
            data: data
        });

        return user;
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

        const data: CreateUser = {
            email: info.email,
            username: info.username,
            displayName: info.displayName,
            password: info.password,
            roleId: USER_ROLE_ID
        }

        const user = await UserController.createUser(data);

        // return not implemented
        console.log("registerUser not implemented");
        res.status(204).end();
    }
}
