import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorhandler.js";

const auth = (req, res, next) => {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (!token) {
        return next(new AppError("No token provided", 401));
    }

    

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            
            if (err.name === "TokenExpiredError") {
                return next(new AppError("Token has expired, please log in again", 401));
            }
            return next(new AppError("Failed to authenticate token", 401));
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new AppError("Forbidden", 403));
    }
    next();
};

export { auth, isAdmin };
