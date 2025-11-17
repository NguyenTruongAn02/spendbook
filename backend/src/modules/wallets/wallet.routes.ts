import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import * as controller from "@/modules/wallets/wallet.controller";

const router = Router();
router.use(requireAuth);

router.post("/", controller.create);
router.get("/", controller.list);

export default router;
