import { initSignup } from "../private/IAM/identity_management.js";
import { userTypes } from "../private/constants/constants.js";
import { validationResult } from "express-validator";

function generateUserid() {
    return Math.floor(Math.random() * 9000) + 1000;
}

export const signupHelper = async (req, res) => {
    const vError = validationResult(req);
    if (!vError.isEmpty()) {
        return res.status(422).json({ enroll: false, message: vError.array()[0].msg, type: null, errorno: null });
    }
    const { username, password } = req.body;
    const { role } = req.params;
    const id = generateUserid();
    const userModel = {userid: id, username: username, password: password, role: role};
    const signer = await initSignup(userModel, userTypes[role]);
    if (signer.userAdded) {
        return res.json({userAdded: id, message: signer.message, type: null, errorno: null})
    } else {
        return res.json({error: signer})
    }
}