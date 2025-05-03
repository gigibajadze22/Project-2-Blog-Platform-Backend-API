import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorhandler.js";

const prisma = new PrismaClient();



const getAllPosts = async (req, res,next) => {
    try {
        const posts = await prisma.post.findMany({});
        res.status(200).json(posts);
    } catch (error) {
        return next(new AppError("Failed to fetch posts", 500));
    }
}

const getPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new AppError("Failed to fetch post", 500));
    }
}

const createpost = async (req, res, next) => {
    const { title, content } = req.body;

    // ✅ DEBUG LOGS — Add these
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("User ID:", req.user?.id);
    console.log("Uploaded files:", req.files);

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.id,
            },
        });

        if (req.files && req.files.length > 0) {
            const images = req.files.map((file) => ({
                postId: post.id,
                imageUrl: file.path,
            }));

            await prisma.postImage.createMany({
                data: images,
            });
        }

        res.status(201).json(post);
    } catch (error) {
        // ✅ THIS SHOWS THE REAL ERROR
        console.error("CREATE POST ERROR:", error);
       return next(new AppError("Failed to create post", 500));
    }
};

const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {

        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        const isOwnerOrAdmin = req.user.role === "admin" || post.authorId === req.user.id;
        if (!isOwnerOrAdmin) {
            return next(new AppError("Forbidden", 403));
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
            },
        });

        res.status(200).json(updatedPost);
    } catch (error) {
       return next(new AppError("Failed to update post", 500));
    }
}

const deletePostWithImages = async (req, res,next) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        const isOwnerOrAdmin = req.user.role === "admin" || post.authorId === req.user.id;
        if (!isOwnerOrAdmin) {
            return next(new AppError("Forbidden", 403));
        }

        await prisma.postImage.deleteMany({
            where: { postId: parseInt(id) },
        });

        await prisma.post.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
       return next(new AppError("Failed to delete post", 500));
    }
}

export {getAllPosts,getPostById,createpost,updatePost,deletePostWithImages}