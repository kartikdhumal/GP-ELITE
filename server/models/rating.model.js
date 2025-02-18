import { DataTypes } from 'sequelize';
import sequelize from '../database/connectDB.js';
import User from './users.models.js';
import Products from './products.models.js';

const Ratings = sequelize.define("Ratings", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [2, 500]
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    pro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "ratings",
    timestamps: false
});

export default Ratings;
