import mongoose, {Schema} from "mongoose";
import Jwt  from "jsonwebtoken";
import bcrypt from  "bcrypt";


const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phonenumber: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            unique: true,
        },
        confirmPassword: {
            type: String,
            required: [true, 'Password is required'],
            unique: true,
        },
        moisture: {
            type: String, 
            required: true,
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

//encryption middleware
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
});

userSchema.pre("save", async function(next){
    if(this.isModified("confirmPassword")){
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10)
        next()
    }
});

//compare methods
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//access token generate
userSchema.methods.generateAccessToken = function(){
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//refresh token generate
userSchema.methods.generateRefreshToken = function(){
    Jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema) ;

export default User ;