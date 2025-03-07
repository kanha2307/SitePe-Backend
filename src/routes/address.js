import { getUserAddresses, addAddress } from "../controllers/address/address.js"
import { verifyToken } from "../middleware/auth.js"

export const addressRoutes = async (fastify, options) => {
    fastify.addHook("preHandler", async (request, response) => {
        const isAuthenticated = await verifyToken(request, response)
        if (!isAuthenticated) {
            return response.code(401).send({ message: "Unauthenticated" })
        }
    })
    
    fastify.get('/address', getUserAddresses)
    fastify.post('/address', addAddress)
}
