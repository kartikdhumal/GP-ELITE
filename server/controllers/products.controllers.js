import 'dotenv/config'
import { Products, ProductImage, Ratings } from '../models/associations.js'
import sequelize from '../database/connectDB.js';
import Categories from '../models/categories.models.js';
import { Op } from 'sequelize';

const getProducts = async (req, res) => {

    try {

        const products = await Products.findAll({
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['imageUrl'],
                },
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['name'],
                }, {
                    model: Ratings,
                    as: 'ratings',
                    attributes: ['rating', 'feedback', 'pro_id'],
                }
            ]
        });

        return res.status(200).json({ message: "Products successfully fetched", products });
    }
    catch (err) {
        console.error('Error fetching products:', err.message);
        return res.status(500).json({ error: err.message });
    }
}

const addProducts = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, description, price, quantity, cat_id, productImages } = req.body;

        if (!name || !description || !price || !quantity || !cat_id || !Array.isArray(productImages) || productImages.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let existingProduct = await Products.findOne({ where: { name } });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists" });
        }

        let newProduct = await Products.create({ name, description, price, quantity, cat_id }, { transaction });

        const imagesToInsert = productImages.map(img => ({
            imageUrl: img,
            pro_id: newProduct.id,
        }));
        await ProductImage.bulkCreate(imagesToInsert, { transaction });

        await transaction.commit();
        return res.status(201).json({ message: "Product added successfully!", newProduct });

    } catch (err) {
        await transaction.rollback();
        console.error('Error adding products:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

const getProductByID = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Products.findOne({
            where: { id },
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['imageUrl'],
                },
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['name'],
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product successfully fetched", product });
    } catch (err) {
        console.error('Error fetching product:', err.message);
        return res.status(500).json({ error: err.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Products.findByPk(id, {
            include: {
                model: ProductImage,
                as: 'images',
                attributes: ['imageUrl'],
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();

        return res.status(200).json({ message: "Product successfully deleted", product });
    }
    catch (err) {
        console.error('Error deleting product:', err.message);
        return res.status(500).json({ error: err.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, cat_id, productImages } = req.body;

        const product = await Products.findByPk(id, {
            include: {
                model: ProductImage,
                as: 'images',
                attributes: ['id', 'imageUrl'],
            },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.update({ name, description, price, quantity, cat_id });

        if (productImages && productImages.length > 0) {

            await ProductImage.destroy({ where: { pro_id: id } });

            const imageRecords = productImages.map((imgUrl) => ({
                pro_id: id,
                imageUrl: imgUrl,
            }));

            await ProductImage.bulkCreate(imageRecords);
        }

        return res.status(200).json({ message: "Product successfully updated", product });
    } catch (err) {
        console.error("Error updating product:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { searchquery } = req.params;

        const products = await Products.findAll({
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['imageUrl'],
                },
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['name'],
                }
            ],
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchquery}%` } },
                    { description: { [Op.like]: `%${searchquery}%` } },
                    { price: { [Op.like]: `%${searchquery}%` } },
                    sequelize.literal(`(SELECT name FROM categories WHERE categories.id = products.cat_id) LIKE '%${searchquery}%'`)
                ]
            }
        });

        return res.status(200).json({ message: "Products successfully fetched", products });
    } catch (err) {
        console.error("Search Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
};


export { getProducts, addProducts, getProductByID, deleteProduct, updateProduct, searchProducts };