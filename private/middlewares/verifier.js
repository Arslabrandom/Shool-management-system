import { body, param } from "express-validator";

export const loginValidator = [
    body('userid').exists({ checkFalsy: true, checkNull: true }).withMessage("User ID is required.")
        .trim().isLength({ min: 4, max: 4 }).withMessage("User ID must be exact 4 character long."),
    body('password').exists({ checkFalsy: true, checkNull: true }).withMessage("password is required.")
        .trim().isLength({ min: 8 }).withMessage("Password should be 8 characters long."),
    param('role').exists({ checkFalsy: true, checkNull: true }).withMessage("User ID is required.")
        .trim().isIn(['admin', 'teacher', 'student', 'parent']).withMessage("Invalid Role.")
];

export const signupValidator = [
    body('username').exists({ checkFalsy: true, checkNull: true }).withMessage("User Name is required.")
        .trim().isLength({ min: 5, max: 20 }).withMessage("User Name must be 5 to 20 character long."),
    param('role').exists({ checkFalsy: true, checkNull: true }).withMessage("Role is required.")
        .trim().isIn(['admin', 'teacher', 'student', 'parent']).withMessage("Invalid Role."),
    body('password').exists({ checkFalsy: true, checkNull: true }).withMessage("Password is required.")
        .trim().isLength({ min: 8 }).withMessage("Password must be atleast 8 characters long.")
];

const nameValidator = (field, displayName, required = true) => {
    let base = body(field);

    if (required) {
        base = base.exists({ checkFalsy: true, checkNull: true }).withMessage(`${displayName} cannot be empty.`);
    } else {
        base = base.optional({ checkFalsy: true });
    }

    return [
        base.trim()
            .isAlpha('en-US', { ignore: ' ' }).withMessage(`${displayName} must only contain alphabetic characters.`)
            .isLength({ min: 3, max: 20 }).withMessage(`${displayName} cannot be neither less than 3 nor more than 20 characters.`)
    ];
};

export const newApplicationValidator = [
    // --- Application For which standar ---
    body('forStandard').optional({checkFalsy: true})
        .trim().isLength({max: 10}).withMessage("Value tooo long for the field Standard"),

    // --- Applicant's Role ---
    body('applicantRole')
        .exists({ checkFalsy: true, checkNull: true }).withMessage('Role cannot be empty.')
        .trim().isIn(['teacher', 'student']).withMessage("Invalid Role."),
        
    // --- Applicatant's subject ---
    body('forSubject').optional({checkFalsy: true})
    .trim().isLength({max: 10}).withMessage("Value tooo long for the field Subject"),

    // --- Applicant's Name Fields (Using reusable validator) ---
    ...nameValidator('appName', 'Applicant Name', true),
    ...nameValidator('appFirstName', 'Applicant First Name', false),
    ...nameValidator('appLastName', 'Applicant Last Name', false),

    // --- Father's Name Fields ---
    ...nameValidator('appFatherName', 'Applicant Father Name', true),
    ...nameValidator('appFatherFirstName', 'Applicant Father First Name', false),
    ...nameValidator('appFatherLastName', 'Applicant Father Last Name', false),

    // --- Mother's Name Fields ---
    ...nameValidator('appMotherName', 'Applicant Mother Name', true),
    ...nameValidator('appMotherFirstName', 'Applicant Mother First Name', false),
    ...nameValidator('appMotherLastName', 'Applicant Mother Last Name', false),

    // --- Date of Birth ---
    body('appDateOfBirth').exists({ checkFalsy: true, checkNull: true }).withMessage('DOB cannot be empty.')
        .trim().isISO8601().withMessage("Date of Birth must be a valid date in the YYYY-MM-DD format."),

    // --- ID Type/Number ---
    body('appNidType').exists({ checkFalsy: true, checkNull: true }).withMessage('ID Type cannot be empty / number.')
        .trim().isAlpha('en-US').withMessage('NID Type must only contain alphabetic characters.'),
    body('appNidNumber').exists({ checkFalsy: true, checkNull: true }).withMessage('ID Number cannot be empty')
        .isString().withMessage("Please post the number as a string")
        .trim().isNumeric().withMessage('The NID number must only contain digits (0-9).'),

    // --- Address/Location Fields (Can also be made reusable) ---
    body('appAddress').exists({ checkFalsy: true, checkNull: true }).withMessage('Address cannot be empty')
        .isLength({ max: 100 }).withMessage("Address cannot be neither less than 3 nor more than 100 characters."), // Fixed max length message

    // City and State (Reusable template could be made here too)
    body('appCity').exists({ checkFalsy: true, checkNull: true }).withMessage('City cannot be empty')
        .isAlpha('en-US', { ignore: " " }).withMessage('City Name must contain only alphabetic characters (A-Z).')
        .isLength({ max: 20 }).withMessage("City Name cannot be more than 20 characters."),
    body('appState').exists({ checkFalsy: true, checkNull: true }).withMessage('State cannot be empty')
        .isAlpha('en-US', { ignore: " " }).withMessage('State must contain only alphabetic characters (A-Z).')
        .isLength({ max: 20 }).withMessage("State Name cannot be more than 20 characters."),

    // --- Post Code and Phone Number ---
    body('appPostCode').exists({ checkFalsy: true, checkNull: true }).withMessage('Post Code cannot be empty')
        .isString().withMessage("Please post the code as a string")
        .trim().isNumeric().withMessage('Post Code must only contain digits (0-9).'),
    body('appPhoneNumber').exists({ checkFalsy: true, checkNull: true }).withMessage('Phone Number cannot be empty')
        .isString().withMessage("Please post the phone number as a string")
        .trim().isNumeric().withMessage('Phone Number must only contain digits (0-9).')
        .isLength({ min: 10, max: 10 }).withMessage("Phone Number must be 10 digits"),
];

