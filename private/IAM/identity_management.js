import pool from '../DB_INITIALISER/initialiser.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

// student object model
// userid 4 numbers converted to string
// username max 20 characters
// password hash
// role max 10 characters

function closePool() { pool.end() }

// Role verifier function returns role or null
export function checkForValidRole(role) {
    const Roles = ['admin', 'teacher', 'student', 'parent'];
    return Roles.includes(role);
}

// Signup data verifier function promise
const verifySignUpData = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.userid || !data.username || !data.role || !data.password) {
            reject("Incomplete credentials");
        }
        for (const key in data) {
            if (typeof data[key] === 'number') {
                reject(`All fields given must be strings`);
            }
        }
        if (data.userid.length > 4 || data.userid.length < 4) {
            reject('userid must be 4 characters');
        }
        if (data.username.length > 20) {
            reject('Username must be less than 20 character');
        } else if (data.username.length < 5) {
            reject('Username should be atleast 5 characters')
        }
        if (data.password.length < 8) {
            reject('password must be more than 8 characters');
        }
        if (!checkForValidRole(data.role)) {
            reject('Invalid role specified')
        }
        resolve('Data Verified!')
    })
}

// login data verifier function promise
const verifyLoginData = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.userid || !data.password) {
            reject('Incomplete credentials');
        }
        for (const key in data) {
            if (typeof data[key] === 'number') {
                reject(`All fields given must be strings`);
            }
        }
        if (data.userid.length > 4 || data.userid.length < 4) {
            reject('User ID can only be 4 characters long');
        }
        if (data.password.length < 8) {
            reject('Password cannot be less than 8 characters')
        }
        resolve('Data Verified Successfully!');
    })
}

// session data verifier function promise
const verifySessionData = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.userid, !data.username, !data.role, !data.expires, !data.sessionId) {
            reject('Incomplete seesion data')
        }
        if (typeof (data.userid) === 'number') {
            reject('user id must be a string');
        }
        if (typeof (data.username) === 'number') {
            reject('username must be a string');
        }
        if (typeof (data.role) === 'number') {
            reject('role must be a string');
        }
        if (data.userid.length > 4 || data.userid.length < 4) {
            reject('userid must be 4 characters');
        }
        if (data.username.length > 20) {
            reject('Username must be less than 20 character');
        } else if (data.username.length < 5) {
            reject('Username should be atleast 5 characters')
        }
        if (!checkForValidRole(data.role)) {
            reject('Invalid role specified')
        }
        resolve('Data Verified!')
    })
}

export const findSession = async (sessionId) => {
    if (!sessionId) { return { session: false, message: 'session ID not specified', type: 'FSE', errorno: undefined } }
    try {
        const query = 'SELECT userid, username, role, expires FROM sessions WHERE sessionid = ? LIMIT 1'
        const [rows, fields] = await pool.execute(query, [sessionId])
        if (rows.length > 0) {
            return { session: rows[0], message: 'Session Found', type: 'DBE', errorno: undefined };
        } else {
            return { session: false, message: 'no session found', type: 'FSE', errorno: undefined }
        }
    } catch (err) {
        return { session: false, message: err.sqlMessage, type: 'DBE', errorno: err.errno }
    }
}

const filterExpiredSessions = async () => {
    try {
        const query = `DELETE FROM sessions WHERE expires < ${Date.now()}`;
        const [result] = await pool.execute(query);
        return { filtered: true, message: 'Filtered expired sessions', errorno: undefined }
    } catch (err) {
        return { filtered: false, message: err.sqlMessage, errorno: err.errno }
    }
}

const filterDuplicateSessions = async (userid) => {
    try {
        const query = `DELETE FROM sessions WHERE userid = ${userid}`;
        const [result] = await pool.execute(query);
        return { filtered: true, message: 'Filtered duplicate sessions', errorno: undefined }
    } catch (err) {
        return { filtered: false, message: err.sqlMessage, errorno: err.errno }
    }
}

