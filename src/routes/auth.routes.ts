import { Router } from "express";
import { ForgotPassword, Login, ResetPassword, SignupClient, VerifyEmail } from "../controllers/auth.controllers";

const authRouter = Router();

authRouter.post('/login', Login);
authRouter.post('/signup-client', SignupClient);
authRouter.post('/verify-email', VerifyEmail);
authRouter.post('/forgot-password', ForgotPassword);
authRouter.post('/reset-password', ResetPassword);

export default authRouter;