import 'dotenv/config'
import Categories from '../models/categories.models.js'
import { Op } from 'sequelize';


const addCategories = async (req, res) => {
    try {
        let name = req.body.name;
        let existingCategory = await Categories.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(500).json({ message: "Category already exists" });
        }
        const newCategory = await Categories.create({ name });
        return res.status(201).json({ message: "Category added successfully", newCategory });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        return res.status(200).json({ message: "Catgories successfully fetched", categories });
    }
    catch (err) {
        console.error('Error fetching categories:', err.message);
        return res.status(500).json({ error: err.message });
    }
}

const deleteCategories = async (req, res) => {
    try {
        const id = req.params.id;
        let category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting category:', err.message);
        res.status(500).json({ message: err.message });
    }
}

const updateCategories = async (req, res) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        let category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const existingCategory = await Categories.findOne({
            where: { name, id: { [Op.ne]: id } }
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category name already exists' });
        }

        await category.update({ name });
        res.json({ message: 'Category updated successfully', category });
    }
    catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ message: 'Failed to update category' });
    }
}

const getCategoryByID = async (req, res) => {
    try {
        const id = req.params.id;
        let category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category fetched successfully', category });
    }
    catch (err) {
        console.error('Error fetching category:', err.message);
        res.status(500).json({ message: err.message });
    }
}

export { addCategories, getCategories, deleteCategories, updateCategories, getCategoryByID }