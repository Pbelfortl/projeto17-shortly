import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { signUpValidation, singInValidation } from "../middlewares/authMiddleware.js";


const authRoute = Router()

authRoute.post("/signup", signUpValidation, signUp)
authRoute.post("/signin", singInValidation, signIn)

export default authRoute