//10
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true           
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,          
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
            index:true
        },

        avatar: {
            type: String,  // cloudnary url service to strore media and file similar to aws
            required: true,
        },

        coverImage: {
            type:String //cloudinary url
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],

        password: {
            type: String,
            required:[true,'Password is required']
        },

        refreshToken: {
            type:String
        }
    },
    {
        timestamps:true
    }
)


//using async here becuse encryption and checking the password take time
//pre hook is when we need to do something just before a save or other operation 
userSchema.pre("save",async function (next) { //used normal function because arrow function does not have "this" reference in them
    if (!this.isModified("password")) return next() // condition to run encryption when password is modified otherwise dont either way gives next directly so we dont encrypt password again
    
    this.password = bcrypt.hash(this.password, 10)// encrypt the password and you can select the no. of round of encryption
    next()//flag for next 
})



userSchema.methods.isPasswordCorrect = async function (password) { //custom function made by us to check if the password entered by user is correct or not
    return await bcrypt.compare(password,this.password)//bcrypt compares the password and the encrypted one which is this.password and check if its same or not gives boolean values
}





/*Important: jwt.sign() does NOT encrypt
Anyone can decode the payload using:
jwt.io
But they cannot modify it without breaking the signature. */

userSchema.method.generateAccessToken = function () {
    //jwt.sign() does ONE main thing:
    //It creates a token and locks it with a secret key.
    return jwt.sign(      //jwt.sign(payload, secret, options)1.Creates a header 2.Adds your payload  3.Uses the secret to generate a signature (using hashing algorithm like HS256)  4.Combines all 3 parts into one long string:
        {    //some data (payload)
            _id: this._id,
            email: this.email,
            userName:this.userName,
            fullname: this.fullname
        },

        // Secret key used to lock/sign the token
        // Stored in .env file for security
        process.env.ACCESS_TOKEN_SECRET,

        // Extra settings for the token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // How long token will work (like 15m or 1h)
        }
    )
}

//same as accesstoken just need less payload
//refresh token is not async await because its used frequently
userSchema.method.generateRefereshToken = function () {
    return jwt.sign(
        {
            _id:this._id
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_SECRET
        }
    )
}


export const User = mongoose.model("User", userSchema)