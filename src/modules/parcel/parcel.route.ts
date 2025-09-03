import { Router } from "express";
import { validation } from "../../middleware/Validation";
import { parcelCreateZodSchema, parcelStatusUpdateZodSchema, parcelUpdateZodSchema } from "./parcel.validator";
import { checkAuth } from "../../middleware/CheckAuth";
import { Role } from "../user/user.interface";
import { parcelControllers } from "./parcel.controller";

const router = Router()

router.route("/").post(validation(parcelCreateZodSchema), checkAuth([Role.SENDER]), parcelControllers.createParcel)
router.route("/").get(checkAuth([Role.ADMIN]), parcelControllers.getAllParcel)
router.route("/sender-parcels").get(checkAuth([Role.SENDER]), parcelControllers.getSenderParcels)
router.route("/receiver-parcels").get(checkAuth([Role.RECEIVER]), parcelControllers.getReceiverParcels)
router.route("/:id").get(checkAuth([Role.ADMIN, Role.SENDER, Role.RECEIVER]), parcelControllers.getParcel)
router.route("/:id").patch(validation(parcelUpdateZodSchema), checkAuth([Role.ADMIN, Role.SENDER]), parcelControllers.updateParcel)
router.route("/:id/status-log").patch(validation(parcelStatusUpdateZodSchema), checkAuth([Role.ADMIN]), parcelControllers.updateParcelStatus)
router.route("/:id/approve").patch(checkAuth([Role.RECEIVER, Role.ADMIN]), parcelControllers.approveParcel)
router.route("/:id/status-log").get(checkAuth([Role.RECEIVER, Role.SENDER, Role.ADMIN]), parcelControllers.getPresentParcelStatusDetails)
router.route("/:id/cancel-parcel").patch(checkAuth([Role.SENDER]), parcelControllers.cancelParcel)

export const parcelRouter = router