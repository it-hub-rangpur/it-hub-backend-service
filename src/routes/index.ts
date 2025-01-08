import express from "express";
import { reCaptchaRouter } from "../modules/reCaptcha/reCaptcha.router";
import { userRouter } from "../modules/user/user.router";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/recaptcha-token",
    route: reCaptchaRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
