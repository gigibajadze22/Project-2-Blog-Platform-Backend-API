import express from 'express';
import {
    getAllPosts,
    getPostById,
    createpost,
    updatePost,
    deletePost
     } from '../controllers/postController.js';

import { auth ,isowneroradmin} from '../middlewares/auth.js';
import { uploadPostImages } from '../middlewares/uploadFiles.js';
const postRouter = express.Router();


postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', auth,uploadPostImages, createpost);
postRouter.patch('/:id', auth, isowneroradmin, updatePost);
postRouter.delete('/:id', auth, isowneroradmin, deletePost);
export default postRouter;