import express from "express";
import { reCaptchaRouter } from "../modules/reCaptcha/reCaptcha.router";
import { userRouter } from "../modules/user/user.router";
import { messagesRouter } from "../modules/messages/messages.router";
import { clientRouter } from "../modules/clients/clients.router";
import { reportsRouter } from "../modules/reports/reports.router";
import { applicationRouter } from "../modules/applications/applications.router";
import { visaApiRouter } from "../modules/visaApi/visaApi.router";
import { vpsRouter } from "../modules/vps/vps.router";
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
  {
    path: "/reports",
    route: reportsRouter,
  },
  {
    path: "/applications",
    route: applicationRouter,
  },
  {
    path: "/",
    route: visaApiRouter,
  },
  {
    path: "/vps",
    route: vpsRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
