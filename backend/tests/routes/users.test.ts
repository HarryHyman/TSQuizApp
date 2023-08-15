import request from "../setup";

describe("POST /api/users/register", () => {
    it("should return 400 if username is not provided", async () => {
        const res = await request.post("/api/users/register");

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"username\" is required");
    });

    it("should return 400 if displayName is not provided", async () => {
        const res = await request.post("/api/users/register").send({ username: "username" });

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"displayName\" is required");
    });

    it("should return 400 if email is not provided", async () => {
        const res = await request.post("/api/users/register").send({ username: "username", displayName: "displayName" });

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"email\" is required");
    });

    it("should return 400 if email is invalid", async () => {
        const res = await request.post("/api/users/register").send({ username: "username", displayName: "displayName", email: "email" });

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"email\" must be a valid email");
    });

    it("should return 400 if password is not provided", async () => {
        const res = await request.post("/api/users/register").send({ username: "username", displayName: "displayName", email: "email@gmail.com" });

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"password\" is required");
    });
    
    it("should return 400 if confirmPassword is not provided", async () => {
        const res = await request.post("/api/users/register").send({ username: "username", displayName: "displayName", email: "email@gmail.com", password: "password" });

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"confirmPassword\" is required");
    });

    it("should return 400 if password and confirmPassword do not match", async () => {
        const res = await request.post("/api/users/register").send({ username: "username", displayName: "displayName", email: "email@gmail.com", password: "password", confirmPassword: "password1" });

        expect(res.status).toBe(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("\"password\" and \"confirmPassword\" do not match");
    });

    it("should return 204 if user successfully registered", async () => {
        const res = await request.post("/api/users/register").send({ username: "username", displayName: "displayName", email: "email@gmail.com", password: "password", confirmPassword: "password" });

        expect(res.status).toBe(204);
    });
});