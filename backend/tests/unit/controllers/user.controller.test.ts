import { Request, Response } from "express";
import { UserController } from "../../../src/controllers/user.controller";
import { RegisterUser } from "../../../src/validators/registerUser.validator";
import { UserService } from "../../../src/services/user.service";
import prisma from "../../../src/services/database";

// FIXME: DRY
const mockedRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn(),
    cookie: jest.fn()
} as unknown as Response;

const data: RegisterUser = {
    username: "test",
    displayName: "test",
    email: "test@email.com",
    password: "password",
    confirmPassword: "password"
};

describe("User Controller", () => {
    describe("Register", () => {
        it("should register user correctly, if email and username aren't in use", async () => {
            const req = {
                body: data
            } as Request;

            UserService.emailInUse = jest.fn().mockResolvedValue(false);
            UserService.usernameInUse = jest.fn().mockResolvedValue(false);
            UserService.register = jest.fn().mockResolvedValue({ ...data, id: 1 });

            await UserController.registerUser(req, mockedRes);

            expect(UserService.emailInUse).toHaveBeenCalledWith(data.email);
            expect(UserService.usernameInUse).toHaveBeenCalledWith(data.username);
            expect(UserService.register).toHaveBeenCalledWith({
                email: data.email,
                username: data.username,
                displayName: data.displayName,
                password: data.password,
                roleId: 1
            });
            expect(mockedRes.cookie).toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(200);
            expect(mockedRes.send).toHaveBeenCalledWith("Login successful");
        });

        it("should return 409 if email in use", async () => {
            const req = {
                body: data
            } as Request;

            UserService.emailInUse = jest.fn().mockResolvedValue(true);
            UserService.usernameInUse = jest.fn().mockResolvedValue(false);
            UserService.register = jest.fn().mockRejectedValue(new Error("Should not be called: duplicate email"));

            await UserController.registerUser(req, mockedRes);

            expect(UserService.emailInUse).toHaveBeenCalledWith(data.email);
            expect(UserService.usernameInUse).not.toHaveBeenCalled();
            expect(UserService.register).not.toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(409);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Email already in use"
            });
        });

        it("should return 409 if username in use", async () => {
            const req = {
                body: data
            } as Request;

            UserService.emailInUse = jest.fn().mockResolvedValue(false);
            UserService.usernameInUse = jest.fn().mockResolvedValue(true);
            UserService.register = jest.fn().mockRejectedValue(new Error("Should not be called: duplicate username"));

            await UserController.registerUser(req, mockedRes);

            expect(UserService.emailInUse).toHaveBeenCalledWith(data.email);
            expect(UserService.usernameInUse).toHaveBeenCalledWith(data.username);
            expect(UserService.register).not.toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(409);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Username already in use"
            });
        });
    });

    describe("Login", () => {
        it("should login user correctly, if credentials are valid", async () => {
            const req = {
                body: {
                    identifier: data.email,
                    password: data.password
                }
            } as Request;

            UserService.login = jest.fn().mockResolvedValue({ ...data, id: 1 });

            await UserController.login(req, mockedRes);

            expect(UserService.login).toHaveBeenCalledWith({
                identifier: data.email,
                password: data.password
            });
            expect(mockedRes.cookie).toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(200);
            expect(mockedRes.send).toHaveBeenCalledWith("Login successful");
        });

        it("should return 401 if credentials are invalid", async () => {
            const req = {
                body: {
                    identifier: data.email,
                    password: data.password
                }
            } as Request;

            UserService.login = jest.fn().mockResolvedValue(null);

            await UserController.login(req, mockedRes);

            expect(UserService.login).toHaveBeenCalledWith({
                identifier: data.email,
                password: data.password
            });
            expect(mockedRes.cookie).not.toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(401);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Invalid credentials"
            });
        });

        it("should throw error if login throws an error to be caught further up the chain", async () => {
            const req = {
                body: {
                    identifier: data.email,
                    password: data.password
                }
            } as Request;

            // mock prisma to throw an error
            prisma.user.findFirst = jest.fn().mockRejectedValue(new Error("Database error"));

            await UserController.login(req, mockedRes);

            expect(UserService.login).toHaveBeenCalledWith({
                identifier: data.email,
                password: data.password
            });

            expect(mockedRes.cookie).not.toHaveBeenCalled();
        });
    });
});