"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const yearSchema = new mongoose_1.Schema({
    year: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
const Year = (0, mongoose_1.model)("Year", yearSchema);
exports.default = Year;
