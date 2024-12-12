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
exports.dateApiService = exports.options = void 0;
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
exports.options = {
    stages: [
        { duration: "1m", target: 100 },
        { duration: "5m", target: 100 },
        { duration: "1m", target: 0 }, // Ramp down to 0 users
    ],
};
const getCsrf = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = envConfig_1.default.target_url;
    // const response = await http.get(url);
    // console.log(response);
    return "aksjdhfkasfd";
});
exports.dateApiService = {
    getCsrf,
};
