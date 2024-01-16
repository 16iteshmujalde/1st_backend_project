import express from 'express';
const router = express.Router();
import { registerUser,loginUser, logoutUser,RefreshAccessToken} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import { verifyJwt } from '../middlewares/auth.middlerwares.js';
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser)
router.route("/login").post(loginUser)
//
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(RefreshAccessToken)
export default router;
// module.exports = router;
            