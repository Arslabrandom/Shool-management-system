import { Router } from "express";
import { loginHelper, loginPage } from "../controllers/LoginController.js";

const router = Router();

router.route('/').get(loginPage);

router.route('/:role').post(loginHelper);

export default router;