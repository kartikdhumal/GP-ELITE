import { Cart, ProductImage } from '../models/associations.js';
import Products from '../models/products.models.js';
import User from '../models/users.models.js';

const addToCart = async (req, res) => {
    const { user_id, pro_id, quantity } = req.body;

    try {
        const product = await Products.findByPk(pro_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingCartItem = await Cart.findOne({
            where: { user_id, pro_id },
        });

        if (existingCartItem) {
            return res.status(400).json({
                message: 'This product is already in your cart',
                existingCartItem,
            });
        }


        const newCartItem = await Cart.create({
            user_id,
            pro_id,
            quantity,
        });

        return res.status(201).json({
            message: 'Added to cart successfully',
            newCartItem,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const fetchCarts = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { user_id: req.params.id },
            include: [
                {
                    model: Products,
                    as: "product",
                    attributes: ["id", "name", "price", "quantity", "description"],
                    include: [
                        {
                            model: ProductImage,
                            as: "images",
                            attributes: ["imageUrl"],
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({ message: "Cart fetched successfully", cart: cartItems });
    } catch (err) {
        console.error("Error fetching cart:", err.message);
        return res.status(500).json({ error: err.message });
    }
};


const updatedQuantity = async (req, res) => {
    let { cart_id, pro_id, quantity } = req.body;

    try {
        const cartItem = await Cart.findOne({
            where: { id: cart_id, pro_id },
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than zero' });
        }

        await cartItem.update({ quantity });

        return res.status(200).json({
            message: 'Cart item quantity updated successfully',
            updatedCartItem: cartItem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const deleteCart = async (req, res) => {
    try {
        const id = req.params.id;
        let cart = await Cart.findByPk(id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart product not found' });
        }
        await cart.destroy();
        res.status(200).json({ message: 'Cart deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting cart:', err.message);
        res.status(500).json({ message: err.message });
    }
}



export { addToCart, fetchCarts, updatedQuantity, deleteCart };
