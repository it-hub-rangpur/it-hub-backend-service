import { Document, model, Model, Schema } from "mongoose";

export interface IReview extends Document {
  bookId: string;
  date: string;
  review: string;
  reviewBy: string;
}

const reviewSchema: Schema<IReview> = new Schema<IReview>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReview> = model<IReview>("Review", reviewSchema);

export default Review;
