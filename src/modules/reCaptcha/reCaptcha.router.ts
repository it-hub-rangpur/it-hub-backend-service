import express from "express";
import { reCaptchaController } from "./reCaptcha.controller";

const router = express.Router();
router.route("/").get(reCaptchaController.getReCaptchaToken);

export const reCaptchaRouter = router;
