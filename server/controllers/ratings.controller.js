import sequelize from "../database/connectDB.js";
import { Ratings, Products, Users } from "../models/associations.js";

const fetchRating = async (req, res) => {
    try {
        let ratings = await Ratings.findAll({
            include: [
                {
                    model: Products,
                    as: "product",
                    attributes: ['id', 'name', 'price']
                },
                {
                    model: Users,
                    as: "user",
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(200).json({ message: "Ratings fetched Successfully", ratings });
    } catch (err) {
        console.error("Error fetching ratings:", err.message);
        res.status(500).json({ message: "Failed to fetch ratings" });
    }
};

const fetchRatingByProId = async (req, res) => {
    const { id } = req.params;

    try {
        let ratings = await Ratings.findAll({
            where: {
                pro_id: id
            },
            include: [
                {
                    model: Products,
                    as: "product",
                    attributes: ['id', 'name', 'price']
                },
                {
                    model: Users,
                    as: "user",
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        let avgRating = await Ratings.findOne({
            where: { pro_id: id },
            attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]]
        });

        res.status(200).json({ message: "Ratings fetched Successfully", ratings, avgRating: avgRating?.dataValues.avgRating || 0 });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ error: "Failed to fetch ratings" });
    }
}

const addRating = async (req, res) => {
    const { user_id, pro_id, rating, feedback } = req.body;

    try {
        if (!user_id || !pro_id || !rating || rating < 1 || rating > 5 || !feedback) {
            return res.status(400).json({ message: "Invalid input data. Please provide valid user_id, pro_id, rating (1-5), and feedback." });
        }

        const existingRating = await Ratings.findOne({
            where: {
                user_id: user_id,
                pro_id: pro_id
            }
        });

        if (existingRating) {
            return res.status(400).json({ message: "You have already given a rating for this product." });
        }

        const newRating = await Ratings.create({
            user_id: user_id,
            pro_id: pro_id,
            rating: rating,
            feedback: feedback
        });

        res.status(201).json({
            message: "Rating added successfully!",
            rating: newRating
        });
    } catch (err) {
        console.error("Error adding rating:", err.message);
        res.status(500).json({ message: "Failed to add rating" });
    }
};

const deleteRating = async (req, res) => {
    const { user_id, pro_id } = req.params;

    try {
        const existingRating = await Ratings.findOne({
            where: {
                user_id: user_id,
                pro_id: pro_id
            }
        });

        if (!existingRating) {
            return res.status(404).json({ message: "Rating not found for this user and product." });
        }

        await existingRating.destroy();

        res.status(200).json({
            message: "Rating deleted successfully!"
        });
    } catch (err) {
        console.error("Error deleting rating:", err.message);
        res.status(500).json({ message: "Failed to delete rating" });
    }
};

export { fetchRating, fetchRatingByProId, addRating, deleteRating };
