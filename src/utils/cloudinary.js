import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    //uplaod the file on cloudinary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    //file is upload successfully
    // console.log("uploaded successfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); //delete the file if error
  }
};
export { uploadOnCloudinary };
