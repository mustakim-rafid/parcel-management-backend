import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { Role } from "./user.interface";
import { validation } from "../../middleware/Validation";
import { userCreateZodSchema, userUpdateZodSchema } from "./user.validator";

const router = Router()

router.route("/register").post(validation(userCreateZodSchema), userControllers.register)
router.route("/").get(checkAuth([Role.ADMIN, Role.RECEIVER, Role.SENDER]), userControllers.getUser)
router.route("/all-users").get(checkAuth([Role.ADMIN]), userControllers.getAllUsers)
router.route("/:id").patch(validation(userUpdateZodSchema), checkAuth(Object.values(Role)), userControllers.updateUser)

export const userRouter = router