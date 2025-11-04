import { Router } from "express";
import { signupHelper } from "../controllers/enrollmentController.js";
import { signupValidator } from "../private/middlewares/verifier.js";
import { authenticator, allowTo } from '../private/IAM/access_management.js';
import { userTypes, ROLES } from '../private/constants/constants.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "welcome to enrollment api" });
});

router.post('/:role',  signupValidator, allowTo([ROLES.ADMIN]), signupHelper);

export default router;