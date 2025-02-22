import express from "express";
import { transactionController } from "./transaction.controller";
import verifyedLoginUser from "../../middlewares/verifyedUser";

const router = express.Router();

router
  .route("/")
  .get(verifyedLoginUser, transactionController.getAllTransaction);

router
  .route("/payment")
  .post(verifyedLoginUser, transactionController.clientPayment);

export const transactionRouter = router;
