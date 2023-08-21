import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { RegisterUser, registerUserValidator } from "../validators/registerUser.validator";
import validator from "../middlewares/validator";

const router = Router();

router.post("/register", validator<RegisterUser>(registerUserValidator), UserController.registerUser);

router.post("/login", UserController.login);

export default router;
