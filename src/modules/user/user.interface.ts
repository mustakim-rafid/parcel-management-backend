import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    RECEIVER = "RECEIVER",
    SENDER = "SENDER"
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IUser {
    id?: Types.ObjectId
    name?: string;
    email: string;
    password: string;
    role: Role;
    isVerified: boolean;
    isBlocked: boolean;
    phone: string;
    address: IAddress;
}