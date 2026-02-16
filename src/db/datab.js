//named as index in yt tutorial
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//DB is in another continent so there may be time taking so use async await;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect
            (`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`)   //complete url of mongoDB is gotten and help in knowing which host are we connecting to ;
        //because database for production dev and testing are different;
    }
    catch (error)
    {
        console.log("MONGODB connection FAILED", error);
        process.exit(1)                           //current application is running on a process and this process is the reference of that process;
    }
}

export default connectDB