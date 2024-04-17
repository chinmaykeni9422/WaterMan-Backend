import  Express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {SerialPort}  from "serialport";
import { ReadlineParser } from "serialport";
import { handleData } from "./controllers/Arduino.controller.js";
import { Server } from "socket.io";
import { createServer } from "http";


//------------------my arduno data listener code -----------

const port = new SerialPort({
   path: 'COM6',
   baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}));

const Id = "65d7ffd319ae02a71304979d" ;

parser.on('data', data => {

    //---scoket.io
    io.emit('sensorData', { sensorData: data, deviceId: Id });
    //----------

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


//------------------socket.io code----------------------
const server = createServer(app) ;

// Create a new instance of Socket.IO by passing the HTTP server
const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true
    }
});

// Listen for socket connections
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    // You can add more socket event handlers here
});
  
  // Start the server
const PORT =  3000;
  server.listen(PORT, () => {
    console.log(`WebSocket Server is running on port: ${PORT}`);
});

//----------------------------------------------------------------------------

export default app ;