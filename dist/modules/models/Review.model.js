"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    bookId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    reviewBy: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
