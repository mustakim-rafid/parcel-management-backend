import express from "express"
import router from "./routes/router"
import { globalErrorHandler } from "./middleware/GlobalError"
import cookieParser from "cookie-parser"
import cors from "cors"
import { getEnvs } from "./config/envconfig"

const app = express()

app.use(cors({
    origin: getEnvs().FRONTEND_URL,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Parcel Management System"
    })
})

app.use("/api/v1", router)

app.use(globalErrorHandler)

export {
    app
}