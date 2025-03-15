import { Customer } from "../../models/user.js";

/**
 * Get all addresses of a customer
 */
export const getAddresses = async (req, res) => {
    try {
        // const {userId} = req.body  // Ensure user ID exists
        const userId = req.user?.userId;  // Ensure user ID exists

        console.log("Backend received userId:", userId);

        if (!userId) {
            return res.status(400).send({ message: "User ID missing from request" });
        }

        const customer = await Customer.findById(userId).select("addresses");
        if (!customer) {
            return res.status(404).send({ message: "Customer not found" });
        }
        return res.send(customer.addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return res.status(500).send({ message: "Error fetching addresses", error });
    }
};

/**
 * Add a new address
 */
export const addAddress = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).send({ message: "User ID missing from request" });
        }

        const { latitude, longitude, address, landmark, type } = req.body;

        if (!latitude || !longitude || !address) {
            return res.status(400).send({ message: "Latitude, longitude, and address are required" });
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        // Push new address to user's addresses array
        const newAddress = { latitude, longitude, address, landmark, type };
        customer.addresses.push(newAddress);
        await customer.save();

        return res.send({ message: "Address added successfully", addresses: customer.addresses });
    } catch (error) {
        console.error("Error adding address:", error);
        return res.status(500).send({ message: "Error adding address", error });
    }
};

/**
 * Update an existing address
 */
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).send({ message: "User ID missing from request" });
        }

        const { addressId, latitude, longitude, address, landmark, type } = req.body;

        const customer = await Customer.findById(userId);
        if (!customer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        const addressToUpdate = customer.addresses.id(addressId);
        if (!addressToUpdate) {
            return res.status(404).send({ message: "Address not found" });
        }

        // Update fields
        addressToUpdate.latitude = latitude;
        addressToUpdate.longitude = longitude;
        addressToUpdate.address = address;
        addressToUpdate.landmark = landmark;
        addressToUpdate.type = type;

        await customer.save();
        return res.send({ message: "Address updated successfully", addresses: customer.addresses });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).send({ message: "Error updating address", error });
    }
};
/**
 * Delete an address
 */
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(400).send({ message: "User ID missing from request" });
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        // Filter out the address to be deleted
        customer.addresses = customer.addresses.filter(addr => addr._id.toString() !== addressId);
        await customer.save();

        return res.send({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        return res.status(500).send({ message: "Error deleting address", error });
    }
};