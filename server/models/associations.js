import Products from './products.models.js';
import ProductImage from './productimage.models.js';
import Orders from './orders.models.js';
import Order_Items from './orderitems.models.js';
import Users from './users.models.js';
import Categories from './categories.models.js';
import Cart from './cart.model.js';
import User from './users.models.js';
import Ratings from './rating.model.js';

Users.hasMany(Orders, { foreignKey: 'userId', onDelete: 'CASCADE' });
Orders.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

Products.hasMany(ProductImage, { foreignKey: 'pro_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Products, { foreignKey: 'pro_id', onDelete: 'CASCADE' });

Orders.hasMany(Order_Items, { foreignKey: 'orderId', as: 'orderItems', onDelete: 'CASCADE' });
Order_Items.belongsTo(Orders, { foreignKey: 'orderId', onDelete: 'CASCADE' });

Products.hasMany(Order_Items, { foreignKey: 'productId', as: 'orderItems', onDelete: 'CASCADE' });
Order_Items.belongsTo(Products, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });

Products.belongsTo(Categories, { foreignKey: "cat_id", as: "category" });
Categories.hasMany(Products, { foreignKey: "cat_id", as: "products" });

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Cart.belongsTo(Products, {
    foreignKey: 'pro_id',
    onDelete: 'CASCADE',
});

Cart.belongsTo(Products, { foreignKey: 'pro_id', onDelete: 'CASCADE', as: 'product' });

Users.hasMany(Ratings, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Ratings.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

Products.hasMany(Ratings, { foreignKey: 'pro_id', onDelete: 'CASCADE', as: 'ratings' });
Ratings.belongsTo(Products, { foreignKey: 'pro_id', as: 'product' });


export { Products, ProductImage, Orders, Order_Items, Users, Cart, Ratings };
