import pool from "../DB_INITIALISER/initialiser.js";

/**
 * Takes the whole application model and inserts it into database.
 * @param {object} data - The data object containing all the required fields
 */

export async function initApplication(data) {
    try {
        const query = "INSERT INTO applicationDrafts (appRef, forStandard, applicantRole, forSubject, appName, appFirstName, appLastName, appFatherName, appFatherFirstName, appFatherLastName, appMotherName, appMotherFirstName, appMotherLastName, appDateOfBirth, appNidType, appNidNumber, appAddress, appCity, appState, appPostCode, appPhoneNumber, appEmail, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(query, [data.appRef, data.forStandard, data.applicantRole, data.forSubject, data.appName, data.appFirstName, data.appLastName, data.appFatherName, data.appFatherFirstName, data.appFatherLastName, data.appMotherName, data.appMotherFirstName, data.appMotherLastName, data.appDateOfBirth, data.appNidType, data.appNidNumber, data.appAddress, data.appCity, data.appState, data.appPostCode, data.appPhoneNumber, data.appEmail, data.verified]);
        return { referenceNumber: data.appRef, applicationCreated: true, message: "Application created!" };
    } catch (err) {
        return { referenceNumber: null, applicationCreated: false, message: err.sqlMessage};
    };
};

/**
 * Takes the nid number and checks for duplicacy.
 * @param {string} nid - National Id Number as a string.
 */

export async function chechForIdDuplicacy(nid) {
    try {
        const query = 'SELECT appName FROM applicationDrafts WHERE appNidNumber = ? LIMIT 1';
        const [rows, fields] = await pool.execute(query, [nid]);
        if (rows.length > 0) {
            return {duplicateId: true, message: "Duplicate ID Found"};
        } else {
            return {duplicateId: false, message: "Id is unique"};
        }
    } catch (err) {
        return {duplicateId: null, message: err.sqlMessage};
    };
};