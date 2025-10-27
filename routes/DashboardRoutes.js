import { Router } from "express";
import { redirectDashboard } from "../controllers/dashboardRedirectController.js";

const router = Router();

router.route('/').get(redirectDashboard);

export default router;