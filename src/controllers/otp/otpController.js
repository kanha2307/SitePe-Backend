import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStore = {}; // Temporary in-memory storage

export async function sendOtpController(req, reply) {
    const { phoneNumber } = req.body;
    console.log("phoneNumber",phoneNumber);
    

    if (!phoneNumber) {
        return reply.status(400).send({ success: false, message: "Phone number is required" });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[phoneNumber] = otp;

        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });

        return reply.send({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return reply.status(500).send({ success: false, message: "Failed to send OTP" });
    }
}

export async function verifyOtpController(req, reply) {
    const { phoneNumber, otp } = req.body;
    console.log("verify",typeof phoneNumber,typeof otp);
    
    if (!phoneNumber || !otp) {
        return reply.status(400).send({ success: false, message: "Phone number and OTP are required" });
    }

    try {
        if (otpStore[phoneNumber] == otp) {
            delete otpStore[phoneNumber];
            return reply.send({ success: true, message: "OTP verified successfully" });
        } else {
            return reply.status(400).send({ success: false, message: "Invalid OTP" });
        }
        
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return reply.status(500).send({ success: false, message: "Failed to verify OTP" });
    }
}