// export const newApplicationValidator = [
// // ------------------------ Applicant's Role Validation -------------------------------------------------------
//     body('applicantRole').exists({checkFalsy: true, checkNull: true}).withMessage('Role cannot be empty.')
//     .trim().isIn(['teacher', 'student']).withMessage("Invalid Role."),
// // ------------------------ Applicant's Name validation --------------------------------------------------
//     body('appName').exists({checkFalsy: true, checkNull: true}).withMessage('Applicant Name cannot be empty.')
//     .trim().isAlpha('en-US').withMessage('Applicant Name must contain only alphabetic characters (A-Z) and no spaces.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant name cannot be neither less than 3 nor more than 20 characters."),
//     body('appFirstName').trim().optional({checkFalsy: true}).isAlpha('en-US')
//     .withMessage('Applicant First Name must only contain alphabetic characters.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant first name cannot be neither less than 3 nor more than 20 characters."),
//     body('appLastName').trim().optional({checkFalsy: true}).isAlpha('en-US')
//     .withMessage('Applicant Last Name must only contain alphabetic characters.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant last name cannot be neither less than 3 nor more than 20 characters."),
// // ------------------------ Applicant's Father Name validation --------------------------------------------
//     body('appFatherName').exists({checkFalsy: true, checkNull: true}).withMessage('Applicant Father Name cannot be empty.')
//     .trim().isAlpha('en-US').withMessage('Name must contain only alphabetic characters (A-Z) and no spaces.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant father name cannot be neither less than 3 nor more than 20 characters."),
//     body('appFatherFirstName').trim().optional({checkFalsy: true}).isAlpha('en-US')
//     .withMessage('Applicant Father First Name must only contain alphabetic characters.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant father first name cannot be neither less than 3 nor more than 20 characters."),
//     body('appFatherLastName').trim().optional({checkFalsy: true}).isAlpha('en-US')
//     .withMessage('Applicant Father Last Name must only contain alphabetic characters.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant father last name cannot be neither less than 3 nor more than 20 characters."),
// // ------------------------ Applicant's Mother Name validation --------------------------------------------
//     body('appMotherName').exists({checkFalsy: true, checkNull: true}).withMessage('Applicant Mother Name cannot be empty.')
//     .trim().isAlpha('en-US').withMessage('Name must contain only alphabetic characters (A-Z) and no spaces.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant Mother name cannot be neither less than 3 nor more than 20 characters."),,
//     body('appMotherFirstName').trim().optional({checkFalsy: true}).isAlpha('en-US')
//     .withMessage('Applicant Mother First Name must only contain alphabetic characters.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant mother first name cannot be neither less than 3 nor more than 20 characters."),
//     body('appMotherLastName').trim().optional({checkFalsy: true}).isAlpha('en-US')
//     .withMessage('Applicant Mother Last Name must only contain alphabetic characters.')
//     .isLength({min: 3, max: 20}).withMessage("Applicant mother last name cannot be neither less than 3 nor more than 20 characters."),
// // ------------------------ Applicant's Date of birth validation ------------------------------------------
//     body('appDateOfBirth').exists({checkFalsy: true, checkNull: true}).withMessage('DOB cannot be empty.')
//     .trim().isISO8601().withMessage("Date of Birth must be a valid date in the YYYY-MM-DD format."),
// // ------------------------ Applicant's ID doctype validation ---------------------------------------------
//     body('appNidType').exists({checkFalsy: true, checkNull: true}).withMessage('ID Type cannot be empty / number.')
//     .trim().isAlpha('en-US').withMessage('NID Type must only contain alphabetic characters.'),
// // ------------------------ Applicant's ID Number validation -----------------------------------------------
//     body('appNidNumber').exists({checkFalsy: true, checkNull: true}).withMessage('ID Number cannot be empty')
//     .isString().withMessage("Please post the number as a string")
//     .trim().isNumeric().withMessage('The NID number must only contain digits (0-9).'),
// // ------------------------ Applicant's Address validation -----------------------------------------------------
//     body('appAddress').exists({checkFalsy: true, checkNull: true}).withMessage('Address cannot be empty')
//     .isLength({max: 100}).withMessage("Address cannot be neither less than 3 nor more than 20 characters."),
// // ------------------------ Applicant's City validation ---------------------------------------------------------
//     body('appCity').exists({checkFalsy: true, checkNull: true}).withMessage('City cannot be empty')
//     .isAlpha('en-US', {ignore: " "}).withMessage('City Name must contain only alphabetic characters (A-Z).')
//     .isLength({max: 20}).withMessage("City Name cannot be more than 20 characters."),
// // ------------------------ Applicant's State validation ---------------------------------------------------------
//     body('appState').exists({checkFalsy: true, checkNull: true}).withMessage('State cannot be empty')
//     .isAlpha('en-US', {ignore: " "}).withMessage('State must contain only alphabetic characters (A-Z).')
//     .isLength({max: 20}).withMessage("State Name cannot be more than 20 characters."),
// // ------------------------ Applicant's post code validation ------------------------------------------------------
//     body('appPostCode').exists({checkFalsy: true, checkNull: true}).withMessage('Post Code cannot be empty')
//     .isString().withMessage("Please post the code as a string")
//     .trim().isNumeric().withMessage('Post Code must only contain digits (0-9).'),
// // ------------------------ Applicant's Phone number Validation ---------------------------------------------------
//     body('appPhoneNumber').exists({checkFalsy: true, checkNull: true}).withMessage('Phone Number cannot be empty')
//     .isString().withMessage("Please post the phone number as a string")
//     .trim().isNumeric().withMessage('Phone Number must only contain digits (0-9).')
//     .isLength({min: 10, max: 10}).withMessage("Phone Number must be 10 digits"), 
// ]

// {
//   "forStandard": "",
//   "forSubject": "English",
//   "applicantRole": "teacher",
//   "appName": "Riyaz",
//   "appFirstName": "Muhammad",
//   "appFatherName": "Anwar",
//   "appFatherFirstName": "Hussain",
//   "appMotherName": "phool",
//   "appMotherLastName": "jahan",
//   "appDateOfBirth": "2005-03-19",
//   "appNidType": "Aadhar",
//   "appNidNumber": "934520345324",
//   "appAddress": "Rehmat nagar Karula Gali no 8",
//   "appCity": "Moradabad",
//   "appState": "Uttar pradesh",
//   "appPostCode": "244001",
//   "appPhoneNumber": "9045755655",
//   "appEmail": ""
// }