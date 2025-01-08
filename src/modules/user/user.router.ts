import express from "express";
import { userController } from "./user.controller";

const router = express.Router();
router.route("/").get(userController.getAll).post(userController.create);

export const userRouter = router;
