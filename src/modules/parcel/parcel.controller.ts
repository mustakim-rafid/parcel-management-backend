import { Request, Response } from "express";
import { asyncHandler } from "../../utils/catchAsync";
import { parcelServices } from "./parcel.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";

const createParcel = asyncHandler(async (req: Request, res: Response) => {
    const parcel = await parcelServices.createParcel(req.body)
    ApiResponse(res, StatusCodes.CREATED, "New parcel created successfully!", parcel)
})

const getAllParcel = asyncHandler(async (req: Request, res: Response) => {
    const { filter, value, limit, skip } = req.query
    const parcels = await parcelServices.getAllParcel(filter as string, value, Number(limit), Number(skip))
    ApiResponse(res, StatusCodes.OK, "All parcel retrieved successfully", parcels)
})

const getSenderParcels = asyncHandler(async (req: Request, res: Response) => {
    const parcels = await parcelServices.getSenderParcels(req.user)
    ApiResponse(res, StatusCodes.OK, "Parcels retrieved successfully", parcels)
})

const getReceiverParcels = asyncHandler(async (req: Request, res: Response) => {
    const parcels = await parcelServices.getReceiverParcels(req.user)
    ApiResponse(res, StatusCodes.OK, "Parcels retrieved successfully", parcels)
})

const getParcel = asyncHandler(async (req: Request, res: Response) => {
    const parcel = await parcelServices.getParcel(req.params.id, req.user)
    ApiResponse(res, StatusCodes.OK, "Parcel retrieved successfully", parcel)
})

const updateParcel = asyncHandler(async (req: Request, res: Response) => {
    const newUpdatedParcel = await parcelServices.updateParcel(req.body, req.params.id, req.user)
    ApiResponse(res, StatusCodes.OK, "Parcel updated successfully", newUpdatedParcel)
})

const updateParcelStatus = asyncHandler(async (req: Request, res: Response) => {
    const parcelWithUpdatedStatus = await parcelServices.updateParcelStatus(req.params.id, req.body)
    ApiResponse(res, StatusCodes.OK, "Parcel status info updated successfully", parcelWithUpdatedStatus)
})

const approveParcel = asyncHandler(async (req: Request, res: Response) => {
    const parcelWithApproval = await parcelServices.approveParcel(req.params.id, req.user)
    ApiResponse(res, StatusCodes.OK, "Parcel approved successfully", parcelWithApproval)
})

const getPresentParcelStatusDetails = asyncHandler(async (req: Request, res: Response) => {
    const presentStatus = await parcelServices.getPresentParcelStatusDetails(req.params.id)
    ApiResponse(res, StatusCodes.OK, "Parcel present status details retrieved successfully", presentStatus)
})

const cancelParcel = asyncHandler(async (req: Request, res: Response) => {
    const updatedParcel = await parcelServices.cancelParcel(req.params.id, req.user)
    ApiResponse(res, StatusCodes.OK, "Parcel canceled successfully", updateParcel)
})

export const parcelControllers = {
    createParcel,
    getAllParcel,
    getSenderParcels,
    getReceiverParcels,
    getParcel,
    updateParcel,
    updateParcelStatus,
    approveParcel,
    getPresentParcelStatusDetails,
    cancelParcel
}