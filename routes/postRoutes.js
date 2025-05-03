import express from 'express';
import {
    getAllPosts,
    getPostById,
    createpost,
    updatePost,
    deletePostWithImages
     } from '../controllers/postController.js';

import { auth} from '../middlewares/auth.js';
import { uploadPostImages } from '../middlewares/uploadFiles.js';
const postRouter = express.Router();


postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', auth,uploadPostImages, createpost);
postRouter.patch('/:id', auth,updatePost);
postRouter.delete('/:id', auth, deletePostWithImages);
export default postRouter;