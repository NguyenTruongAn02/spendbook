import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import * as controller from "@/modules/transactions/transaction.controller";

const router = Router();
router.use(requireAuth);

router.post("/", controller.create);
router.get("/history", controller.history);

export default router;
