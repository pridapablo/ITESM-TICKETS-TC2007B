import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    encryptPassword(password: string): Promise<void>;
    validatePassword(password: string, receivedPassword: string): Promise<boolean>;
    username: string;
    pwdHash: string;
    role: "user" | "admin" | "agent";
    phone: string;
    chat: {
        state: number,
        ticket_description: string,
        ticket_category: string,
        ticket_subcategory: string,
        ticket_priority: number
    }
}

const UserSchema = new Schema({
    username: String,
    pwdHash: String,
    role: { type: String, default: 'user' },
    phone: String,
    chat: {
        state: Number,
        ticket_description: String,
        ticket_category: String,
        ticket_subcategory: String,
        ticket_priority: Number
    }
});

UserSchema.methods.encryptPassword = async function (password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.pwdHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password: string,receivedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, receivedPassword);
};

export default model<IUser>('User', UserSchema);
