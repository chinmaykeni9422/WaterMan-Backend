import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRfeshTokens = async(userId) => {
    try {
        const AuthUser = await User.findById(userId)
        const accessToken = AuthUser.generateAccessToken()
        const refreshToken = AuthUser.generateRefreshToken()

        AuthUser.refreshToken = refreshToken
        await AuthUser.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "samething went wrong while generating refresh and access token")
    }
};

const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    const {userName, fullName, email, phonenumber, password, confirmPassword} = req.body

    // validation - not empty (NEW "some" method lerned)
    if(
        [userName, fullName, email, phonenumber, password, confirmPassword].some((field) => {
            return field?.trim() === ""
        })
    ){
        throw new ApiError(400, "All fields are required")
    }

    //check if password and confirm password is correct or not 
    if(password !== confirmPassword){
        throw new ApiError(400, "Password and confirm password is not matched");
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
        password,
        confirmPassword
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -confirmPassword"
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

const loginUser = asyncHandler( async (req, res) => { 
    // get user details from frontend
    const {userName, fullName, email, phonenumber, password} = req.body

    if(!email){
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({email}) ;

    if(!user){
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "password does not exist")
    }

    const {accessToken, refreshToken} = await generateAccessAndRfeshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged in Succesfully"
        )
    )

    // username or email
    // find the user 
    // password check
    // acces and refresh token
    // send cookie
});

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "user logged Out"))
});

const moistSensorData = asyncHandler( async (req, res) => {

    // const { moisture } = req.body;

    // console.log(req.body) ;

    return res.status(201).json(
        new ApiResponse(200, "moisture data getting") 
    )
});

export {registerUser, loginUser, logoutUser, moistSensorData};