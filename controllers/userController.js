import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService.js";
import { AppError } from "../utils/errorhandler.js";

const getAllUsers = async (req, res,next) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
       return next(new AppError("Failed to fetch users", 500));
    }
}
   // auth
const registerUser = async (req, res,next) => {
        const { name, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10); 
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            res.status(201).json(user);
        } catch (error) {
            console.error(error); // Log the error for debugging
            return next(new AppError("Failed to register user", 400));
        }
}
const loginUser = async (req, res,next) => { 
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return next(new AppError("User not found", 404));
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(new AppError("Invalid password", 401));
            }
            const token = jwt.sign({id:user.id,role: user.role}, process.env.JWT_SECRET, { 
                expiresIn: '1h' 
              });

            res.status(200).json({token,user});
        } catch (error) {
            next(new AppError("Failed to login user", 500)); 
        }
}
   
const myprofile = async (req, res,next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new AppError("Failed to fetch user profile", 500));
    }
}

async function uploadPicture(req, res, next) {
    try {

        if (!req.user || !req.user.id) {
            return next(new AppError("User not authenticated", 401));
          }

      const userId = req.user.id; 
      
      if (!req.file) {
        return next(new AppError("No file uploaded", 400));
      }
  
      const user = await prisma.user.update({
        where: { id: userId },
        data: { profileImage: req.file.path }
      });

      res.json(user);
    } catch (err) {
      console.error(err);
      return next(new AppError("Failed to upload picture", 500));
    }
  }
 
  const updateUser = async (req, res, next) => {
    const { name, profileImage } = req.body;

    // Ensure the user is authenticated
    if (!req.user) {
        return next(new AppError("User not authenticated", 401));
    }

    try {
        // Use the user ID from the token (req.user.id) for the update
        const user = await prisma.user.update({
            where: { id: req.user.id },  // Use the user ID from the token
            data: {
                name,
                profileImage: req.file ? req.file.path : profileImage, // Handle file upload for profile image
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return next(new AppError("Failed to update user", 500)); 
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    
    if (!id || isNaN(parseInt(id))) {
        return next(new AppError("Invalid ID", 400));
    }

    try {

        const isAdmin = req.user.role === "admin";
        if (!isAdmin) {
            return next(new AppError("Unauthorized to delete user", 403));
        }
        const user = await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        
        

        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
};

const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
       
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({
            where: { email },
            data: {
                otpCode,
                otpExpiry,
            },
        });
        
         sendEmail(email,
            "Password Reset OTP",
            `<h1>Password Reset OTP Code</h1>
      <p>You requested a password reset. Use the following OTP code to reset your password:</p>
      <h2 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center;">${otpCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>`
        );
        res.json({ message: "OTP sent to email"});

    } catch (error) {
        return next(new AppError("Failed to send OTP", 500));
    }
}

const resetPassword = async (req, res,next) => {
    const { email, otpCode, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        if (user.otpCode !== otpCode || new Date() > user.otpExpiry) {
            return next(new AppError("Invalid or expired OTP", 400));
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                otpCode: null,
                otpExpiry: null,
            },
        });
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        return next(new AppError("Failed to reset password", 500));
    }
}

export {getAllUsers, registerUser, loginUser, myprofile, updateUser,deleteUser, uploadPicture,forgetPassword,resetPassword};
