import { JwtPayload } from "jsonwebtoken"
import { IParcel, IStatusLog, Status } from "./parcel.interface"
import { Parcel } from "./parcel.model"
import { User } from "../user/user.model"
import { Role } from "../user/user.interface"
import { AppError } from "../../utils/AppError"
import { StatusCodes } from "http-status-codes"
import { Types } from "mongoose"

const createParcel = async (payload: Partial<IParcel>) => {
    const isReceiverAvailable = await User.findById(payload.receiver)
    const isSenderAvailable = await User.findById(payload.sender)

    if (!isReceiverAvailable || isReceiverAvailable.role !== Role.RECEIVER) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Receiver not found")
    }
    if (!isSenderAvailable || isSenderAvailable.role !== Role.SENDER) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Sender not found")
    }

    const parcel = await Parcel.create(payload)
    return parcel
}

const getAllParcel = async (filter: string, value: any, limit: number, skip: number) => {
    if (["deliveryDate", "createdAt", "updatedAt"].includes(filter)) {
        value = new Date(value)
    }
    const parcels = await Parcel.find({ [filter]: value }).sort({ createdAt: -1 }).limit(limit).skip(skip)
    if (parcels.length === 0) {
        throw new AppError(StatusCodes.NOT_FOUND, "No parcels found")
    }
    return parcels
}

const getSenderParcels = async (user: JwtPayload) => {
    const senderParcels = await Parcel.aggregate([
        {
            $match: {
                sender: new Types.ObjectId(user.id as string)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'receiver',
                foreignField: '_id',
                as: 'receiverEmail'
            }
        },
        {
            $unwind: '$receiverEmail'
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                type: 1,
                weight: 1,
                fee: 1,
                deliveryDate: 1,
                isCanceled: 1,
                address: 1,
                status: 1,
                'receiverEmail.email': 1
            }
        }
    ])
    
    if (!senderParcels) {
        throw new AppError(StatusCodes.NOT_FOUND, "No parcel found")
    }

    return senderParcels
}

const getReceiverParcels = async (user: JwtPayload, requested: boolean) => {
    const receiverParcels = await Parcel.aggregate([
        {
            $match: {
                receiver: new Types.ObjectId(user.id as string)
            }
        },
        {
            $match: requested ? { status: Status.REQUESTED } : { status: { $ne: Status.REQUESTED } }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'sender',
                foreignField: '_id',
                as: 'senderEmail'
            }
        },
        {
            $unwind: '$senderEmail'
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                type: 1,
                weight: 1,
                fee: 1,
                deliveryDate: 1,
                isCanceled: 1,
                address: 1,
                status: 1,
                'senderEmail.email': 1
            }
        }
    ])

    if (!getSenderParcels) {
        throw new AppError(StatusCodes.NOT_FOUND, "No parcel found")
    }

    return receiverParcels
}

const getParcel = async (id: string, user: JwtPayload) => {
    const parcel = await Parcel.findById(id)
    if (user.role === Role.SENDER) {
        if (user.id !== parcel?.sender.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized request")
        }
    }
    if (user.role === Role.RECEIVER) {
        if (user.id !== parcel?.receiver.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized request")
        }
    }
    return parcel
}

const updateParcel = async (payload: Partial<IParcel>, id: string, user: JwtPayload) => {
    const newUpdatedParcel = await Parcel.findByIdAndUpdate(id, payload, {
        runValidators: true,
        new: true
    })

    if (payload.receiver) {
        const receiver = await User.findById(payload.receiver)
        newUpdatedParcel!.address.to = receiver?.address!
        newUpdatedParcel?.save()
    }

    return newUpdatedParcel
}

const updateParcelStatus = async (id: string, payload: Partial<IStatusLog>) => {
    const data = {
        timestamp: payload.timestamp ? payload.timestamp : new Date(),
        ...payload
    }
    const parcel = await Parcel.findById(id)
    if (parcel?.status === Status.REQUESTED) {
        throw new AppError(StatusCodes.FORBIDDEN, "Can't change status when it is requested")
    }
    parcel!.status = (payload as IStatusLog).status
    parcel?.trackingEvents.push(data as IStatusLog)
    parcel?.save()
    return parcel
}

const approveParcel = async (id: string, user: JwtPayload) => {
    const parcel = await Parcel.findById(id)
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "No parcel found")
    }
    if (parcel?.receiver.toString() !== user.id) {
        throw new AppError(StatusCodes.FORBIDDEN, "Invalid request")
    }
    if (parcel?.status !== Status.REQUESTED) {
        throw new AppError(StatusCodes.FORBIDDEN, "Invalid request")
    }
    parcel.status = Status.APPROVED
    parcel.trackingEvents.push({
        location: `${parcel.address.from.state}, ${parcel.address.from.city}`,
        note: "Approval from receiver",
        status: Status.APPROVED,
        timestamp: new Date()
    })
    parcel.save()
    return parcel
}

const getPresentParcelStatusDetails = async (id: string) => {
    const parcel = await Parcel.findById(id)
    const presentStatus = parcel?.trackingEvents[parcel.trackingEvents.length - 1]
    return presentStatus
}

const cancelParcel = async (id: string, userInfo: JwtPayload) => {
    const parcel = await Parcel.findById(id)
    if (parcel?.sender.toString() !== userInfo.id) {
        throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized request")
    }
    if (![Status.REQUESTED, Status.APPROVED].includes(parcel?.status as Status)) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, `You cann't cancel the ${parcel?.status} parcel`)
    }
    parcel!.isCanceled = true
    parcel?.save()
    return parcel
}

export const parcelServices = {
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