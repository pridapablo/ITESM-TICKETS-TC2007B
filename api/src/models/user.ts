import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    username: String,
    pwdHash: String,
    role: ['admin', 'user', 'manager'],
    phone: String
});

export default model('User', UserSchema);
