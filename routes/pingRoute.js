import { Router } from "express";
import { pingHandler } from "../controllers/loginPingController.js";

const router = Router();

router.post('/', pingHandler);

export default router;