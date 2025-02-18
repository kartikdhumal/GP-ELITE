import { DataTypes } from "sequelize";
import sequelize from "../database/connectDB.js";

const Categories = sequelize.define("Categories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
}, { timestamps: false });

export default Categories;