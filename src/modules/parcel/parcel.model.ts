import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, Status } from "./parcel.interface";
import { addressSchema, User } from "../user/user.model";

const statusLogSchema = new Schema<IStatusLog>({
    trackingId: {
        type: String,
        unique: true
    },
    location: String,
    note: String,
    status: {
        type: String,
        enum: Object.values(Status)
    },
    timestamp: Date
}, {
    versionKey: false,
    _id: false
})

statusLogSchema.pre("save", async function(next) {
    if (!this.isNew) {
        return next()
    }
    const date = new Date()
    const trackingId = `TRK-${date.toISOString().slice(0, 10).split("-").join("")}-${Math.floor(Math.random() * 900000 + 100000)}`
    this.trackingId = trackingId

    next()
})

const parcelSchema = new Schema<IParcel>({
    type: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    address: {
        from: addressSchema,
        to: addressSchema
    },
    fee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.REQUESTED
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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

parcelSchema.pre("save", async function(next) {
    if (!this.isNew) {
        return next()
    }
    const sender = await User.findById(this.sender)
    const receiver = await User.findById(this.receiver)

    this.address.from = sender?.address!
    this.address.to = receiver?.address!
    const date = new Date()
    const trackingId = `TRK-${date.toISOString().slice(0, 10).split("-").join("")}-${Math.floor(Math.random() * 900000 + 100000)}`
    this.trackingEvents.push({
        trackingId,
        location: `${sender?.address.state}, ${sender?.address.city}`,
        note: "Parcel created, waiting for approval",
        status: Status.REQUESTED,
        timestamp: new Date()
    })

    next()
})

export const Parcel = model<IParcel>("Parcel", parcelSchema)

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
