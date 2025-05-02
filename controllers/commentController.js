import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

import { AppError } from "../utils/errorhandler.js";

export const addCommentOnPost = async (req, res, next) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                userId: req.user.id,
            },
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        return next(new AppError("Failed to add comment", 500));
    }
}


export const getCommentsOnPost = async (req, res, next) => {
    const { postId } = req.params;

    try {
       
        const comments = await prisma.comment.findMany({
            where: {
                postId: parseInt(postId),
            },
            include: {  
                user: true,
            },
        });
        res.status(200).json(comments);
    } catch (error) {
        return next(new AppError("Failed to fetch comments", 500));
    }
}


export const updateComment = async (req, res,next) => {
    const { id } = req.params;
    const { content } = req.body;
    await prisma.comment.findUnique({
        where: { id: parseInt(id) },
    }).then((comment) => {
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }
        if (comment.userId !== req.user.id && req.user.role !== "admin") {
            return next(new AppError("Forbidden", 403));
        }
    }).catch((error) => {
        return next(new AppError("Failed to fetch comment", 500));
    });
    try {
        const comment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { content },
        });    
        res.status(200).json(comment);
    } catch (error) {
        return next(new AppError("Failed to update comment", 500));
    }
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }

        if (comment.userId !== req.user.id && req.user.role !== "admin") {
            return next(new AppError("Forbidden", 403));
        }

        await prisma.comment.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error(error);
        return next(new AppError("Failed to delete comment", 500));
    }
};
