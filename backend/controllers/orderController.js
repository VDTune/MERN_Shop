import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { Stripe } from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const frontend_url = "http://localhost:5173"
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.user.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.user.userId, {cartData: {}});

        const line_items = req.body.items.map((item) =>({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));
        line_items.push({
            price_data:{
                currency: "usd",
                product_data:{
                    name: "Delivery Charges",
                },
                unit_amount: 1000,
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.json({success: true, session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// xác thực đơn hàng
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            res.json({success: true, message: "Payment successful"})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success: false, message: "Payment failed"})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { placeOrder, verifyOrder };