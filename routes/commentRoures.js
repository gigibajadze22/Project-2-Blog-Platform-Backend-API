import express from 'express';
import {
    addCommentOnPost,
    getCommentsOnPost,
    updateComment,
    deleteComment
} from '../controllers/commentController.js';
import { auth, } from '../middlewares/auth.js';
import upload from '../middlewares/uploadFiles.js';

const commentRouter = express.Router();


commentRouter.post('/:postId',auth, addCommentOnPost);
commentRouter.get('/:postId', getCommentsOnPost);
commentRouter.patch('/:id',auth, updateComment);
commentRouter.delete('/:id',auth, deleteComment);

export default commentRouter;

