import { Router } from "express";
import { googleLogin } from "@/modules/auth/auth.controller";

const router = Router();

router.post("/google", googleLogin);

export default router;
