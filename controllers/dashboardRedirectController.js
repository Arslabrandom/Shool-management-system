import { findSession } from "../private/IAM/identity_management.js";
import { dashboards } from "../private/constants/constants.js";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const redirectDashboard = async (req, res) => {
    const { sessionId } = req.cookies;
    const session = await findSession(sessionId);
    if (session.session) {
        return res.sendFile(path.join(__dirname, dashboards[session.session.role]))
    }
    res.sendFile(path.join(__dirname, dashboards['err']));
}