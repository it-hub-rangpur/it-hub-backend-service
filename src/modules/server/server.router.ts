import express from "express";
import { serverController } from "./server.controller";

const router = express.Router();
router.route("/create-session").get(serverController.createNewSession);

export const serverRouter = router;
