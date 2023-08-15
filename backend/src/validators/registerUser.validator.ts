import Joi from "joi";

export type RegisterUser = {
    username: string;
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const registerUserValidator = Joi.object<RegisterUser>({
    username: Joi.string().required(),
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "\"password\" and \"confirmPassword\" do not match"
    }),
});