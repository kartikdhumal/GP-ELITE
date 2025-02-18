import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASS, {
    host: process.env.HOST,
    dialect: "mysql",
    logging:false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL Connection Successful");
    } catch (error) {
        console.error("MySQL Connection Error:", error);
        process.exit(1);
    }
};

connectDB();

export default sequelize;
