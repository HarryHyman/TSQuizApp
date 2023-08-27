import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { RegisterUser, registerUserValidator } from "../validators/registerUser.validator";
import validator from "../middlewares/validator";
import { LoginUser, loginUserValidator } from "../validators/loginUser.validator";

const router = Router();

router.post("/register", validator<RegisterUser>(registerUserValidator), UserController.registerUser);

router.post("/login", validator<LoginUser>(loginUserValidator), UserController.login);

export default router;
