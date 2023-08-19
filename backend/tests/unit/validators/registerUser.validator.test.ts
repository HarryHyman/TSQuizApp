import { RegisterUser, registerUserValidator } from "../../../src/validators/registerUser.validator";

describe("Register User Validator", () => {
    it("should validate correctly for valid data", () => {
        const data: RegisterUser = {
            username: "test",
            displayName: "test",
            email: "john@example.com",
            password: "password",
            confirmPassword: "password"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeUndefined();
    });

    it("should return error if username is missing", () => {
        const data: Partial<RegisterUser> = {
            displayName: "test",
            email: "john@example.com",
            password: "password",
            confirmPassword: "password"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"username\" is required");
    });

    it("should return error if displayName is missing", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            email: "john@example.com",
            password: "password",
            confirmPassword: "password"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"displayName\" is required");
    });

    it("should return error if email is missing", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            displayName: "test",
            password: "password",
            confirmPassword: "password"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"email\" is required");
    });

    it("should check if email is valid", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            displayName: "test",
            email: "john",
            password: "password",
            confirmPassword: "password"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"email\" must be a valid email");
    });

    it("should return error if password is missing", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            displayName: "test",
            email: "john@example.com",
            confirmPassword: "password"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"password\" is required");
    });

    it("should return error if password is less than 8 characters", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            displayName: "test",
            email: "john@example.com",
            password: "pass",
            confirmPassword: "pass"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"password\" length must be at least 8 characters long");
    });

    it("should return error if confirmPassword is missing", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            displayName: "test",
            email: "john@example.com",
            password: "password",
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"confirmPassword\" is required");
    });

    it("should return error if password and confirmPassword do not match", () => {
        const data: Partial<RegisterUser> = {
            username: "test",
            displayName: "test",
            email: "john@example.com",
            password: "password",
            confirmPassword: "pass"
        };

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"password\" and \"confirmPassword\" do not match");

    });

    it("should return username error if data is empty", () => {
        const data: Partial<RegisterUser> = {};

        const { error } = registerUserValidator.validate(data);

        expect(error).toBeDefined();
        expect(error!.details[0].message).toBe("\"username\" is required");
    });
});