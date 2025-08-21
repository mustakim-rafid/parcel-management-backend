import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";

const register = async (payload: Partial<IUser>) => {
    const isUserExists = await User.findOne({
        email: payload.email
    })

    if (isUserExists) {
        throw new AppError(StatusCodes.FORBIDDEN, "User already exists")
    }

    const newUser = await User.create(payload)

    const {password, isVerified, isBlocked, ...data} = newUser.toObject()

    return data
}

const getAllUsers = async () => {
    const users = await User.find({})

    return users
}

const updateUser = async (id: string, payload: Partial<IUser>, userInfo: JwtPayload) => {
    const user = await User.findById(id)

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }
    if (payload.isVerified || payload.isBlocked) {
        if (userInfo.role !== Role.ADMIN) {
            throw new AppError(StatusCodes.NOT_FOUND, "You cann't change verify and block field")
        }
    }
    if (payload.role) {
        if (userInfo.role === Role.RECEIVER || userInfo.role === Role.SENDER) {
            throw new AppError(StatusCodes.FORBIDDEN, "Sorry you can't update role field")
        }
    }
    if (userInfo.id !== id) {
        if (userInfo.role === Role.SENDER || userInfo.role === Role.RECEIVER) {
            throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized request")
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, 10)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    })

    const {password, isVerified, isBlocked, ...data} = newUpdatedUser!.toObject()

    return data
}

export const userServices = {
    register,
    getAllUsers,
    updateUser
}