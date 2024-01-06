// require('dotenv').config();
import dotenv from "dotenv"
import connectDB  from "./db/dbConnect.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
})


connectDB()
.then(() => {

    // to check any error is there after db connection
    app.on("error", (error) => {
        console.log("Error : ", error);
        throw error ;
    });

    app.listen( process.env.PORT || 8000 ,() => {
        console.log(` Server is running at PORT : ${process.env.PORT} `);
    });

})
.catch((error) => {

    console.log("MONGO DB connection failed !!! ", error);

});

