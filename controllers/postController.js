import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();



const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({});
        res.status(200).json(posts);
    } catch (error) {
        return next(new Error("Failed to fetch posts"));
    }
}

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return next(new Error("Post not found"));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new Error("Failed to fetch post"));
    }
}

const createpost = async (req, res) => {
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
       return next(new Error("Failed to create post"));
    }
};

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
        if (!post) {
            return next(new Error("Post not found"));
        }

        const isOwnerOrAdmin = req.user.role === "admin" || post.authorId === req.user.id;
        if (!isOwnerOrAdmin) {
            return next(new Error("Forbidden"));
        }

        res.status(200).json(post);
    } catch (error) {
       return next(new Error("Failed to update post"));
    }
}

const deletePostWithImages = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return next(new Error("Post not found"));
        }

        const isOwnerOrAdmin = req.user.role === "admin" || post.authorId === req.user.id;
        if (!isOwnerOrAdmin) {
            return next(new Error("Forbidden"));
        }

        await prisma.postImage.deleteMany({
            where: { postId: parseInt(id) },
        });

        await prisma.post.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
       return next(new Error("Failed to delete post"));
    }
}

export {getAllPosts,getPostById,createpost,updatePost,deletePostWithImages}