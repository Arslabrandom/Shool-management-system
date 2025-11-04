import { body, param } from "express-validator";

export const loginValidator = [
    body('userid').exists({checkFalsy: true, checkNull: true}).withMessage("User ID is required.")
    .trim().isLength({min: 4, max: 4}).withMessage("User ID must be exact 4 character long."),
    body('password').exists({checkFalsy: true, checkNull: true}).withMessage("password is required.")
    .trim().isLength({min: 8}).withMessage("Password should be 8 characters long."),
    param('role').exists({checkFalsy: true, checkNull: true}).withMessage("User ID is required.")
    .trim().isIn(['admin', 'teacher', 'student', 'parent']).withMessage("Invalid Role.")
];

export const signupValidator = [
    body('username').exists({checkFalsy: true, checkNull: true}).withMessage("User Name is required.")
    .trim().isLength({min: 5, max: 20}).withMessage("User Name must be 5 to 20 character long."),
    param('role').exists({checkFalsy: true, checkNull: true}).withMessage("Role is required.")
    .trim().isIn(['admin', 'teacher', 'student', 'parent']).withMessage("Invalid Role."),
    body('password').exists({checkFalsy: true, checkNull: true}).withMessage("Password is required.")
    .trim().isLength({min: 8}).withMessage("Password must be atleast 8 characters long.")
];