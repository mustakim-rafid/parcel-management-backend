import { Request, Response } from "express";
import { asyncHandler } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";

const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await userServices.register(req.body)
    ApiResponse(res, StatusCodes.CREATED, "User registered successfully!", user)
})

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userServices.getAllUsers()
    ApiResponse(res, StatusCodes.OK, "Users retrieved successfully", users)
})

const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const newUpdatedUser = await userServices.updateUser(req.params.id, req.body, req.user)
    ApiResponse(res, StatusCodes.OK, "User updated successfully", newUpdatedUser)
})

export const userControllers = {
    register,
    getAllUsers,
    updateUser
}