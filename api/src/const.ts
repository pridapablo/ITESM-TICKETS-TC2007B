import dotenv from "dotenv";
dotenv.config();

export const mongoURI = process.env.MONGO_URI;
export const SECRET: string = process.env.SECRET || 'teamteammitty';


console.log(SECRET)


