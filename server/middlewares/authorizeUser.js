import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authorizeUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            console.error("No authorization header provided");
            return res.status(401).json({ message: "No authorization header provided" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            console.error("Invalid token format");
            return res.status(400).json({ message: "Invalid token format" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT Error:", err.message);

                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({ message: "Server : Token expired. Please log in again." });
                }
                return res.status(403).json({ message: "Invalid token" });
            }

            req.user = decoded;
            next();
        });
    }
    catch (err) {
        console.error(`Error in middleware: ${err.message}`);
        return res.status(500).json({ message: err.message });
    }
}

export default authorizeUser;