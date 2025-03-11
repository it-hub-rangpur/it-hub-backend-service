import express from "express";
import { reCaptchaController } from "./reCaptcha.controller";

const router = express.Router();
router.route("/").get(reCaptchaController.getReCaptchaToken);
router.route("/nope").get(reCaptchaController.getReCaptchaTokenByNope);
router.route("/anti").get(reCaptchaController.getReCaptchaTokenByAnti);
router.route("/validate").post(reCaptchaController.validateGoogleReCaptcha);

export const reCaptchaRouter = router;
