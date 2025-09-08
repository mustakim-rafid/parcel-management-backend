"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelServices = void 0;
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const AppError_1 = require("../../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isReceiverAvailable = yield user_model_1.User.findById(payload.receiver);
    const isSenderAvailable = yield user_model_1.User.findById(payload.sender);
    if (!isReceiverAvailable || isReceiverAvailable.role !== user_interface_1.Role.RECEIVER) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Receiver not found");
    }
    if (!isSenderAvailable || isSenderAvailable.role !== user_interface_1.Role.SENDER) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Sender not found");
    }
    const parcel = yield parcel_model_1.Parcel.create(payload);
    return parcel;
});
const getAllParcel = (filter, value, limit, skip) => __awaiter(void 0, void 0, void 0, function* () {
    if (filter) {
        if (["deliveryDate", "createdAt", "updatedAt"].includes(filter)) {
            value = new Date(value);
        }
    }
    const parcels = yield parcel_model_1.Parcel.aggregate([
        ...(filter && value ? [{
                $match: {
                    [filter]: value
                }
            }] : []),
        {
            $lookup: {
                from: 'users',
                localField: 'receiver',
                foreignField: '_id',
                as: 'receiverEmail'
            }
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
            $unwind: '$receiverEmail'
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
                'receiverEmail.email': 1,
                'senderEmail.email': 1,
            }
        },
        ...(limit ? [
            {
                $limit: limit
            },
        ] : []),
        ...(skip ? [
            {
                $skip: skip
            }
        ] : [])
    ]);
    if (parcels.length === 0) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "No parcels found");
    }
    return parcels;
});
const getSenderParcels = (user, cancelableParcels) => __awaiter(void 0, void 0, void 0, function* () {
    const senderParcels = yield parcel_model_1.Parcel.aggregate([
        ...(cancelableParcels ? [{
                $match: {
                    status: {
                        $in: [parcel_interface_1.Status.REQUESTED, parcel_interface_1.Status.APPROVED],
                    },
                    isCanceled: false
                }
            }] : []),
        {
            $match: {
                sender: new mongoose_1.Types.ObjectId(user.id)
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
    ]);
    if (!senderParcels) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "No parcel found");
    }
    return senderParcels;
});
const getReceiverParcels = (user, requested, allParcels) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverParcels = yield parcel_model_1.Parcel.aggregate([
        {
            $match: {
                receiver: new mongoose_1.Types.ObjectId(user.id)
            }
        },
        ...(!allParcels ? [
            {
                $match: requested ? { status: parcel_interface_1.Status.REQUESTED } : { status: { $ne: parcel_interface_1.Status.REQUESTED } }
            },
        ] : []),
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
            $project: Object.assign({ type: 1, weight: 1, fee: 1, deliveryDate: 1, isCanceled: 1, address: 1, status: 1, 'senderEmail.email': 1 }, (allParcels ? {
                presentStatus: { $arrayElemAt: ["$trackingEvents", -1] },
            } : {}))
        }
    ]);
    if (!getSenderParcels) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "No parcel found");
    }
    return receiverParcels;
});
const getParcel = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (user.role === user_interface_1.Role.SENDER) {
        if (user.id !== (parcel === null || parcel === void 0 ? void 0 : parcel.sender.toString())) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized request");
        }
    }
    if (user.role === user_interface_1.Role.RECEIVER) {
        if (user.id !== (parcel === null || parcel === void 0 ? void 0 : parcel.receiver.toString())) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized request");
        }
    }
    return parcel;
});
const updateParcel = (payload, id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUpdatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, payload, {
        runValidators: true,
        new: true
    });
    if (payload.receiver) {
        const receiver = yield user_model_1.User.findById(payload.receiver);
        newUpdatedParcel.address.to = receiver === null || receiver === void 0 ? void 0 : receiver.address;
        newUpdatedParcel === null || newUpdatedParcel === void 0 ? void 0 : newUpdatedParcel.save();
    }
    return newUpdatedParcel;
});
const updateParcelStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = Object.assign({ timestamp: payload.timestamp ? payload.timestamp : new Date() }, payload);
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if ((parcel === null || parcel === void 0 ? void 0 : parcel.status) === parcel_interface_1.Status.REQUESTED) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Can't change status when it is requested");
    }
    parcel.status = payload.status;
    parcel === null || parcel === void 0 ? void 0 : parcel.trackingEvents.push(data);
    parcel === null || parcel === void 0 ? void 0 : parcel.save();
    return parcel;
});
const approveParcel = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "No parcel found");
    }
    if ((parcel === null || parcel === void 0 ? void 0 : parcel.receiver.toString()) !== user.id) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid request");
    }
    if ((parcel === null || parcel === void 0 ? void 0 : parcel.status) !== parcel_interface_1.Status.REQUESTED) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid request");
    }
    parcel.status = parcel_interface_1.Status.APPROVED;
    parcel.trackingEvents.push({
        location: `${parcel.address.from.state}, ${parcel.address.from.city}`,
        note: "Approval from receiver",
        status: parcel_interface_1.Status.APPROVED,
        timestamp: new Date()
    });
    parcel.save();
    return parcel;
});
const getPresentParcelStatusDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    const presentStatus = parcel === null || parcel === void 0 ? void 0 : parcel.trackingEvents[parcel.trackingEvents.length - 1];
    return presentStatus;
});
const cancelParcel = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if ((parcel === null || parcel === void 0 ? void 0 : parcel.sender.toString()) !== userInfo.id) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized request");
    }
    if (![parcel_interface_1.Status.REQUESTED, parcel_interface_1.Status.APPROVED].includes(parcel === null || parcel === void 0 ? void 0 : parcel.status)) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, `You cann't cancel the ${parcel === null || parcel === void 0 ? void 0 : parcel.status} parcel`);
    }
    parcel.isCanceled = true;
    parcel === null || parcel === void 0 ? void 0 : parcel.save();
    return parcel;
});
exports.parcelServices = {
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
};
