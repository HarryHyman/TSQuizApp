import Joi from "joi";

export type LoginUser = {
    identifier: string; // username or email
    password: string;
};

export const loginUserValidator = Joi.object<LoginUser>({
    identifier: Joi.alternatives().try(Joi.string().email(), Joi.string()), // REVIEW: username length min/max?
    password: Joi.string().required()
});