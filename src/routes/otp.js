import { sendOtpController,verifyOtpController}  from "../controllers/otp/otpController.js"


export const otpRoutes = async (fastify, options) => {
    fastify.post('/send-otp', sendOtpController);
    fastify.post('/verify-otp', verifyOtpController);
};
