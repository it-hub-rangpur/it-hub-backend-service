import express from "express";
import { reCaptchaRouter } from "../modules/reCaptcha/reCaptcha.router";
import { userRouter } from "../modules/user/user.router";
import { messagesRouter } from "../modules/messages/messages.router";
import { clientRouter } from "../modules/clients/clients.router";
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
  {
    path: "/messages",
    route: messagesRouter,
  },
  {
    path: "/clients",
    route: clientRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
