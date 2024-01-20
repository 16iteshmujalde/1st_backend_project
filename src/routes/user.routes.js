import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  RefreshAccessToken,
  UpdateDetails,
  getCurrentUser,
  getWatchHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlerwares.js";
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
//
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(RefreshAccessToken);
router.route("/update-details").get(verifyJwt, upload.none(), UpdateDetails);
router.route("/getcurrentuser").get(verifyJwt, getCurrentUser);
router.route("/watch-history").get(verifyJwt, getWatchHistory);
export default router;
// module.exports = router;
