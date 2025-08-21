import { Router } from "express";
import { authControllers } from "./auth.controller";
import { validation } from "../../middleware/Validation";
import { resetPasswordZodSchema, userLoginZodSchema } from "./auth.validator";
import { checkAuth } from "../../middleware/CheckAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.route("/login").post(validation(userLoginZodSchema), authControllers.login)
router.route("/logout").get(authControllers.logout)
router.route("/refresh-token").post(authControllers.refreshAccessToken)
router.route("/reset-password").post(validation(resetPasswordZodSchema), checkAuth([Role.ADMIN, Role.RECEIVER, Role.SENDER]), authControllers.resetPassword)

export const authRouter = router