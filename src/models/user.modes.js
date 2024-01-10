import mongoose,{Schema} from "mongoose";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
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
            index: true
        },
        avatar :{
            type: String,
            required: true
        },
        coverImage :{
            type:String,//url
        },
        WatchHistory :[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        Password: {
            type: String,
            required: true
        },
        referenceToken: {
            type:string
        }
        },
        {
            timestamps: true
        } 
    )
    export const User = mongoose.model("User", userSchema);