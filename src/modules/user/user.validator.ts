import z from "zod"
import { Role } from "./user.interface"

const userAddressZodSchema = z.object({
    street: z.string({message: "Street inside address is required"}),
    city: z.string({message: "City inside address is required"}),
    state: z.string({message: "State inside address is required"}),
    zip: z.string({message: "Zip inside address is required"}),
    country: z.string({message: `Country inside address is required`})
}, {
    message: "Address is required"
})

export const userCreateZodSchema = z.object({
    name: z.string({invalid_type_error: "Name must be a string", message: "Name is required"}),

    email: z.string({invalid_type_error: "Email must be a string", message: "Email is required"}).email("Invalid email").min(3, "Email too short"),

    password: z.string({message: "Password is required"}).min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character"),

    phone: z.string({message: "Phone is required"}).regex(/^\+880\d{10}$/, "Phone number must be Bangladeshi valid number"),

    role: z.enum([Role.RECEIVER, Role.SENDER], {message: "Not a valid role"}),
    
    address: userAddressZodSchema
})

export const userUpdateZodSchema = z.object({
    name: z.string({invalid_type_error: "Name must be a string"}).optional(),

    email: z.string({invalid_type_error: "Email must be a string"}).email("Invalid email").min(3, "Email too short").optional(),

    password: z.string().min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character").optional(),

    phone: z.string().regex(/^\+880\d{10}$/, "Phone number must be Bangladeshi valid number").optional(),

    role: z.enum([Role.ADMIN, Role.RECEIVER, Role.SENDER], {message: "Not a valid role"}).optional(),

    isVerified: z.boolean().optional(),

    isBlocked: z.boolean().optional(),
    
    address: userAddressZodSchema.optional()
})