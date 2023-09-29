import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    pwdHash: string;
    role: 'admin' | 'user' | 'manager';
    encryptPassword(password: string): Promise<void>;
    validatePassword(password: string, receivedPassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
    username: String,
    pwdHash: String,
    type: String,
    default: 'user',
    role: ['admin', 'user', 'manager'],
    phone: String,
    // The following fields are used for the chatbot and are used to construct a ticket object (once the user has finished the chatbot flow)
    chat_state: Number,
    chat_ticket_description: String,
    chat_ticket_category: String,
    chat_ticket_subcategory: String,
    chat_ticket_priority: Number,
});

UserSchema.methods.encryptPassword = async function (password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.pwdHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password: string,receivedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, receivedPassword);
};

export default model<IUser>('User', UserSchema);
