import { Router } from "express";
import { Login } from "../controllers/auth.controllers";

const authRouter = Router();

authRouter.post('/login', Login);

export default authRouter;