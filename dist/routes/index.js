"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reCaptcha_router_1 = require("../modules/reCaptcha/reCaptcha.router");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/recaptcha-token",
        route: reCaptcha_router_1.reCaptchaRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
