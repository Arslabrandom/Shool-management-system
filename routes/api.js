import { application, Router } from "express";
import { pingHandler } from "../controllers/loginPingController.js";
import { logoutHelper } from "../controllers/LogoutController.js";
import { redirectDashboard } from "../controllers/dashboardRedirectController.js";
import { loginHelper, loginPage } from "../controllers/LoginController.js";
import { loginValidator } from "../private/middlewares/verifier.js";

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "You're on the Initial api route please specify next route to proceed" });
});

router.get('/applicationForm', (req, res) => {
    res.json({
        title: "Application Form",
        Type: "For new student enrollment",
        requiredFields: {fileds: 'many'}
    });
});

router.post('/applicationForm/newApplication', (req, res) => {
    res.json({ message: "Clearance" });
});

router.post('/pingForPrevLogin', pingHandler);

router.post('/logout', logoutHelper);

router.get('/dashboard', redirectDashboard);

router.get('/login', loginPage);

router.post('/login/:role', loginValidator, loginHelper); 

export default router;