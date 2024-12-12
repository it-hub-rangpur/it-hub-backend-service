import { Document, model, Model, Schema } from "mongoose";

export interface ICollection {
  user: string;
  status: string;
}

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  image: string;
  price: number;
  rating: number;
  publicationYear: string;
  wishlist: string[];
  collections: ICollection[];
  addedBy: string;
}

const bookSchema: Schema<IBook> = new Schema<IBook>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Book: Model<IBook> = model<IBook>("Book", bookSchema);

export default Book;
