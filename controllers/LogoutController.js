import { removeSession } from "../private/IAM/identity_management.js";

export const logoutHelper = async (req, res) => {
    const { sessionId } = req.cookies;
    try {
        const l = sessionId.toString();
        const sessionRemover = await removeSession(l);
        res.clearCookie('sessionId', { httpOnly: true, sameSite: 'strict' });
        res.json({ message: "logged out" });
    } catch (err) {
        res.json(err);
    };
}