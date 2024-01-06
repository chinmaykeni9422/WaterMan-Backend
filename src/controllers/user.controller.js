import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    const {userName, fullName, email, phonenumber, password} = req.body

    // validation - not empty (NEW "some" method lerned)
    if(
        [userName, fullName, email, phonenumber, password].some((field) => {
            return field?.trim() === ""
        })
    ){
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exits - email/username (new "$or" operator lerned)
    const existedUser = await User.findOne({
        $or:[{userName}, {email}]
    })

    if(existedUser){
        throw new  ApiError(409, "User with email or username already exists")
    }

    // create user object - create entry in db
    const user = await User.create({
        userName,
        fullName,
        email,
        phonenumber,
        password
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation 
    if(!createdUser){
        throw new ApiError(500, "somthing went wrong while registering the user")
    }

    // return response 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesfully")
    )

});

export {registerUser};