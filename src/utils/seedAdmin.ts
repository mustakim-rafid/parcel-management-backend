import { getEnvs } from "../config/envconfig"
import { IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"

export const createAdmin = async () => {
    try {
        const isAdminExists = await User.findOne({
            email: getEnvs().ADMIN_EMAIL
        })

        if (isAdminExists) {
            console.log("Admin account already created")
            return
        }

        const adminUserObject: Partial<IUser> = {
            name: "Admin",
            email: getEnvs().ADMIN_EMAIL,
            password: getEnvs().ADMIN_PASSWORD,
            phone: "+880133333333",
            role: Role.ADMIN,
            address: {
                state: "CKB",
                street: "2no. road",
                zip: "0000",
                city: "CTG",
                country: "BD"
            }
        }
    
        const adminUser = await User.create(adminUserObject)
        console.log("Admin created successfully")
    } catch (error) {
        console.log("Something went wrong while creating the ADMIN user.", error)
    }
}