import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, //url
    },
    WatchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    Password: {
      type: String,
      required: true,
    },
    referenceToken: {
      type: string,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = bcrypt.hash(this.Password, 10);
  next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};
userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = async function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRENCE_TOKEN_SECRET,
    {
      expiresIn: REFRENCE_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
