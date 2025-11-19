import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import * as controller from "./wallet.controller";

const router = Router();
router.use(requireAuth);

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/summary", controller.summary);

router.patch("/:id", controller.update);
router.patch("/:id/archive", controller.archive);
router.patch("/:id/restore", controller.restore);
router.delete("/:id", controller.remove);

export default router;
