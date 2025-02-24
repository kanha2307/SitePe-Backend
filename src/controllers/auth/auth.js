import { Customer, DeliveryPartner } from "../../models/user.js";
import jwt from 'jsonwebtoken'

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {userId: user._id, role: user.role}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1d'}
    )
    const refreshToken = jwt.sign(
        {userId: user._id, role: user.role}, 
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    )
    return {accessToken, refreshToken}
}

export const loginCustomer = async(req, res) => {
    try{
        const {phone} = req.body
        console.log("phone",phone);
        
        let customer = await Customer.findOne({phone})
        if(!customer){
            customer = new Customer({
                phone,
                role: "Customer"
            })
            await customer.save()
        }
        const {accessToken, refreshToken} = generateTokens(customer) 
        return res.send({
            message: customer ? "Login Successful" : "Customer created and logged in.",
            accessToken,
            refreshToken,
            customer
        })
    } catch(error){
        return res.status(500).send({message: "An error occurred", error})
    }
}



export const loginDeliveryPartner = async(req, res) => {
    try{
        const {email, password} = req.body
        let deliveryPartner = await DeliveryPartner.findOne({email})
        if(!deliveryPartner){
            delivery = new DeliveryPartner({
                phone,
                role: "DeliveryPartner"
            })
            await DeliveryPartner.save()
        }
        const isMatch = password == deliveryPartner.password
        if(!isMatch){
            return res.status(400).send({message: "Invalid Credentials"})
        }
        const isActivated = deliveryPartner.isActivated
        if(!isActivated){
            return res.status(400).send({message: "User is not activated"})
        }
        const {accessToken, refreshToken} = generateTokens(deliveryPartner)
        return res.send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            deliveryPartner
        })
    } catch(error){
        return res.status(500).send({message: "An error occurred", error})
    }
}

export const refreshToken = async(req, res) => {
    const {refreshToken} = req.body
    if(!refreshToken){
        return res.status(401).send({message: "Refresh token required"})
    }
    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        let user
        if(decoded.role == "Customer"){
            user = await Customer.findById(decoded.userId)
        } else if(decoded.role == "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId)
        } else{
            return res.status(403).send({message: "Invalid Role"})
        }
        const {accessToken, refreshToken: newRefreshToken} = generateTokens(user)
        return res.send({
            message: "Token Refreshed",
            accessToken,
            refreshToken: newRefreshToken
        })
    } catch(error){
        return res.status(403).send({message: "Invalid Refresh Token"})
    }
}

export const fetchUser = async(req, res) => {
    try{
        const {userId, role} = req.user
        let user
        if(role == "Customer"){
            user = await Customer.findById(userId)
        } else if(role == "DeliveryPartner"){
            user = await DeliveryPartner.findById(userId)
        } else{
            return res.status(403).send({message: "Invalid Role"})
        }
        if(!user){
            res.status(404).send({message: "User not found"})
        }
        return res.send({
            message: "User fetched successfully",
            user
        })
    } catch(error){
        return res.status(500).send({message: "An error occurred", error})
    }
}