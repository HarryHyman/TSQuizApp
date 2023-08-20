import express from "express";
import userRoute from "./routes/users";
import cookieParser from "cookie-parser";
const app = express();

// cookie parser middleware
app.use(cookieParser());

// bodyparser middleware
app.use(express.json());

// set user route
app.use("/api/users", userRoute);

export default app;