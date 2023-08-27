import { User } from "@prisma/client";
import prisma from "../../../src/services/database";
import timekeeper from "timekeeper";
import { UserService } from "../../../src/services/user.service";
import { jwtVerify } from "jose";
import { LoginUser } from "../../../src/validators/loginUser.validator";
import bcrypt from "bcrypt";

describe("User Service", () => {
    describe("emailInUse", () => {
        it("should return true if email is in use", async () => {
            const email = "existing@example.com";
        
            // Mock prisma.user.findFirst to return a user with the given email
            prisma.user.findFirst = jest.fn().mockResolvedValue({ email });
        
            const result = await UserService.emailInUse(email);
        
            expect(result).toBe(true);
        });

        it("should return false if email is not in use", async () => {
            const email = "new@example.com";
        
            // Mock prisma.user.findFirst to return null, indicating email not found
            prisma.user.findFirst = jest.fn().mockResolvedValue(null);
        
            const result = await UserService.emailInUse(email);
        
            expect(result).toBe(false);
        });
        
        it("should handle Prisma errors", async () => {
            const email = "existing@example.com";
        
            // Mock prisma.user.findFirst to throw an error
            prisma.user.findFirst = jest.fn().mockRejectedValue(new Error("Database error"));
        
            await expect(UserService.emailInUse(email)).rejects.toThrow("Database error");
        });
    });

    describe("usernameInUse", () => {
        it("should return true if username is in use", async () => {
            const username = "existing";
        
            // Mock prisma.user.findFirst to return a user with the given username
            prisma.user.findFirst = jest.fn().mockResolvedValue({ username });
        
            const result = await UserService.usernameInUse(username);
        
            expect(result).toBe(true);
        });

        it("should return false if username is not in use", async () => {
            const username = "new";
        
            // Mock prisma.user.findFirst to return null, indicating username not found
            prisma.user.findFirst = jest.fn().mockResolvedValue(null);
        
            const result = await UserService.usernameInUse(username);
        
            expect(result).toBe(false);
        });
        
        it("should handle Prisma errors", async () => {
            const email = "existing";
        
            // Mock prisma.user.findFirst to throw an error
            prisma.user.findFirst = jest.fn().mockRejectedValue(new Error("Database error"));
        
            await expect(UserService.usernameInUse(email)).rejects.toThrow("Database error");
        });
    });

    describe("register", () => {
        it("should return the created user", async () => {
            const password = "password";

            const data = {
                email: "test@test.com",
                username: "test",
                displayName: "Test User",
                password: password,
                roleId: 1
            };

            // Mock prisma.user.create to return the given data
            prisma.user.create = jest.fn().mockResolvedValue(data);

            const result = await UserService.register(data);

            expect(result).toEqual(data);
            expect(result.password).not.toEqual(password); // password should be hashed
        });

        it("should handle Prisma errors", async () => {
            const data = {
                email: "test@test.com",
                username: "test",
                displayName: "Test User",
                password: "password",
                roleId: 1
            };

            // Mock prisma.user.create to throw an error
            prisma.user.create = jest.fn().mockRejectedValue(new Error("Database error"));

            await expect(UserService.register(data)).rejects.toThrow("Database error");
        });

    });

    describe("signJWT", () => {
        it("should return a JWT", async () => {
            const time = new Date("2023-08-20T12:00:00Z");
            timekeeper.freeze(time);

            const user: User = {
                id: 1,
                username: "test",
                displayName: "Test User",
                email: "test@test.com",
                password: "password",
                roleId: 1
            };

            // mock process.env.JWT_SECRET
            process.env.JWT_SECRET = "secret";

            const jwtToken = await UserService.signJWT(user);

            expect(jwtToken).toBeDefined();

            // Test with hard coded value

            expect(jwtToken).toEqual("eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiZGlzcGxheU5hbWUiOiJUZXN0IFVzZXIiLCJyb2xlSWQiOjEsImlhdCI6MTY5MjUzMjgwMCwiZXhwIjoxNjkyNjE5MjAwfQ.s6PIvDYqr2-m_dh0oNoyiiIwZpLAXiNgAAJFkBabyas");

            // Validate with jwtVerify

            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            const { payload } = await jwtVerify(jwtToken, secret);
            
            expect(payload).toEqual({ id: 1, username: "test", displayName: "Test User", roleId: 1, iat: 1692532800 /* unix of time */, exp: 1692619200 /* time + 86400 */});

            timekeeper.reset();
        });

    });

    describe("decodeJWT", () => {
        it("should return the payload of a JWT", async () => {
            const time = new Date("2023-08-20T12:00:00Z");
            timekeeper.freeze(time);

            // mock process.env.JWT_SECRET
            process.env.JWT_SECRET = "secret";

            const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiZGlzcGxheU5hbWUiOiJUZXN0IFVzZXIiLCJyb2xlSWQiOjEsImlhdCI6MTY5MjUzMjgwMCwiZXhwIjoxNjkyNjE5MjAwfQ.s6PIvDYqr2-m_dh0oNoyiiIwZpLAXiNgAAJFkBabyas";

            const payload = await UserService.decodeJWT(jwtToken);

            expect(payload).toEqual({ id: 1, username: "test", displayName: "Test User", roleId: 1, iat: 1692532800 /* unix of time */, exp: 1692619200 /* time + 86400 */});

            timekeeper.reset();
        });
    });

    describe("login", () => {
        it("should return null if user is not found", async () => {
            const info: LoginUser = {
                identifier: "test",
                password: "password"
            };

            // Mock prisma.user.findFirst to return null
            prisma.user.findFirst = jest.fn().mockResolvedValue(null);

            const result = await UserService.login(info);

            expect(result).toBeNull();
        });

        it("should return null if password is incorrect", async () => {
            const info: LoginUser = {
                identifier: "test",
                password: "password"
            };

            const user: User = {
                id: 1,
                username: "test",
                displayName: "Test User",
                email: "test@test.com",
                password: "incorrect",
                roleId: 1
            };

            // Mock prisma.user.findFirst to return a user
            prisma.user.findFirst = jest.fn().mockResolvedValue(user);

            const result = await UserService.login(info);

            expect(result).toBeNull();
        });

        it("should return the user if user is found and password is correct", async () => {
            const info: LoginUser = {
                identifier: "test",
                password: "password"
            };

            const user: User = {
                id: 1,
                username: "test",
                displayName: "Test User",
                email: "test@test.com",
                password: "$2b$12$ZyjABzV4Fkax6jU87FOEtup8RIQXP4vYNW86X20rFuCaV/sl82ozy", // bcrypt hash of "password"
                roleId: 1
            };

            // Mock prisma.user.findFirst to return a user
            prisma.user.findFirst = jest.fn().mockResolvedValue(user);

            const result = await UserService.login(info);

            expect(result).toBeDefined();
            expect(result).toEqual(user);
        });
    });

    describe("hashPassword", () => {
        it("should return a hashed password", async () => {
            const password = "password";

            const hashedPassword = await UserService.hashPassword(password);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toEqual(password);
        });

        it("should handle bcrypt errors", async () => {
            const password = "password";

            // Mock bcrypt.hash to throw an error
            bcrypt.hash = jest.fn().mockRejectedValue(new Error("Bcrypt error"));

            await expect(UserService.hashPassword(password)).rejects.toThrow("Bcrypt error");
        });
    });
});