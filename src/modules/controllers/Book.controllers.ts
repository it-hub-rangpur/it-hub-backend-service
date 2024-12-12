import { Request, Response } from "express";
import { bookFilterableFields } from "../../Constants/BookContant";
import { paginationFields } from "../../Constants/Pagination";
import pick from "../../shared/Pick";
import sendResponse from "../../shared/SendResponse";
import { IBook } from "../models/Book.models";
import { bookService } from "../services/Book.services";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";

const createNewBook = catchAsync(async (req: Request, res: Response) => {
  const response = await bookService.createNewBook(req.body);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Book created successfully",
    data: response,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const response = await bookService.getAllBooks(paginationOptions, filters);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Books recvied successfully",
    meta: response.meta,
    data: response.data,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await bookService.getSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book recvied successfully",
    data: response,
  });
});

const deleteSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await bookService.deleteSingleBook(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book delete successfully",
    data: response,
  });
});

const updateBookInfo = catchAsync(async (req: Request, res: Response) => {
  const response = await bookService.updateBookInfo(req.body);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book Update Successfully",
    data: response,
  });
});

const addWishList = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { _id } = req.body;
  const response = await bookService.addWishList(_id, email);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist Added Successfully",
    data: response,
  });
});

const getUserWishLists = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const response = await bookService.getUserWishList(email);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist Added Successfully",
    data: response,
  });
});

const deleteUserWishlist = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { _id } = req.body;
  const response = await bookService.deleteUserWishlistBook(_id, email);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist Delete Successfully",
    data: response,
  });
});

const addCollections = catchAsync(async (req: Request, res: Response) => {
  const { id, ...other } = req.body;

  const response = await bookService.addCollections(id, other);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Collections Added Successfully",
    data: response,
  });
});

const getUserCollections = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await bookService.getUserCollections(id);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book Collections recvied Successfully",
    data: response,
  });
});

const deleteUserBookCollection = catchAsync(
  async (req: Request, res: Response) => {
    const response = await bookService.deleteUserBookCollection(req.body);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book Collection Delete Successfully",
      data: response,
    });
  }
);

const updateUserBookCollection = catchAsync(
  async (req: Request, res: Response) => {
    const response = await bookService.updateUserBookCollection(req.body);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book Collection status update Successfully",
      data: response,
    });
  }
);

export const bookController = {
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
