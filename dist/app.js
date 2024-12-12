"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./routes"));
const GlobalErrorHandelar_1 = __importDefault(require("./middlewares/GlobalErrorHandelar"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("It-Hub Server is Running...");
});
app.use("/api/v1", routes_1.default);
app.use(GlobalErrorHandelar_1.default);
app.all("*", (req, res) => {
    res.status(http_status_1.default.NOT_FOUND).json({ message: "no route found" });
});
exports.default = app;
