import { findSession } from './identity_management.js';
import * as errors from '../constants/errors.js';

export async function authenticator(req, res, next) {
    const {sessionId} = req.cookies;
    if (!sessionId) { return res.status(401).send(errors.unauthorised_error) }
    const session = await findSession(sessionId);
    if (session.session) {
        next()
    } else {
        return res.status(401).send(errors.forbidden_error);
    }
}

export function allowTo(allowedRoles) {
    return async (req, res, next) => {
        const sessionid = req.cookies.sessionId;
        if (!sessionid) { return res.status(401).send(errors.unauthorised_error) }
        const session = await findSession(sessionid);
        if (session.session) {
            const userRole = session.session.role;
            if (userRole && allowedRoles.includes(userRole)) {
                next();
            } else {
                return res.status(403).send(errors.forbidden_error);
            }
        } else {
            return res.status(401).send(errors.unauthorised_error)
        }
    };
}
