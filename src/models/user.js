import mongoose, { Schema }  from "mongoose";


const addressSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String },
    type: { type: String, enum: ["Home", "Work", "Other"],default:"Home", required: true } // Define types
  });
  
//Customer Schema
const customerSchema = new Schema({
    name: {type: String},
    role: {
        type: String,
        enum: ["Customer", "Admin", "Delivery Partner"],
        required: true
    },
    isActivated: {type: Boolean, default: false},
    phone: {type: Number, required: true, unique: true},
    role: {type: String, enum: ["Customer"], default: "Customer"},
    liveLocation:{
        latitude: {type: String},
        longitude: {type: String}
    },
    addresses: [addressSchema]

})

//Delivery Partner Schema
const deliveryPartnerSchema = new Schema({
    name: {type: String},
    role: {
        type: String,
        enum: ["Customer", "Admin", "Delivery Partner"],
        required: true
    },
    isActivated: {type: Boolean, default: false},
    phone: {type: Number, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: Number, required: true},
    role: {type: String, enum: ["DeliveryPartner"], default: "DeliveryPartner"},
    liveLocation:{
        latitude: {type: String},
        longitude: {type: String}
    },
    address: {type: String},
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    }
})

//Admin Schema
const adminSchema = new Schema({
    name: {type: String},
    role: {
        type: String,
        enum: ["Customer", "Admin", "Delivery Partner"],
        required: true
    },
    isActivated: {type: Boolean, default: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["Admin"], default: "Admin"},
})

export const Customer = mongoose.model("Customer", customerSchema)
export const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema)
export const Admin = mongoose.model("Admin", adminSchema)