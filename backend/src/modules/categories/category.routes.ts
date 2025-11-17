import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import * as controller from "@/modules/categories/category.controller";

const router = Router();
router.use(requireAuth);

router.get("/", controller.list);
router.post("/", controller.create);

export default router;
