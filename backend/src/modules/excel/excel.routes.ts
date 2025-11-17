import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import * as controller from "@/modules/excel/excel.controller";

const router = Router();
router.use(requireAuth);

router.get("/statement", controller.exportStatement);

export default router;
