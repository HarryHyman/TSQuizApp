import { User } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import prisma from "./database";
import { LoginUser } from "../validators/loginUser.validator";

export type CreateUser = {
    email: string,
    username: string,
    displayName: string,
    password: string,
    roleId: number
}

export class UserService {
    static login(info: LoginUser) {
        throw new Error("Method not implemented.");
    }
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

    static async register(data: CreateUser): Promise<User> {
        // REVIEW: potentially other service-level validation here, e.g. password strength

        const user = await prisma.user.create({
            data: data
        });

        return user;
    }

    static async signJWT(user: User) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const jwt = await new SignJWT({ id: user.id, username: user.username, displayName: user.displayName, roleId: user.roleId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        return jwt;
    }

    static async decodeJWT(jwt: string) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const { payload } = await jwtVerify(jwt, secret);

        return payload;
    }
}