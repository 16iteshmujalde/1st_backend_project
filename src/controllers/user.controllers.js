import {asynchandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.modes.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken= async (userId) => {
    // console.log("userId: ", userId)
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken}
    } catch (error) {
        console.log("error: ", error)
        throw new apiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asynchandler(async (req, res) => {

    const {fullName, email, username,password} = req.body;
// check if all fields are filled
    if ([fullName, email, username,password].some(field => field?.trim() === "")) {
// At least one of the fields has an empty or whitespace-only value
        throw new apiError(400, "All fields are required");
    } 
// check if user already exists
    const existedUser = await User.findOne({
        $or :[{email}, {username}]
    })
    if(existedUser) {
        throw new apiError(400, "User already exists")
    }
//check avatar and cover image are filled or not
    const avatarLocalPath = req.files?.avatar[0].path;
    // const coverImageLocalPath = req.files?.coverImage[0].path;
    let coverImageLocalPath
    if(req.files && Array.isArray(req.files?.coverImage) && req.files?.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new apiError(400, "Avatar image is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new apiError(401, "Avatar image is required")
    }
// create user and store in database
    const user = await User.create({
        fullName,
        email,
        password,
        avatar : avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })
// clear password and  referenceToken

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    // const createdUser = await User.findById(user._id)
    console.log("User: ",user)
// check user is created or not
    if(!user){
        throw new apiError(505, "Something went wrong while registering user")
    }

// return response
 return res.status(200).json(
    new ApiResponse(200, createdUser ,"User created successfully"),
 );
}); // registerUser
//login
const loginUser = asynchandler(async (req, res) => {
    const {username,email,password} = req.body;
    // check if all fields are filled
    if(!(username || email)) {
        throw new apiError(400, "Username or email and  required")
    }
    if(!password) {
        throw new apiError(400, "password  required")
    }
    const user = await User.findOne({
        $or :[{email}, {username}]
    })
    if(!user) {
        throw new apiError(404, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) {
        throw new apiError(401, "Incorrect password")
    }
    // console.log("user: ", user)
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    //cookies ke liya hai , options for which cookie to be sent
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    loggedInUser, 
                    accessToken, 
                    refreshToken 
                },
                "User logged in successfully")
            )
})
const logoutUser = asynchandler(async (req, res) => {
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie('refreshToken', options)
        .clearCookie('accessToken', options)
        .json(
            new ApiResponse(
                200, 
                {
                },
                "User logout successfully")
            )
})
const RefreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request")
    }
    try {
        const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if(!user) {
            throw new apiError(401,"Invalid refresh token")
        }
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401,"Refresh Token expired or used")
        }
        const options ={
            httpOnly: true,
            secure: true
        }
        const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id);
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {accessToken, refreshToken}, "Access Token and Refresh Token refreshed successfully")
            )
    } catch (error) {
        throw new apiError(401, error?.massage ||"Invalid refresh token")        
    }
})
export {
    registerUser,
    loginUser,
    logoutUser,
    RefreshAccessToken
}



// console.log("name: ", fullName,"email: ", email, "password: ", password,);
// const user = await req.context.models.users.create({name, email, password});
// return res.status(200).json({success: true});