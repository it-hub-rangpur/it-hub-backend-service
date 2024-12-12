import Review, { IReview } from "../models/Review.model";

const createBooksReview = async (payload: IReview) => {
  const result = await Review.create(payload);
  return result;
};

const getBookReviews = async (id: string) => {
  const result = await Review.find({ bookId: id });
  return result;
};

export const reviewServices = {
  createBooksReview,
  getBookReviews,
};
