import { findSession } from "../private/IAM/identity_management.js";

export const pingHandler = async (req, res) => {
    const { sessionId } = req.cookies;
    if (!sessionId) { return res.json({ prevLogged: false, username: null }); }
    const session = await findSession(sessionId);
    if (session.session) {
        return res.json({ prevLogged: true, username: session.session.username });
    }
    res.json({ prevLogged: false, username: null })
}