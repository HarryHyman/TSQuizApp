import { Router } from "express";

import { UserController } from "../controllers/user";
import { registerUserValidator } from "../validators/registerUser.validator";
import validator from "../middlewares/validator";

const router = Router();

router.post("/register", validator(registerUserValidator), UserController.registerUser);

export default router;
