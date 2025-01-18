import express from "express";
import { reCaptchaController } from "./reCaptcha.controller";

const router = express.Router();
router.route("/").get(reCaptchaController.getReCaptchaToken);
router.route("/validate").post(reCaptchaController.validateGoogleReCaptcha);

export const reCaptchaRouter = router;
