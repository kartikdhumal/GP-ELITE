import User from '../models/users.models.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const registerUser = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: "User Already Exists" });
        }

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        role = role.trim().toLowerCase();

        const newUser = await User.create({ name, email, password: hashedPass, role });

        const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

        return res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    }
    catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({
            message: "Failed to register user",
            error: err.message
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "User doesn't exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });

        return res.status(200).json({
            message: "Logged in successfully!",
            token
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to login user", error: err.message });
    }
}

const getUserDetails = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ error: 'Invalid token format or missing authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email, name, role, exp } = decoded;

        return res.status(200).json({
            message: "Token verified successfully",
            userDetails: { id, email, name, role, exp }
        });
    }
    catch (err) {
        console.error('Error decoding token:', err.message);
        return res.status(401).json({ error: err.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({ message: "Users successfully fetched", users });
    }
    catch (err) {
        console.error('Error fetching users:', err.message);
        return res.status(500).json({ error: err.message });
    }
}

const addUsers = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: "User Already Exists" });
        }

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        role = role.trim().toLowerCase();

        const newUser = await User.create({ name, email, password: hashedPass, role });

        return res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
        });
    }
    catch (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({
            message: err.message
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        if (!name && !email && !password && !role) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        let user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashedPass = await bcrypt.hash(password, 10);
            user.password = hashedPass;
        }
        if (role) user.role = role.trim().toLowerCase();

        await user.save();

        return res.status(200).json({
            message: "User updated successfully!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    } catch (err) {
        console.error('Error updating user:', err.message);
        return res.status(500).json({
            message: 'Failed to update user',
            error: err.message
        });
    }
};


export { registerUser, loginUser, getUserDetails, getUsers, addUsers, deleteUser , updateUser };