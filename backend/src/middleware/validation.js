import { body, validationResult } from "express-validator";

// ✅ Validation middleware
export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

// ✅ House validation rules
export const validateHouse = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3-100 characters")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10-1000 characters")
    .escape(),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("location")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3-100 characters")
    .escape(),
  body("bedrooms")
    .isInt({ min: 1, max: 20 })
    .withMessage("Bedrooms must be between 1-20"),
  body("bathrooms")
    .isFloat({ min: 1, max: 20 })
    .withMessage("Bathrooms must be between 1-20"),
  body("area")
    .isFloat({ min: 1 })
    .withMessage("Area must be a positive number"),
  validateInput,
];

// ✅ Message validation rules
export const validateMessage = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1-1000 characters")
    .escape(),
  validateInput,
];

// ✅ User validation rules
export const validateUser = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters")
    .escape(),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  validateInput,
];
