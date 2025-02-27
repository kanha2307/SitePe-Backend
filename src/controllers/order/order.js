import  Order  from "../../models/order.js"
import  Branch  from "../../models/branch.js"
import { Customer, DeliveryPartner } from "../../models/user.js"


export const createOrder = async (req, res) => {
    try{
        const {userId} = req.user
        const { items, branch, totalPrice } = req.body
        console.log(userId, items, branch, totalPrice)

        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch)

        if(!customerData){
            return res.status(404).send({message: "Customer not found"})
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "No address available"
            },
            pickupLocation:{
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || "No address available"
            }
        })

        const savedOrder = await newOrder.save()
        console.log(savedOrder)
        return res.status(201).send({message: "Order Created", data: savedOrder})
    } catch(error){
        console.log(error)
        return res.status(500).send("failed to create order", error)
    }
}

export const confirmOrder = async (req, res) => {
    try{
        const { orderId } = req.params
        const { userId } = req.user
        const { deliveryPartnerLocation } = req.body
        console.log("user location",deliveryPartnerLocation)
        const deliveryPerson = await DeliveryPartner.findById(userId)
        if(!deliveryPerson){
            return res.status(404).send({message: "Delivery Partner not found"})
        }
        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).send({message: "Order not found"})
        }
        if(order.status !== 'available'){
            return res.status(404).send({message: "Order is not available"})
        }
        order.status = "confirmed"
        order.deliveryPartner = userId
        order.deliveryPersonLocation = {
            latitude: deliveryPartnerLocation.latitude,
            longitude: deliveryPartnerLocation.longitude,
            address: deliveryPartnerLocation.address || ""
        }
        req.server.io.to(orderId).emit("orderConfirmed", order)
        await order.save()
        return res.send(order) 
    } catch(error){
        console.log(error)
        return res.status(500).send({message: "Failed to confirm order", error})
    }
}

export const updateOrderStatus = async (req, res) => {
    try{
        const {orderId} = req.params
        const { status, deliveryPersonLocation } = req.body
        const { userId } = req.user

        const deliveryPartner = await DeliveryPartner.findById(userId)
        if(!deliveryPartner){
            return res.status(404).send({message: "Delivery partner not found"})
        }
        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).send({message: "Order not found"})
        }
        if(['cancelled', 'delivered']. includes(order.status)){
            return res.status(400).send({message: "Order cannot be updated"})
        }
        if(order.deliveryPartner.toString() !== userId){
            return res.status(403).send({message: "Unauthorized "})
        }
        order.status = status
        order.deliveryPersonLocation = deliveryPersonLocation 
        await order.save()
        req.server.io.to(orderId).emit("liveTrackingUpdates", order)
        return res.send(order) 
    } catch(error){
        return res.status(500).send({message: "Failed to update order status", error})
    }
}

export const getOrders = async (req, res) => {
    try{
        const {status, customerId, deliveryPartnerId, branchId} =  req.query
        let query = {}
        if(status){
            query.status = status
        }
        if(customerId){
            query.customer = customerId
        }
        if(deliveryPartnerId){
            query.deliveryPartner = deliveryPartnerId
            query.branch = branchId
        }
        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
        return res.send(orders)
    } catch(error){
        res.status(500).send({message: "Failed to retrieve orders", error})
    }
}

export const getOrderById = async (req, res) => {
    try{
        const {orderId} =  req.params
        console.log("orderId", orderId)
        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        )

        if(!order){
            return res.status(404).send({message: "Order not found"})

        }
        return res.send(order)
    } catch(error){
        console.log("error from order", error)
        res.status(500).send({message: "Failed to retrieve order", error})
    }
}