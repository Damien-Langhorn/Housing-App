import { body, validationResult } from "express-validator";

// ✅ Shared validation result handler
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

// ✅ House validation rules (aligned with HouseListings schema)
export const validateHouse = [
  body("address")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Address must be between 3-200 characters"),
  body("city")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2-100 characters"),
  body("state")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("State must be between 2-100 characters"),
  body("postal_code")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Postal code must be between 3-20 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("bedrooms")
    .isInt({ min: 1, max: 20 })
    .withMessage("Bedrooms must be between 1-20"),
  body("bathrooms")
    .isFloat({ min: 1, max: 20 })
    .withMessage("Bathrooms must be between 1-20"),
  body("square_feet")
    .isInt({ min: 1 })
    .withMessage("Square feet must be a positive number"),
  body("year_built")
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage("Year built must be a valid year"),
  // clerk_id is required for createHouse (enforced in controller) but
  // should not be required for updates, so keep it optional here.
  body("clerk_id")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("clerk_id must be a non-empty string"),
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
