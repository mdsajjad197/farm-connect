import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const product = await Product.findById(req.body.productId);

  const order = await Order.create({
    userId: req.user.id,
    consumerId: product.consumerId,
    productId: product._id,
    quantity: req.body.quantity,
    totalPrice: product.price * req.body.quantity
  });

  res.json(order);
};
