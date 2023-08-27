import { User } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import prisma from "./database";
import { LoginUser } from "../validators/loginUser.validator";
import { hash, compare } from "bcrypt";

export type CreateUser = {
    email: string,
    username: string,
    displayName: string,
    password: string,
    roleId: number
}

export class UserService {
    static async login(info: LoginUser) {
        // find either email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: info.identifier },
                    { username: info.identifier }
                ]
            }
        });

        if (!user) return null;

        const passwordsMatch = await this.comparePassword(info.password, user.password);

        if (!passwordsMatch) return null;

        return user;
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

        data.password = await this.hashPassword(data.password);

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

    static async hashPassword(password: string) {
        return await hash(password, 12);
    }

    static async comparePassword(password: string, hash: string) {
        return await compare(password, hash);
    }
}