import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

export { mongoURI };
