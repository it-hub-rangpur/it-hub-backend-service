"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../errorHandelars/ApiError"));
const HandleValidationError_1 = __importDefault(require("../errorHandelars/HandleValidationError"));
const envConfig_1 = __importDefault(require("../configs/envConfig"));
const globalErrorHandler = (error, req, res, next) => {
    envConfig_1.default.node_environment === "development" &&
        console.log(`🐱‍🏍 globalErrorHandler ~~`, error);
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorMessages = [];
    if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        const simplifiedError = (0, HandleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof mongoose_1.Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: envConfig_1.default.node_environment === "development" ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
