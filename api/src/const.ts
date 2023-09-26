import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;

export { mongoURI, SECRET };
