//require('dotenv').config({path:'./env'})    //does the work but remove consistency in code where all are import

// import mongoose, { connect, modelNames } from "mongoose";
// import { DB_NAME } from "./constants"
//all taken in a saperate file for database in and were only used for first approach;

import dotenv from"dotenv"
import connectDB from "./db/datab.js";

dotenv.config({
    path:"./.env"
})

connectDB()
    .then(() => {
        app.on("error",(error) => {          //this is a listner that handles and tell the database is connected but kya pata jo hamari express ki app hai wo baat ni kar paari
            console.log("ERROR:", error);
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed!!!", err);
    })


    
    
//change in environment variable requires manual restart;






   
/*
===================FIRST APPROACH (all the work in index.js (main file))==================
-here implementes a iffe or can create a function then call it;
-use of try catch is there;
-handled errors;
-database is in different continent so used async await;




import express from "express"
const app = express()

; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {         //this is a listner that handles and tell the database is connected kya pata jo hamari express ki app hai wo baat ni kar paari
            console.log("ERROR:", error);
            throw error
        })
        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port${process.env.PORT}`);
        })
    }
    catch (error) {
        console.error("ERROR", error)
        throw error
    }
})()
    */