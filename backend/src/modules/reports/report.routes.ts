import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import * as controller from "@/modules/reports/report.controller";

const router = Router();
router.use(requireAuth);

router.get("/statement", controller.statement);
router.get("/chart", controller.chart);

export default router;
