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
exports.bookService = void 0;
const PaginationHelper_1 = require("../../helpers/PaginationHelper");
const Book_models_1 = __importDefault(require("../models/Book.models"));
const BookContant_1 = require("../../Constants/BookContant");
const YearModal_1 = __importDefault(require("../models/YearModal"));
const createNewBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const publicationYear = payload.publicationDate.slice(0, 4);
    const isExpected = yield YearModal_1.default.findOne({ year: publicationYear });
    if (!isExpected) {
        yield YearModal_1.default.create({ year: publicationYear });
    }
    const result = yield Book_models_1.default.create(Object.assign(Object.assign({}, payload), { publicationYear }));
    return result;
});
const getAllBooks = (paginationOptions, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = PaginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: BookContant_1.bookSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield Book_models_1.default.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield Book_models_1.default.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.findById(id);
    return result;
});
const deleteSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.findByIdAndDelete(id);
    return result;
});
const updateBookInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.findByIdAndUpdate(data._id, data, { new: true });
    return result;
});
const addWishList = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.findByIdAndUpdate(id, { $push: { wishlist: email } }, { new: true });
    return result;
});
const getUserWishList = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistBooks = yield Book_models_1.default.find({ wishlist: email });
    return wishlistBooks;
});
const deleteUserWishlistBook = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.findByIdAndUpdate(id, { $pull: { wishlist: email } }, { new: true });
    return result;
});
const addCollections = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.findByIdAndUpdate(id, { $push: { collections: data } }, { new: true });
    return result;
});
const getUserCollections = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Book_models_1.default.find({
        collections: { $elemMatch: { user: email } },
    });
    return result;
});
const deleteUserBookCollection = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = data;
    const result = yield Book_models_1.default.findByIdAndUpdate(id, { $pull: { collections: { user: email } } }, { new: true });
    return result;
});
const updateUserBookCollection = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, user, status } = data;
    const updatedData = { user, status };
    const deleteData = yield Book_models_1.default.findByIdAndUpdate(id, { $pull: { collections: { user: user } } }, { new: true });
    if (deleteData) {
        const updateData = yield Book_models_1.default.findByIdAndUpdate(id, { $push: { collections: updatedData } }, { new: true });
        return updateData;
    }
});
exports.bookService = {
    createNewBook,
    getAllBooks,
    getSingleBook,
    deleteSingleBook,
    updateBookInfo,
    addWishList,
    getUserWishList,
    deleteUserWishlistBook,
    addCollections,
    getUserCollections,
    deleteUserBookCollection,
    updateUserBookCollection,
};
