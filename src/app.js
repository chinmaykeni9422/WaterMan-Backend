import  Express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = Express();




// cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

//telling server that you can accept json format data and setting its limit
app.use(Express.json({limit: "20kb"}));

// encoding url and setting limit
app.use(Express.urlencoded({limit: "20kb"}));

//---
app.use(Express.static("public")) ;

// cookies configuration
app.use(cookieParser()) ;



//Routes import
import userRouter from './routes/user.routes.js'
 

//routes declaration
app.use("/api/v1/users", userRouter)



export default app ;