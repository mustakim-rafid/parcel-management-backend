import { model, Schema } from "mongoose";
import { IAddress, IUser, Role } from "./user.interface";
import bcryptjs from "bcryptjs"

export const addressSchema = new Schema<IAddress>({
    street: { 
        type: String, 
        required: true 
    },
    city:   { 
        type: String, 
        required: true 
    },
    state:  { 
        type: String, 
        required: true 
    },
    zip:    { 
        type: String, 
        required: true 
    },
    country:{ 
        type: String, 
        required: true 
    }
}, {
    versionKey: false,
    _id: false
})

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

userSchema.pre("save", async function(next) {
    this.password = await bcryptjs.hash(this.password, 10);

    next()
})

export const User = model<IUser>("User", userSchema)
