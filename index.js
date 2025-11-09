import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import * as errors from './private/constants/errors.js';
import dotenv from 'dotenv';

dotenv.config();
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

import enrollmentRoutes from './routes/enrollRoutes.js';
import apiHandler from './routes/api.js';

app.use('/enroll', enrollmentRoutes);
app.use('/api', apiHandler);

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

app.get('/applicationInstructions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'Instructions.html'));
});


app.get('/ApplicationForm', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'newApplication.html'));
});

app.get('/underdevelopment', (req, res) => {
    res.send(errors.maintenance_error);
})

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
})