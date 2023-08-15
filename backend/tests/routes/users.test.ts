import request from "../setup";

describe("POST /api/users/register", () => {
    it("should return 400 if username is not provided", async () => {
        const res = await request.post("/api/users/register");
        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"username\" is required");
    });
});