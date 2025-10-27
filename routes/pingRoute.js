import { Router } from "express";
import { pingHandler } from "../controllers/loginPingController.js";

const router = Router();

router.route('/').post(pingHandler);

export default router;