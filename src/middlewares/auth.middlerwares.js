import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.modes.js";
import { asynchandler } from "../utils/asyncHandler.js";
import  Jwt  from "jsonwebtoken";
export const verifyJwt = asynchandler(async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token)
        {
            throw new apiError(400,"Unauthorized request") 
        }
        const decodedToken= Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            throw new apiError(401,"invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})