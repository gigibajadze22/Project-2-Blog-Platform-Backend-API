import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const addCommentOnPost = async (req, res) => {
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
        res.status(500).json({ error: "Failed to add comment" });
    }
}


export const getCommentsOnPost = async (req, res) => {
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
        res.status(500).json({ error: "Failed to fetch comments" });
    }
}


export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    await prisma.comment.findUnique({
        where: { id: parseInt(id) },
    }).then((comment) => {
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (comment.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
    }).catch((error) => {
        return res.status(500).json({ error: "Failed to fetch comment" });
    });
    try {
        const comment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { content },
        });    
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Failed to update comment" });
    }
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        await prisma.comment.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
