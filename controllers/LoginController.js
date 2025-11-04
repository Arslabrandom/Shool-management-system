import { initLogin } from '../private/IAM/identity_management.js';
import { userTypes } from '../private/constants/constants.js';
import { validationResult } from 'express-validator';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
}

export const loginHelper = async (req, res) => {
    const vError = validationResult(req);
    if (!vError.isEmpty()) {
        return res.status(422).json({ login: false, message: vError.array()[0].msg, type: null, errorno: null });
    };
    const { userid, password } = req.body
    const { role } = req.params;
    const logger = await initLogin({ userid: userid, password: password }, userTypes[role]);
    if (logger.login) {
        res.cookie('sessionId', logger.sessionId, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000, sameSite: 'strict' });
        return res.json({ login: true, message: "Logged In", type: null, errorno: null })
    } else {
        return res.json(logger);
    };
};