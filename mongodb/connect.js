import mongoose from "mongoose";

const connectDB = async (url) => {
    mongoose.set("strictQuery", true);
    try{
        await mongoose.connect(url)
        console.log("MongoDB Connected Successfully")
    }
    catch(err){
        console.log(err)
    }
    
};

export default connectDB;