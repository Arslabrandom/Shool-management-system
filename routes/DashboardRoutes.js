import { Router } from "express";
import { redirectDashboard } from "../controllers/dashboardRedirectController.js";

const router = Router();

router.get('/', redirectDashboard);

export default router;