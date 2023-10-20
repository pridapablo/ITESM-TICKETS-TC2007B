import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const SECRET: string = process.env.SECRET || 'teamteammitty';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

export { mongoURI, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SECRET};