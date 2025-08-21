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
exports.parcelControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const parcel_service_1 = require("./parcel.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const http_status_codes_1 = require("http-status-codes");
const createParcel = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.parcelServices.createParcel(req.body);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.CREATED, "New parcel created successfully!", parcel);
}));
const getAllParcel = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, value, limit, skip } = req.query;
    const parcels = yield parcel_service_1.parcelServices.getAllParcel(filter, value, Number(limit), Number(skip));
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "All parcel retrieved successfully", parcels);
}));
const getSenderParcels = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_service_1.parcelServices.getSenderParcels(req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcels retrieved successfully", parcels);
}));
const getReceiverParcels = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_service_1.parcelServices.getReceiverParcels(req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcels retrieved successfully", parcels);
}));
const getParcel = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.parcelServices.getParcel(req.params.id, req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcel retrieved successfully", parcel);
}));
const updateParcel = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUpdatedParcel = yield parcel_service_1.parcelServices.updateParcel(req.body, req.params.id, req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcel updated successfully", newUpdatedParcel);
}));
const updateParcelStatus = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelWithUpdatedStatus = yield parcel_service_1.parcelServices.updateParcelStatus(req.params.id, req.body);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcel status info updated successfully", parcelWithUpdatedStatus);
}));
const approveParcel = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelWithApproval = yield parcel_service_1.parcelServices.approveParcel(req.params.id, req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcel approved successfully", parcelWithApproval);
}));
const getPresentParcelStatusDetails = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presentStatus = yield parcel_service_1.parcelServices.getPresentParcelStatusDetails(req.params.id);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcel present status details retrieved successfully", presentStatus);
}));
const cancelParcel = (0, catchAsync_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedParcel = yield parcel_service_1.parcelServices.cancelParcel(req.params.id, req.user);
    (0, ApiResponse_1.ApiResponse)(res, http_status_codes_1.StatusCodes.OK, "Parcel canceled successfully", updateParcel);
}));
exports.parcelControllers = {
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
