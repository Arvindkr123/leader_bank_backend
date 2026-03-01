import jwt from "jsonwebtoken"
import UserModel from './../models/user.models.js';

async function authMiddleware(req, res, next) {

    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    console.log("Token from header:", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        const user = await UserModel.findById(decoded.userId);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

export default authMiddleware;
