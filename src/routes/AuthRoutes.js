import { Router } from "express";
import { login, signup } from "../controller/AuthController.js";

const authRouter = Router();


authRouter.post("/signup", signup);
authRouter.post("/login", login);

export default authRouter;