import express from "express";
import userRoute from "./routes/users";
const app = express();

// bodyparser middleware
app.use(express.json());

// set user route
app.use("/api/users", userRoute);

export default app;