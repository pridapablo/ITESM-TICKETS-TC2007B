import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User, { IUser } from "./models/user";

dotenv.config();

async function createAdmin(
  username: string,
  password: string,
  mongoURI: string
): Promise<void> {
  try {
    // Connect to MongoDB using the provided URI
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const desiredUsername = username;

    const existingUser = await User.findOne({ username: desiredUsername });
    if (existingUser) {
      console.log(
        `Ya existe un usuario con el nombre de usuario: ${desiredUsername}.`
      );
      process.exit();
    }

    // New admin user
    const admin: IUser = new User({
      username: desiredUsername,
      role: "admin",
    });

    const salt = await bcrypt.genSalt(10);
    admin.pwdHash = await bcrypt.hash(password, salt);

    await admin.save();

    console.log("Usuario administrativo creado exitosamente.");
  } catch (error) {
    console.error("Error:", (error as Error).message);
  } finally {
    mongoose.disconnect();
    process.exit();
  }
}

// Check if the required arguments are provided (username, password, and mongoURI)
if (process.argv.length < 5) {
  console.log(
    "Usage: ts-node createAdmin.ts <adminUsername> <adminPassword> <mongoURI>"
  );
  process.exit();
}

const adminUsername: string = process.argv[2];
const adminPassword: string = process.argv[3];
const dbURI: string = process.argv[4];

createAdmin(adminUsername, adminPassword, dbURI);
