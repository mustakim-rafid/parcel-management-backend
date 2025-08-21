import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { parcelRouter } from "../modules/parcel/parcel.route";

const router = Router()

interface IEndPoints {
    path: string;
    destination: Router
}

const endPoints: IEndPoints[] = [
    {
        path: "user",
        destination: userRouter
    },
    {
        path: "auth",
        destination: authRouter
    },
    {
        path: "parcel",
        destination: parcelRouter
    }
]

endPoints.forEach((endPoint) => {
    router.use(`/${endPoint.path}`, endPoint.destination)
})

export default router

