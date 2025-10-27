import { Router } from "express";
import { logoutHelper } from "../controllers/LogoutController.js";

const router = Router();

router.route('/').post(logoutHelper);

export default router;