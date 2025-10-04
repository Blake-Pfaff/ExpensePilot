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
 * Create expense validation schema
 */
const createExpenseSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required",
  }),
  description: Joi.string().min(1).max(500).required().messages({
    "string.empty": "Description is required",
    "string.max": "Description must not exceed 500 characters",
  }),
  type: Joi.string().valid("income", "expense").required().messages({
    "any.only": 'Type must be either "income" or "expense"',
    "any.required": "Type is required",
  }),
  date: Joi.date().iso().optional().messages({
    "date.format": "Date must be in ISO format",
  }),
  categoryId: Joi.number().integer().positive().optional().messages({
    "number.base": "Category ID must be a number",
    "number.integer": "Category ID must be an integer",
  }),
});

/**
 * Update expense validation schema (all fields optional)
 */
const updateExpenseSchema = Joi.object({
  amount: Joi.number().positive().optional().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
  }),
  description: Joi.string().min(1).max(500).optional().messages({
    "string.empty": "Description cannot be empty",
    "string.max": "Description must not exceed 500 characters",
  }),
  type: Joi.string().valid("income", "expense").optional().messages({
    "any.only": 'Type must be either "income" or "expense"',
  }),
  date: Joi.date().iso().optional().messages({
    "date.format": "Date must be in ISO format",
  }),
  categoryId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Category ID must be a number",
      "number.integer": "Category ID must be an integer",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = {
  validateCreateExpense: validate(createExpenseSchema),
  validateUpdateExpense: validate(updateExpenseSchema),
};
