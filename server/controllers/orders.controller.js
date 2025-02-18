import sequelize from "../database/connectDB.js";
import { Orders, Order_Items, Users, Products, ProductImage, Cart } from "../models/associations.js";

const fetchOrders = async (req, res) => {
    try {
        let orders = await Orders.findAll({
            include: [
                {
                    model: Order_Items,
                    as: 'orderItems',
                    attributes: ['id', 'productId', 'quantity', 'price'],
                    include: [
                        {
                            model: Products,
                            as: 'product',
                            attributes: ['id', 'name', 'description', 'price'],
                            include: [
                                {
                                    model: ProductImage,
                                    as: 'images',
                                    attributes: ['imageUrl']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'name', 'email',],
                }
            ],
            order: [['createdAt', 'ASC']],
        });

        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
};

const changeStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        const order = await Orders.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({ message: "Error updating order status", error: err.message });
    }
};

const placeOrder = async (req, res) => {
    const { userId, address, payment_method } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const cartItems = await Cart.findAll({ where: { user_id: userId }, transaction });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Add items before placing an order." });
        }

        const cartItemsWithPrice = await Promise.all(cartItems.map(async (item) => {
            const product = await Products.findByPk(item.pro_id, { transaction });
            return {
                ...item.toJSON(),
                price: product ? product.price : 0,
            };
        }));

        const totalPrice = cartItemsWithPrice.reduce((total, item) => total + item.price * item.quantity, 0);

        const newOrder = await Orders.create(
            {
                userId,
                address,
                paymentMethod: payment_method,
                totalAmount: totalPrice,
                status: 'pending',
            },
            { transaction }
        );
        for (const item of cartItems) {
            const productCart = await Products.findByPk(item.pro_id, { transaction });

            if (!productCart || productCart.quantity < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Insufficient stock for product : ${item.pro_id}` });
            }

            await Order_Items.create(
                {
                    orderId: newOrder.id,
                    productId: item.pro_id,
                    quantity: item.quantity,
                    price: productCart.price,
                },
                { transaction }
            );

            const product = await Products.findByPk(item.pro_id, { transaction });

            if (!product || product.quantity < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Insufficient stock for product : ${item.name}` });
            }
            await product.update({ quantity: product.quantity - item.quantity }, { transaction });
        }
        await Cart.destroy({ where: { user_id: userId }, transaction });
        await transaction.commit();
        return res.status(201).json({ message: "Order placed successfully", order: newOrder });
    }
    catch (err) {
        await transaction.rollback();
        console.error(err);
        return res.status(500).json({ message: "Order placement failed", error: err.message });
    }
}


export { fetchOrders, changeStatus, placeOrder };
