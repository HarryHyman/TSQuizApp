import Joi from "joi";
import validator from "../../../src/middlewares/validator";
import { Request, Response } from "express";

type ValidatorTest = {
    name: string;
    age: number;
}

const testSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required()
});

const mockedRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn()
} as unknown as Response;

describe("validator middleware", () => {
    it("should pass a valid request to next", async () => {
        const req = {
            body: {
                name: "test",
                age: 20
            }
        } as Request;

        const next = jest.fn();

        await validator<ValidatorTest>(testSchema)(req, mockedRes, next);

        expect(next).toHaveBeenCalled();
    });

    it("should return 400 if name is not provided", async () => {
        const req = {
            body: {
                age: 20
            }
        } as Request;

        const next = jest.fn();

        await validator<ValidatorTest>(testSchema)(req, mockedRes, next);

        expect(mockedRes.status).toHaveBeenCalledWith(400);
        expect(mockedRes.json).toHaveBeenCalledWith({
            message: "\"name\" is required"
        });
        expect(mockedRes.end).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 if age is not provided", async () => {
        const req = {
            body: {
                name: "test"
            }
        } as Request;

        const mockedRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            end: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        await validator<ValidatorTest>(testSchema)(req, mockedRes, next);

        expect(mockedRes.status).toHaveBeenCalledWith(400);
        expect(mockedRes.json).toHaveBeenCalledWith({
            message: "\"age\" is required"
        });
        expect(mockedRes.end).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 if name is not a string", async () => {
        const req = {
            body: {
                name: 20,
                age: 20
            }
        } as Request;

        const next = jest.fn();

        await validator<ValidatorTest>(testSchema)(req, mockedRes, next);

        expect(mockedRes.status).toHaveBeenCalledWith(400);
        expect(mockedRes.json).toHaveBeenCalledWith({
            message: "\"name\" must be a string"
        });
        expect(mockedRes.end).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should convert a string age to a number", async () => {
        const req = {
            body: {
                name: "test",
                age: "20"
            }
        } as Request;

        const next = jest.fn();

        await validator<ValidatorTest>(testSchema)(req, mockedRes, next);

        expect(req.body.age).toBe(20);
        expect(next).toHaveBeenCalled();
    });
});