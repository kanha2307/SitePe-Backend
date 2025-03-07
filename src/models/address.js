import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    landmark: { type: String }, // Optional landmark for better precision
    type: {
        type: String,
        enum: ["home", "work", "other"], // Different address types
        default: "home"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update `updatedAt` on every update
addressSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
