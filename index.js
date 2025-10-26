import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { initLogin, initSignup, findSession, checkForValidRole, removeSession } from './private/IAM/identity_management.js'
import { authenticator, allowTo } from './private/IAM/access_management.js';
import { dashboards, userTypes, ROLES } from './private/constants/constants.js';
import * as errors from './private/constants/errors.js';

const app = express();
const PORT = process.env.PORT || 3200;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loginPage = path.join(__dirname, 'public', 'pages', 'login.html');
const enrollPage = path.join(__dirname, 'public', 'pages', 'enrollnewstudent.html');
const anComplaintBoxPath = path.join(__dirname, 'public', 'pages', 'ancomplaintbox.html');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 400,
    message: errors.limiter_error,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login/:role', async (req, res) => {
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
})

app.post('/enroll/student', allowTo([ROLES.ADMIN]), async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) { return res.status(400).json({ message: "Incomplete credentials" }) }
    const randUserID = Math.round(Math.random() * 9000) + 1000;
    const obj = {
        userid: randUserID.toString(),
        username: username,
        role: 'student',
        password: password
    }
    const signer = await initSignup(obj, userTypes['student'])
    return res.json(signer);
})

app.post('/enroll/teacher', allowTo([ROLES.ADMIN]), async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) { return res.status(400).json({ message: "Incomplete credentials" }) }
    const randUserID = Math.round(Math.random() * 9000) + 1000;
    const obj = {
        userid: randUserID.toString(),
        username: username,
        role: 'teacher',
        password: password
    }
    const signer = await initSignup(obj, userTypes['teacher'])
    return res.json(signer);
})

app.get('/login', (req, res) => {
    res.sendFile(loginPage);
})

app.post('/logout', authenticator, async (req, res) => {
    const { sessionId } = req.cookies;
    const l = sessionId.toString();
    const sessionRemover = await removeSession(l);
    res.clearCookie('sessionId', { httpOnly: true, sameSite: 'strict' });
    res.json({message: "logged out"});
})

app.get('/ancomplaintbox', (req, res) => {
    res.sendFile(anComplaintBoxPath);
})

app.post('/anonymouscomplaint', (req, res) => {
    const { subject, description } = req.body;
    if (!subject || !description) {
        return res.status(404).json({ message: "Incomplete Data received" })
    }
    else {
        const complaintno = `ANC-${100000 + Math.round(Math.random() * 99999)}`
        res.json({ Complaintno: complaintno });
    }
})

app.get('/dashboard', authenticator, async (req, res) => {
    const { sessionId } = req.cookies;
    const session = await findSession(sessionId);
    if (session.session) {
        return res.sendFile(path.join(__dirname, dashboards[session.session.role]))
    }
    res.sendFile(path.join(__dirname, dashboards['err']));
})

app.post('/pingForPrevLogin', async (req, res) => {
    const {sessionId} = req.cookies;
    if (!sessionId) { return res.status(403).json({ prevLogged: false, username: null}); }
    const session = await findSession(sessionId);
    if (session.session) {
        return res.json({ prevLogged: true, username: session.session.username });
    }
    res.status(403).json({ prevLogged: false, username: null })
})

app.get('/underdevelopment', (req, res) => {
    res.send(errors.maintenance_error)
})

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
})