import express from "express";
import { userController } from "./user.controller";
import verifyedLoginUser from "../../middlewares/verifyedUser";

const router = express.Router();
router.route("/login").post(userController.login);

router.route("/").get(userController.getAll).post(userController.create);
router.route("/me").get(verifyedLoginUser, userController.auth);

export const userRouter = router;
