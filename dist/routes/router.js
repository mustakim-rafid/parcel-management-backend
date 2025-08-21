"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const router = (0, express_1.Router)();
const endPoints = [
    {
        path: "user",
        destination: user_route_1.userRouter
    },
    {
        path: "auth",
        destination: auth_route_1.authRouter
    },
    {
        path: "parcel",
        destination: parcel_route_1.parcelRouter
    }
];
endPoints.forEach((endPoint) => {
    router.use(`/${endPoint.path}`, endPoint.destination);
});
exports.default = router;
