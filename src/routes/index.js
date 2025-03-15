import { addressRoutes } from "./address.js"
import adminRoutes from "./admin.js"
import { authRoutes } from "./auth.js"
import { orderRoutes } from "./order.js"
import { otpRoutes } from "./otp.js"
import { categoryRoutes, productRoutes } from "./product.js"


const prefix = '/api'

export const registerRoutes = async (fastify) => {
    fastify.register(authRoutes, {prefix: prefix})
    fastify.register(productRoutes, {prefix: prefix})
    fastify.register(categoryRoutes, {prefix: prefix})
    fastify.register(orderRoutes, {prefix: prefix})
    fastify.register(addressRoutes , {prefix: prefix})
    fastify.register(adminRoutes, { prefix: `${prefix}/admin` });
    fastify.register(otpRoutes, { prefix });
}