import express from 'express';
import { 
    getAllUsers,
    Logout,
    signIn, 
    SignUp, 
    updateUser, 
    userDetails
} from '../controller/user.controller.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

router.post("/create-user", SignUp)
router.post("/login-user", signIn)
router.get("/user-detials",authToken, userDetails)
router.get('/logout', Logout)

//admin routes

router.get('/all-users',authToken,getAllUsers)
router.put('/update-user', authToken, updateUser)

export default router;