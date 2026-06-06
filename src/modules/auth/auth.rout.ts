import {Router} from "express"
import { authController } from "./auth.controller";

const router = Router()

router.post("/signin", authController.signInUser)
router.post("/login", authController.loginUser)


export const authRoute = router;
