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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookController = void 0;
const BookContant_1 = require("../../Constants/BookContant");
const Pagination_1 = require("../../Constants/Pagination");
const Pick_1 = __importDefault(require("../../shared/Pick"));
const SendResponse_1 = __importDefault(require("../../shared/SendResponse"));
const Book_services_1 = require("../services/Book.services");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const createNewBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Book_services_1.bookService.createNewBook(req.body);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Book created successfully",
        data: response,
    });
}));
const getAllBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, Pick_1.default)(req.query, BookContant_1.bookFilterableFields);
    const paginationOptions = (0, Pick_1.default)(req.query, Pagination_1.paginationFields);
    const response = yield Book_services_1.bookService.getAllBooks(paginationOptions, filters);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Books recvied successfully",
        meta: response.meta,
        data: response.data,
    });
}));
const getSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const response = yield Book_services_1.bookService.getSingleBook(id);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book recvied successfully",
        data: response,
    });
}));
const deleteSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const response = yield Book_services_1.bookService.deleteSingleBook(id);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book delete successfully",
        data: response,
    });
}));
const updateBookInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Book_services_1.bookService.updateBookInfo(req.body);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book Update Successfully",
        data: response,
    });
}));
const addWishList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { _id } = req.body;
    const response = yield Book_services_1.bookService.addWishList(_id, email);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wishlist Added Successfully",
        data: response,
    });
}));
const getUserWishLists = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const response = yield Book_services_1.bookService.getUserWishList(email);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wishlist Added Successfully",
        data: response,
    });
}));
const deleteUserWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { _id } = req.body;
    const response = yield Book_services_1.bookService.deleteUserWishlistBook(_id, email);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wishlist Delete Successfully",
        data: response,
    });
}));
const addCollections = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { id } = _a, other = __rest(_a, ["id"]);
    const response = yield Book_services_1.bookService.addCollections(id, other);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Collections Added Successfully",
        data: response,
    });
}));
const getUserCollections = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const response = yield Book_services_1.bookService.getUserCollections(id);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book Collections recvied Successfully",
        data: response,
    });
}));
const deleteUserBookCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Book_services_1.bookService.deleteUserBookCollection(req.body);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book Collection Delete Successfully",
        data: response,
    });
}));
const updateUserBookCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Book_services_1.bookService.updateUserBookCollection(req.body);
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book Collection status update Successfully",
        data: response,
    });
}));
exports.bookController = {
    createNewBook,
    getAllBooks,
    getSingleBook,
    deleteSingleBook,
    updateBookInfo,
    addWishList,
    getUserWishLists,
    deleteUserWishlist,
    addCollections,
    getUserCollections,
    deleteUserBookCollection,
    updateUserBookCollection,
};
