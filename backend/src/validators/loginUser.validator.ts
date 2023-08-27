import Joi from "joi";

export type LoginUser = {
    identifier: string; // username or email
    password: string;
};

export const loginUserValidator = Joi.object<LoginUser>({
    identifier: Joi.string().required(), // REVIEW: username length min/max?
    password: Joi.string().required()
});