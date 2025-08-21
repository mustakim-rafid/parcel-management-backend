"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const user_model_1 = require("../user/user.model");
const statusLogSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        unique: true
    },
    location: String,
    note: String,
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.Status)
    },
    timestamp: Date
}, {
    versionKey: false,
    _id: false
});
statusLogSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isNew) {
            return next();
        }
        const date = new Date();
        const trackingId = `TRK-${date.toISOString().slice(0, 10).split("-").join("")}-${Math.floor(Math.random() * 900000 + 100000)}`;
        this.trackingId = trackingId;
        next();
    });
});
const parcelSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    address: {
        from: user_model_1.addressSchema,
        to: user_model_1.addressSchema
    },
    fee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.Status),
        default: parcel_interface_1.Status.REQUESTED
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    isCanceled: {
        type: Boolean,
        default: false
    },
    trackingEvents: [statusLogSchema],
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});
parcelSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isNew) {
            return next();
        }
        const sender = yield user_model_1.User.findById(this.sender);
        const receiver = yield user_model_1.User.findById(this.receiver);
        this.address.from = sender === null || sender === void 0 ? void 0 : sender.address;
        this.address.to = receiver === null || receiver === void 0 ? void 0 : receiver.address;
        const date = new Date();
        const trackingId = `TRK-${date.toISOString().slice(0, 10).split("-").join("")}-${Math.floor(Math.random() * 900000 + 100000)}`;
        this.trackingEvents.push({
            trackingId,
            location: `${sender === null || sender === void 0 ? void 0 : sender.address.state}, ${sender === null || sender === void 0 ? void 0 : sender.address.city}`,
            note: "Parcel created, waiting for approval",
            status: parcel_interface_1.Status.REQUESTED,
            timestamp: new Date()
        });
        next();
    });
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
//   id: 'PARCEL123456',
//   type: 'Box', // or 'Envelope', 'Tube', etc.
//   weight: '2.5 kg',
//   sender: {
//     name: 'Alice Johnson',
//     phone: '+1 555-1234',
//     email: 'alice@example.com',
//   },
//   receiver: {
//     name: 'Bob Smith',
//     phone: '+1 555-5678',
//     email: 'bob@example.com',
//   },
//   address: {
//     from: {
//       street: '123 Main St',
//       city: 'New York',
//       state: 'NY',
//       zip: '10001',
//       country: 'USA',
//     },
//     to: {
//       street: '789 Market St',
//       city: 'San Francisco',
//       state: 'CA',
//       zip: '94103',
//       country: 'USA',
//     },
//   },
//   fee: {
//     base: 10.0,
//     tax: 0.8,
//     total: 10.8,
//     currency: 'USD',
//   },
//   deliveryDate: '2025-08-10T17:00:00Z',
//   statusLogs: [
//     {
//       status: 'Order Placed',
//       timestamp: '2025-08-01T09:00:00Z',
//       location: 'Online',
//     },
//     {
//       status: 'Dispatched',
//       timestamp: '2025-08-02T12:30:00Z',
//       location: 'New York, NY',
//     },
//     {
//       status: 'In Transit',
//       timestamp: '2025-08-04T08:00:00Z',
//       location: 'Chicago, IL',
//     },
//     {
//       status: 'Out for Delivery',
//       timestamp: '2025-08-06T07:45:00Z',
//       location: 'San Francisco, CA',
//     },
//   ],
// };
