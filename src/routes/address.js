import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/address/addressController.js";
import { verifyToken } from "../middleware/auth.js";

export const addressRoutes = async (fastify, options) => {
    fastify.get('/addresses', { preHandler: [verifyToken] },getAddresses);
    fastify.post('/addresses', { preHandler: [verifyToken] }, addAddress);
    fastify.patch('/addresses', { preHandler: [verifyToken] }, updateAddress);
    fastify.delete('/addresses/:addressId', { preHandler: [verifyToken] }, deleteAddress);
};
