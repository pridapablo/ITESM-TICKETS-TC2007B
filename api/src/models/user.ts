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
    role: {
    type: String,
    enum: ['admin', 'user', 'manager'],
    default: 'user',
},
});

UserSchema.methods.encryptPassword = async function (password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.pwdHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password: string,receivedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, receivedPassword);
};

export default model<IUser>('User', UserSchema);
