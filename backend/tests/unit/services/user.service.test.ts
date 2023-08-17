import prisma from "../../../src/services/database";
import { UserService } from "../../../src/services/user.service";

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
})