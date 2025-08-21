import mongoose from "mongoose";
import { app } from "./app";
import { getEnvs } from "./config/envconfig";
import { createAdmin } from "./utils/seedAdmin";

const port = 5000

const startServer = async () => {
    try {
        await mongoose.connect(`${getEnvs().MONGO_URI}/parcel-management-db`)
        console.log("Database connected successfully")
        app.listen(port, () => {
            console.log(`Example app running at port ${port}`)
        })
    } catch (error) {
        console.log("Database connection failed!")
        process.exit(1)
    }
}

(async () => {
    await startServer()
    await createAdmin()
})()



