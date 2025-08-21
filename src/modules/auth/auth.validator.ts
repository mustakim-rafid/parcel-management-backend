import z from "zod"

export const userLoginZodSchema = z.object({
    email: z.string({invalid_type_error: "Email must be a string"}).email("Invalid email").min(3, "Email too short"),

    password: z.string().min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character"),
})

export const resetPasswordZodSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, "Password length must be at least 6").regex(/(?=.*[A-Z])/, "Password must have at least one uppercase letter").regex(/(?=.*\d)/, "Password must have at least one digit").regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must have at least one special character")
})