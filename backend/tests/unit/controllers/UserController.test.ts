import { Request, Response } from "express";
import { UserController } from "../../../src/controllers/UserController";
import { RegisterUser } from "../../../src/validators/registerUser.validator";

// FIXME: DRY
const mockedRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn()
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

            UserController.emailInUse = jest.fn().mockResolvedValue(false);
            UserController.usernameInUse = jest.fn().mockResolvedValue(false);
            UserController.createUser = jest.fn().mockResolvedValue({ ...data, id: 1 });

            await UserController.registerUser(req, mockedRes);

            expect(UserController.emailInUse).toHaveBeenCalledWith(data.email);
            expect(UserController.usernameInUse).toHaveBeenCalledWith(data.username);
            expect(UserController.createUser).toHaveBeenCalledWith({
                email: data.email,
                username: data.username,
                displayName: data.displayName,
                password: data.password,
                roleId: 1
            });
            expect(mockedRes.status).toHaveBeenCalledWith(204);
            expect(mockedRes.end).toHaveBeenCalled();
        });

        it("should return 409 if email in use", async () => {
            const req = {
                body: data
            } as Request;

            UserController.emailInUse = jest.fn().mockResolvedValue(true);
            UserController.usernameInUse = jest.fn().mockResolvedValue(false);
            UserController.createUser = jest.fn().mockRejectedValue(new Error("Should not be called: duplicate email"));

            await UserController.registerUser(req, mockedRes);

            expect(UserController.emailInUse).toHaveBeenCalledWith(data.email);
            expect(UserController.usernameInUse).not.toHaveBeenCalled();
            expect(UserController.createUser).not.toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(409);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Email already in use"
            });
        });

        it("should return 409 if username in use", async () => {
            const req = {
                body: data
            } as Request;

            UserController.emailInUse = jest.fn().mockResolvedValue(false);
            UserController.usernameInUse = jest.fn().mockResolvedValue(true);
            UserController.createUser = jest.fn().mockRejectedValue(new Error("Should not be called: duplicate username"));

            await UserController.registerUser(req, mockedRes);

            expect(UserController.emailInUse).toHaveBeenCalledWith(data.email);
            expect(UserController.usernameInUse).toHaveBeenCalledWith(data.username);
            expect(UserController.createUser).not.toHaveBeenCalled();
            expect(mockedRes.status).toHaveBeenCalledWith(409);
            expect(mockedRes.send).toHaveBeenCalledWith({
                message: "Username already in use"
            });
        });
    });
});