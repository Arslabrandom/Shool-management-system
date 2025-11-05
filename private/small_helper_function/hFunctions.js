export const getRandomUpperCaseLetter = () => {
    const asciiCode = 65 + Math.floor(Math.random() * 26);
    return String.fromCharCode(asciiCode);
};

export const appRefGenerator = () => {
    const randomAppref = Math.floor(Math.random() * 900000) + 100000;
    return `${getRandomUpperCaseLetter()}${getRandomUpperCaseLetter()}-${randomAppref}`

};

/**
 * Returns a completes object model for database.
 * @param {object} data - Data in form of object usually the body.
 */

export const applicationModelCreator = (data) => {
    return {
        appRef: appRefGenerator(),
        forStandard: data.forStandard || null,
        applicantRole: data.applicantRole,
        forSubject: data.forSubject || null,
        appName: data.appName,
        appFirstName: data.appFirstName || null,
        appLastName: data.appLastName || null,
        appFatherName: data.appFatherName,
        appFatherFirstName: data.appFatherFirstName || null,
        appFatherLastName: data.appFatherLastName || null,
        appMotherName: data.appMotherName,
        appMotherFirstName: data.appMotherFirstName || null,
        appMotherLastName: data.appMotherLastName || null,
        appDateOfBirth: data.appDateOfBirth,
        appNidType: data.appNidType,
        appNidNumber: data.appNidNumber,
        appAddress: data.appAddress,
        appCity: data.appCity,
        appState: data.appState,
        appPostCode: data.appPostCode,
        appPhoneNumber: data.appPhoneNumber,
        appEmail: data.appEmail || null,
        verified: false
    };
};

const dbFields = [
    "appRef",
    "forStandard",
    "applicantRole",
    "forSubject",
    "appName",
    "appFirstName",
    "appLastName",
    "appFatherName",
    "appFatherFirstName",
    "appFatherLastName",
    "appMotherName",
    "appMotherFirstName",
    "appMotherLastName",
    "appDateOfBirth",
    "appNidType",
    "appNidNumber",
    "appAddress",
    "appCity",
    "appState",
    "appPostCode",
    "appPhoneNumber",
    "appEmail",
    "verified",
    "createdAt",
    "updatedAt"
]