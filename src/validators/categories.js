const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    next();
  };
};

/**
 * Create category validation schema
 */
const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters long",
    "string.max": "Category name must not exceed 50 characters",
    "any.required": "Category name is required",
  }),
});

/**
 * Update category validation schema
 */
const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters long",
    "string.max": "Category name must not exceed 50 characters",
    "any.required": "Category name is required",
  }),
});

module.exports = {
  validateCreateCategory: validate(createCategorySchema),
  validateUpdateCategory: validate(updateCategorySchema),
};
