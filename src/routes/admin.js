import bcrypt from "bcrypt";
import { Admin } from "../models/index.js";

export default async function adminRoutes(fastify, options) {
    fastify.post("/register", async (request, reply) => {
        try {
            const { name, email, password } = request.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return reply.status(400).send({ error: "Admin already exists" });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new admin
            const admin = new Admin({
                name,
                email,
                password: hashedPassword,
                role: "Admin",
                isActivated: true
            });

            await admin.save();
            return reply.status(201).send({ message: "Admin created successfully" });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
