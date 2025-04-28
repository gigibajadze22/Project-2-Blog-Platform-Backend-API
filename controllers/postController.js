import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch post" });
    }
}

const createpost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.id,
            },
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const post = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
            },
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to update post" });
    }
}

const deletePost = async (req, res) => {    
    const { id } = req.params;
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
    }
}
export {getAllPosts,getPostById,createpost,updatePost,deletePost}