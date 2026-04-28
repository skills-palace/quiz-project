const Joi = require("joi");

const productValidate = (data) => {
    const validator = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        price: Joi.number().required(),
        status: Joi.string().required(),
    }).options({ allowUnknown: true });

    const { error } = validator.validate(data);
    return error;
};
module.exports = productValidate;
