import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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


export {getAllUsers, registerUser, loginUser, myprofile, updateUser, uploadPicture};
