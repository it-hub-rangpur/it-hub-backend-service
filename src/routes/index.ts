import express from "express";
import { reCaptchaRouter } from "../modules/reCaptcha/reCaptcha.router";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/recaptcha-token",
    route: reCaptchaRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
