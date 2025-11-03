import { Router } from "express";
import { loginHelper, loginPage } from "../controllers/LoginController.js";
import { loginValidator } from "../private/middlewares/verifier.js";

const router = Router();

router.get('/', loginPage);

router.post('/:role', loginValidator, loginHelper); 

export default router;