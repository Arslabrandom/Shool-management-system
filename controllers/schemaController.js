import pool from "../private/DB_INITIALISER/initialiser.js";

const applicationDraftSchema = `CREATE TABLE IF NOT EXISTS
    applicationDrafts (
        appRef VARCHAR(8) PRIMARY KEY,
        forStandard VARCHAR(10),
        applicantRole VARCHAR(10) NOT NULL,
        forSubject VARCHAR(10),
        appName VARCHAR(20) NOT NULL,
        appFirstName VARCHAR(20),
        appLastName VARCHAR(20),
        appFatherName VARCHAR(20) NOT NULL,
        appFatherFirstName VARCHAR(20),
        appFatherLastName VARCHAR(20),
        appMotherName VARCHAR(20) NOT NULL,
        appMotherFirstName VARCHAR(20),
        appMotherLastName VARCHAR(20),
        appDateOfBirth DATE NOT NULL,
        appNidType VARCHAR(20) NOT NULL,
        appNidNumber VARCHAR(20) NOT NULL,
        appAddress VARCHAR(100) NOT NULL,
        appCity VARCHAR(20) NOT NULL,
        appState VARCHAR(20) NOT NULL,
        appPostCode VARCHAR(20) NOT NULL,
        appPhoneNumber VARCHAR(20) NOT NULL,
        appEmail VARCHAR(100) UNIQUE,
        verified BOOLEAN NOT NULL DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`

const getRandomUpperCaseLetter = () => {
    const asciiCode = 65 + Math.floor(Math.random() * 26);
    return String.fromCharCode(asciiCode);
};

const appRefGenerator = () => {
    const randomAppref = Math.floor(Math.random() * 900000) + 100000;
    return `${getRandomUpperCaseLetter()}${getRandomUpperCaseLetter()}${getRandomUpperCaseLetter()}${getRandomUpperCaseLetter()}-${randomAppref}`

};

export const applicationDraftSchemaHelper = async (req, res) => {
    try {
        const [result] = await pool.execute(applicationDraftSchema);
        res.status(200).json({message: "Application drafts table created"});
    } catch (err) {
        res.status(400).json({message: "something went wrong"})
    }
};