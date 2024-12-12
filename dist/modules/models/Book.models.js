"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    publicationDate: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    publicationYear: {
        type: String,
        required: true,
    },
    wishlist: {
        type: [],
    },
    collections: {
        type: [
            {
                user: {
                    type: String,
                    required: true,
                    lowercase: true,
                    trim: true,
                },
                status: {
                    type: String,
                    required: true,
                    lowercase: true,
                    trim: true,
                },
            },
        ],
    },
    addedBy: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
}, {
    timestamps: true,
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
