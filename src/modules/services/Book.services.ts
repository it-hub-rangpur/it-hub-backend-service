import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/PaginationHelper";
import { IBookFilters } from "../../inferfaces/BookInterface";
import { IPaginationOptions } from "../../inferfaces/IPaginationOptions";
import Book, { IBook, ICollection } from "../models/Book.models";
import { bookSearchableFields } from "../../Constants/BookContant";
import Year from "../models/YearModal";

const createNewBook = async (payload: IBook) => {
  const publicationYear = payload.publicationDate.slice(0, 4);

  const isExpected = await Year.findOne({ year: publicationYear });
  if (!isExpected) {
    await Year.create({ year: publicationYear });
  }

  const result = await Book.create({ ...payload, publicationYear });
  return result;
};

const getAllBooks = async (
  paginationOptions: IPaginationOptions,
  filters: IBookFilters
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map((field) => ({
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

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Book.find(whereConditions)

    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBook = async (id: string) => {
  const result = await Book.findById(id);
  return result;
};

const deleteSingleBook = async (id: string) => {
  const result = await Book.findByIdAndDelete(id);
  return result;
};

const updateBookInfo = async (data: IBook) => {
  const result = await Book.findByIdAndUpdate(data._id, data, { new: true });
  return result;
};

const addWishList = async (id: string, email: string) => {
  const result = await Book.findByIdAndUpdate(
    id,
    { $push: { wishlist: email } },
    { new: true }
  );
  return result;
};

const getUserWishList = async (email: string) => {
  const wishlistBooks = await Book.find({ wishlist: email });
  return wishlistBooks;
};

const deleteUserWishlistBook = async (id: string, email: string) => {
  const result = await Book.findByIdAndUpdate(
    id,
    { $pull: { wishlist: email } },
    { new: true }
  );
  return result;
};

const addCollections = async (id: string, data: ICollection) => {
  const result = await Book.findByIdAndUpdate(
    id,
    { $push: { collections: data } },
    { new: true }
  );

  return result;
};

const getUserCollections = async (email: string) => {
  const result = await Book.find({
    collections: { $elemMatch: { user: email } },
  });

  return result;
};

const deleteUserBookCollection = async (data: {
  id: string;
  email: string;
}) => {
  const { id, email } = data;
  const result = await Book.findByIdAndUpdate(
    id,
    { $pull: { collections: { user: email } } },
    { new: true }
  );

  return result;
};

const updateUserBookCollection = async (data: {
  id: string;
  user: string;
  status: string;
}) => {
  const { id, user, status } = data;

  const updatedData = { user, status };

  const deleteData = await Book.findByIdAndUpdate(
    id,
    { $pull: { collections: { user: user } } },
    { new: true }
  );

  if (deleteData) {
    const updateData = await Book.findByIdAndUpdate(
      id,
      { $push: { collections: updatedData } },
      { new: true }
    );

    return updateData;
  }
};

export const bookService = {
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
