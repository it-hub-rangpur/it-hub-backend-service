"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reCaptchaRouter = void 0;
const express_1 = __importDefault(require("express"));
const reCaptcha_controller_1 = require("./reCaptcha.controller");
const router = express_1.default.Router();
router.route("/").get(reCaptcha_controller_1.reCaptchaController.getReCaptchaToken);
exports.reCaptchaRouter = router;
