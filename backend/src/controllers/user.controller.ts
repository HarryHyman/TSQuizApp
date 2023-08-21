import { Request, Response } from "express";
import { USER_ROLE_ID } from "../util/constants";
import { RegisterUser } from "../validators/registerUser.validator";
import { CreateUser, UserService } from "../services/user.service";
import { LoginUser } from "../validators/loginUser.validator";

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
        };

        const user = await UserService.register(data);

        const jwt = await UserService.signJWT(user);

        res.cookie("jwt", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).send("Login successful");
    }

    static async login(req: Request, res: Response) {
        const info = req.body as LoginUser;

        const user = await UserService.login(info);

        if (!user) {
            res.status(401).send({
                message: "Invalid credentials"
            });
            return;
        }

        const jwt = await UserService.signJWT(user);

        res.cookie("jwt", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).send("Login successful");
    }
}
