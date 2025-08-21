import { Types } from "mongoose";
import { IAddress } from "../user/user.interface";

export enum Status {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    DISPATCHED = "DISPATCHED",
    INTRANSIT = "INTRANSIT",
    DELIVERED = "DELIVERED"
}

export interface IStatusLog {
    trackingId?: string;
    location: string;
    timestamp: Date;
    status: Status;
    note: string
}

export interface IParcel {
    type: string;
    weight: string;
    address: {
        from: IAddress
        to: IAddress
    };
    fee: number;
    status: Status;
    deliveryDate: Date;
    isCanceled: boolean;
    trackingEvents: IStatusLog[];
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
}