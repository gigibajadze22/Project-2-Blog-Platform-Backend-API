import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService.js";


const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
}
   // auth
const registerUser = async (req, res) => {
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
            res.status(500).json({ error: "Failed to register user" });
        }
}
const loginUser = async (req, res) => { 
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = jwt.sign({id:user.id,role: user.role}, process.env.JWT_SECRET, { 
                expiresIn: '1h' 
              });

            res.status(200).json({token,user});
        } catch (error) {
            res.status(500).json({ error: "Failed to login user" });
        }
}
   
const myprofile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
}

async function uploadPicture(req, res) {
    try {

        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
          }

      const userId = req.user.id; 
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const user = await prisma.user.update({
        where: { id: userId },
        data: { profileImage: req.file.path }
      });

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
 
  const updateUser = async (req, res) => {
    const { name, profileImage } = req.body;

    // Ensure the user is authenticated
    if (!req.user) {
        return res.status(403).json({ error: "You are not authorized to update this user" });
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
        res.status(500).json({ error: "Failed to update user" });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
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
        res.status(500).json({ error: "Failed to send password reset link" });
    }
}

const resetPassword = async (req, res) => {
    const { email, otpCode, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otpCode !== otpCode || new Date() > user.otpExpiry) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
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
        res.status(500).json({ error: "Failed to reset password" });
    }
}

export {getAllUsers, registerUser, loginUser, myprofile, updateUser, uploadPicture,forgetPassword,resetPassword};
