"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reCaptchaService = void 0;
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
const TwoCaptcha = require("@2captcha/captcha-solver");
const getReCaptchaToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const solver = new TwoCaptcha.Solver(envConfig_1.default.recaptchaKey);
    const captchaResponse = yield solver.recaptcha({
        pageurl: envConfig_1.default.websiteURL,
        googlekey: envConfig_1.default.websiteKey,
    });
    return captchaResponse.data;
});
exports.reCaptchaService = {
    getReCaptchaToken,
};
