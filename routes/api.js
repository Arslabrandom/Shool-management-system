import { Router } from "express";
import { pingHandler } from "../controllers/loginPingController.js";
import { logoutHelper } from "../controllers/LogoutController.js";
import { redirectDashboard } from "../controllers/dashboardRedirectController.js";
import { loginHelper, loginPage } from "../controllers/LoginController.js";
import { loginValidator } from "../private/middlewares/verifier.js";
import { newApplicationValidator } from "../private/middlewares/verifier.js";
import { newApplication, duplIdCheck, PDApplications } from "../controllers/newApplicationController.js";
import {authenticator, allowTo} from "../private/IAM/access_management.js";
import { userTypes, ROLES } from "../private/constants/constants.js";
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "You're on the Initial api route please specify next route to proceed" });
});

router.get('/applicationForm', (req, res) => {
    res.json({ message: "Resource requested is under development!" });
});

router.post('/newApplication', newApplicationValidator, newApplication);

router.post('/checkForDuplicateNid', duplIdCheck);

router.post('/pingForPrevLogin', pingHandler);

router.post('/logout', logoutHelper);

router.get('/dashboard', redirectDashboard);

router.get('/login', loginPage);

router.post('/login/:role', loginValidator, loginHelper); 

router.get('/pendingApplications', allowTo([ROLES.ADMIN]), PDApplications);

export default router;