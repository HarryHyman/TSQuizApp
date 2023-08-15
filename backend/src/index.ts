import express from "express";
import userRoute from "./routes/user";
const app = express();

// bodyparser middleware
app.use(express.json());

// set user route
app.use("/api/users", userRoute);

app.listen(5000, () => console.log("Server running on port 5000"));