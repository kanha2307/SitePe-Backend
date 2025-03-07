// import Address from "../../models/Address.js"
import Address from "../../models/address.js"

export const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.query
        const addresses = await Address.find({ userId })
        
        if (!addresses.length) {
            return res.status(404).send({ message: "No addresses found" })
        }

        return res.send(addresses)
    } catch (error) {
        console.log("Error fetching addresses:", error)
        res.status(500).send({ message: "Failed to retrieve addresses", error })
    }
}

export const addAddress = async (req, res) => {
    try {
        const newAddress = new Address(req.body)
        await newAddress.save()

        return res.status(201).send(newAddress)
    } catch (error) {
        console.log("Error adding address:", error)
        res.status(500).send({ message: "Failed to add address", error })
    }
}
