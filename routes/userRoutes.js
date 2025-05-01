import express from 'express';
import upload from '../middlewares/uploadFiles.js';
import { 
    getAllUsers,
    registerUser,
    loginUser,
    myprofile,
    updateUser,
    uploadPicture,
    forgetPassword,
    resetPassword,
    deleteUser
} from '../controllers/userController.js';
import { auth,isAdmin } from '../middlewares/auth.js';

const authrouter = express.Router();
const router = express.Router();



router.get('/getUsers',auth,isAdmin, getAllUsers);
authrouter.post('/register', registerUser);
authrouter.post('/login', loginUser);


router.get('/me',auth,myprofile);
router.patch('/update',auth,upload.single('changePicture'),updateUser);
router.post('/uploadPicture',auth,upload.single('profilePicture'),uploadPicture);
router.delete('/deleteUser/:id',auth,deleteUser);
router.post('/forgetPassword',forgetPassword);
router.post('/resetPassword',resetPassword );

export {authrouter,router}; 
