import z from "zod";
import { Status } from "./parcel.interface";

export const parcelCreateZodSchema = z.object({
    type: z.string(),
    weight: z.string(),
    fee: z.string().transform(val => Number(val)),
    status: z.nativeEnum(Status, {message: "Invalid status"}).optional(),
    deliveryDate: z.string().transform(val => new Date(val)),
    sender: z.string().length(24, {message: "Sender's id must be a 24 characters string"}),
    receiver: z.string().length(24, {message: "Receiver's id must be a 24 characters string"}),
})

export const parcelUpdateZodSchema = z.object({
    type: z.string().optional(),
    weight: z.string().optional(),
    fee: z.number().optional(),
    status: z.nativeEnum(Status, {message: "Invalid status"}).optional(),
    deliveryDate: z.string().transform(val => new Date(val)).optional(),
    receiver: z.string().optional()
})

export const parcelStatusUpdateZodSchema = z.object({
    location: z.string(),
    timestamp: z.string().transform(val => new Date(val)).optional(),
    status: z.nativeEnum(Status, {message: "Invalid status"}),
    note: z.string()
})

