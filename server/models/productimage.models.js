import { DataTypes } from 'sequelize';
import sequelize from '../database/connectDB.js';
import Products from './products.models.js';

const ProductImage = sequelize.define('ProductImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pro_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Products,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'product_image',
    timestamps: false,
});


export default ProductImage;
