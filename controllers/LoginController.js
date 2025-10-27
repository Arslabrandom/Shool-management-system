import { initLogin, checkForValidRole} from '../private/IAM/identity_management.js';
import { userTypes } from '../private/constants/constants.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
}

export const loginHelper = async (req, res) => {
    const { userid, password } = req.body;
    const { role } = req.params;
    const roleVerifier = checkForValidRole(role);
    if (!userid || !password) { return res.status(400).json({ message: "Incomplete credentials" }) }
    if (!roleVerifier) { return res.status(400).json({ message: 'Invalid role' }) }
    const obj = {
        userid: userid,
        password: password
    }
    const logger = await initLogin(obj, userTypes[role])
    if (logger.login) {
        res.cookie('sessionId', logger.sessionId, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000, sameSite: 'strict' });
        return res.json({ login: true, message: "Logged In", type: null, errorno: null })
    } else {
        return res.json(logger)
    }
}