const verifier = async (data, callbackfn) => {
    try {
        await callbackfn(data);
        return { verified: true, message: 'data verified' }
    } catch (err) {
        return { verifier: false, message: err }
    }
}

async function addNewSession(data) {
    const verifierResponse = await verifier(data, verifySessionData)
    if (verifierResponse.verified) {
        try {
            const query = 'INSERT INTO sessions (sessionid, role, username, userid, expires) VALUES (?, ?, ?, ?, ?)'
            const [result] = await pool.execute(query, [data.sessionId, data.role, data.username, data.userid, data.expires])
            return { sessionCreated: true, message: 'Session created Successfully', type: 'DBE', errorno: undefined }
        } catch (err) {
            return { sessionCreated: false, message: err.sqlMessage, type: 'DBE', errorno: err.errno }
        }
    } else {
        return { sessionCreated: false, message: verifierResponse.message, type: 'DBE', errorno: undefined }
    }
}

// signup function returns userAdded, message, type, error no
export async function initSignup(data, usertable) {
    if (!usertable) { return { userAdded: false, message: 'Unspecified schema table', type: 'SUE', errorno: 8888 } }
    const verifierResponse = await verifier(data, verifySignUpData);
    const passWD = bcrypt.hashSync(data.password, 10);
    if (verifierResponse.verified) {
        try {
            const query = `INSERT INTO ${usertable} (userid, username, role, password) VALUES ( ?, ?, ?, ? )`;
            const [result] = await pool.execute(query, [data.userid, data.username, data.role, passWD]);
            return { userAdded: true, userid: data.userid, message: 'User Created Seccessfully', type: 'DBE', errorno: 0 };
        } catch (err) {
            return { userAdded: false, message: err.sqlMessage, type: 'DBE', errorno: err.errno };
        }
    } else {
        return { userAdded: false, message: `Validation Error: ${verifierResponse.message}`, type: 'VRE', errorno: 4444 }
    }
}

async function finduser(data, usertable) {
    if (!usertable) { return { userFound: false, message: 'Unspecified / incorrect schema table', type: 'LIE', errorno: 9999 } }
    const verifierResponse = await verifier(data, verifyLoginData);
    if (verifierResponse.verified) {
        try {
            const query = `SELECT username, userid, role, password FROM ${usertable} WHERE userid = ? LIMIT 1`;
            const [rows, fields] = await pool.execute(query, [data.userid]);
            if (rows.length > 0) {
                return { userFound: rows[0], message: 'User Found', type: 'DBE', errorno: 0 };
            } else {
                return { userFound: false, message: 'User Not Found', type: 'DBE', errorno: 4488 };
            }
        } catch (err) {
            return { userFound: false, message: err.sqlMessage, type: 'DBE', errorno: err.errorno };
        }
    } else {
        return { userFound: false, message: `Validation error: ${verifierResponse.message}`, type: 'VRE', errorno: 4444 };
    }
}

export async function initLogin(data, usertable) {
    const filteredOldExpiredSessions = await filterExpiredSessions();
    const userEntity = await finduser(data, usertable);
    if (userEntity.userFound) {
        const filteredDuplicateSessions = await filterDuplicateSessions(data.userid);
        const match = bcrypt.compareSync(data.password, userEntity.userFound.password)
        if (match) {
            const $user = userEntity.userFound;
            const sessionObject = {
                userid: $user.userid,
                username: $user.username,
                role: $user.role,
                sessionId: randomUUID(),
                expires: Date.now() + 12 * 60 * 60 * 1000
            }
            const newSession = await addNewSession(sessionObject);
            if (newSession.sessionCreated) {
                return { login: true, message: 'Logged in', type: 'LIE', errorno: undefined, sessionId: sessionObject.sessionId }
            } else {
                return { login: false, message: newSession.message, type: 'LIE', errorno: newSession.errorno }
            }
        } else {
            return { login: false, message: 'Incorrect password', type: 'LIE', errorno: undefined }
        }
    } else {
        return { login: false, message: userEntity.message, type: 'FIE', errorno: undefined }
    }
}