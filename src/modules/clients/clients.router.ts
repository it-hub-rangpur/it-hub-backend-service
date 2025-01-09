import express from "express";
import { clientController } from "./clients.controller";
import verifyedLoginUser from "../../middlewares/verifyedUser";

const router = express.Router();

router
  .route("/")
  .get(verifyedLoginUser, clientController.getAll)
  .post(verifyedLoginUser, clientController.create);

router
  .route("/:id")
  .patch(verifyedLoginUser, clientController.updateById)
  .delete(verifyedLoginUser, clientController.deleteById);

export const clientRouter = router;
