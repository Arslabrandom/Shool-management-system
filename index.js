import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { initSignup, findSession} from './private/IAM/identity_management.js'
import { authenticator, allowTo } from './private/IAM/access_management.js';
import { userTypes, ROLES } from './private/constants/constants.js';
import * as errors from './private/constants/errors.js';

const app = express();
const PORT = process.env.PORT || 3200;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

import loginProcessor from './routes/LoginRoutes.js';
import logoutProcessor from './routes/LogoutRoutes.js';
import dashboardProcessor from './routes/DashboardRoutes.js';

app.use('/login', loginProcessor);
app.use('/logout', logoutProcessor);
app.use('/dashboard', dashboardProcessor);

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

app.post('/logout', authenticator, async (req, res) => {

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

app.post('/pingForPrevLogin', async (req, res) => {
    const {sessionId} = req.cookies;
    if (!sessionId) { return res.json({ prevLogged: false, username: null}); }
    const session = await findSession(sessionId);
    if (session.session) {
        return res.json({ prevLogged: true, username: session.session.username });
    }
    res.json({ prevLogged: false, username: null })
})

app.get('/underdevelopment', (req, res) => {
    res.send(errors.maintenance_error)
})

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
})