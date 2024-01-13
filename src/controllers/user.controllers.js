import {asynchandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.modes.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asynchandler(async (req, res) => {

    const {fullName, email, password} = req.body;
// check if all fields are filled
    if ([fullName, email, username].some(field => field?.trim() === "")) {
// At least one of the fields has an empty or whitespace-only value
        throw new apiError(400, "All fields are required");
    } 
// check if user already exists
    const existedUser = User.findOne({
        $or :[{email}, {username}]
    })
    if(existedUser) {
        throw new apiError(400, "User already exists")
    }
//check avatar and cover image are filled or not
    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage[0].path;
    if(!avatarLocalPath){
        throw new apiError(400, "Avatar image is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new apiError(401, "Avatar image is required")
    }
// create user and store in database
    const user = User.create({
        fullName,
        email,
        password,
        avatar : avatar.url,
        coverImage: coverImage?.url || null,
        username: username.toLowerCase()
    })
// clear password and  referenceToken

    const createdUser= await User.findById(user._id).select("-password -referenceToken");

// check user is created or not
    if(!createdUser){
        throw new apiError(500, "Something went wrong while registering user")
    }

// return response
 return res.status(200).json(
    new ApiResponse(200, createdUser ,"User created successfully"),
 );
}); // registerUser
export {registerUser}



// console.log("name: ", fullName,"email: ", email, "password: ", password,);
// const user = await req.context.models.users.create({name, email, password});
// return res.status(200).json({success: true});