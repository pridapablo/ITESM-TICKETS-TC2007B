import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

export { mongoURI, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN };
