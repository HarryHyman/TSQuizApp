import { LoginUser, loginUserValidator } from "../../../src/validators/loginUser.validator";

describe("Login User Validator", () => {
    it("should validate correctly for valid data", () => {
        const data: LoginUser = {
            identifier: "username",
            password: "password"
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeUndefined();
    });

    it("should return error if identifier is missing", () => {
        const data: Partial<LoginUser> = {
            password: "password"
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeDefined();
        expect(result.error!.details[0].message).toBe("\"identifier\" is required");
    });

    it("should return error if password is missing", () => {
        const data: Partial<LoginUser> = {
            identifier: "username"
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeDefined();
        expect(result.error!.details[0].message).toBe("\"password\" is required");
    });

    it("should return error if identifier is not a string", () => {
        const data = {
            identifier: 123,
            password: "password"
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeDefined();
        expect(result.error!.details[0].message).toBe("\"identifier\" must be a string");
    });

    it("should return error if password is not a string", () => {
        const data = {
            identifier: "username",
            password: 123
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeDefined();
        expect(result.error!.details[0].message).toBe("\"password\" must be a string");
    });

    it("should return error if identifier is empty", () => {
        const data: Partial<LoginUser> = {
            identifier: "",
            password: "password"
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeDefined();
        expect(result.error!.details[0].message).toBe("\"identifier\" is not allowed to be empty");
    });

    it("should return error if password is empty", () => {
        const data: Partial<LoginUser> = {
            identifier: "username",
            password: ""
        };

        const result = loginUserValidator.validate(data);

        expect(result.error).toBeDefined();
        expect(result.error!.details[0].message).toBe("\"password\" is not allowed to be empty");
    });
});