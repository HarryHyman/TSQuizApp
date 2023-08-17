import prisma from "./database";

export type CreateUser = {
    email: string,
    username: string,
    displayName: string,
    password: string,
    roleId: number
}

export class UserService {
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

    static async register(data: CreateUser) {
        // REVIEW: potentially other service-level validation here, e.g. password strength

        const user = await prisma.user.create({
            data: data
        });

        return user;
    }
}