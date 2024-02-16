import  Express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {SerialPort}  from "serialport";
import { ReadlineParser } from "serialport";
import { handleData } from "./controllers/Arduino.controller.js";


//------------------my arduno data listener code -----------

const port = new SerialPort({
   path: 'COM5',
   baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}));

const Id = "65b1e2063535322f1fce9d1b" ;

parser.on('data', data => {
    handleData(data, Id) ;
}) ;

//---------------------------END----------------------------


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