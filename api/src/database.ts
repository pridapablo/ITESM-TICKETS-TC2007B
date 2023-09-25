import mongoose from "mongoose";
import { mongoURI } from "./const";

// mongoose connection
try {
    if (!mongoURI) {
        throw new Error('MongoURI is not defined');
    }
    mongoose.connect(mongoURI);
    if (mongoose.connection) {
        console.log('Connected to MongoDB');
    }

} catch (error) {
    console.error('Could not connect to MongoDB');
    console.error(error);
}