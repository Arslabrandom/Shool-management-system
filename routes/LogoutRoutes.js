import { Router } from "express";
import { logoutHelper } from "../controllers/LogoutController.js";

const router = Router();

router.post('/', logoutHelper);

export default router;