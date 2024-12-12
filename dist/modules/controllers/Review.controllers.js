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
exports.reviewControllers = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const SendResponse_1 = __importDefault(require("../../shared/SendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const Review_service_1 = require("../services/Review.service");
const createBooksReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Review_service_1.reviewServices.createBooksReview(req.body);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Book Review created successfully",
        data: response,
    });
}));
const getBookReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const response = yield Review_service_1.reviewServices.getBookReviews(id);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book reviews recvied successfully",
        data: response,
    });
}));
exports.reviewControllers = {
    createBooksReview,
    getBookReviews,
};
