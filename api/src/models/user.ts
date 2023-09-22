import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    username: String,
    pwdHash: String,
    role: ['admin', 'user', 'manager'],
});

export default model('User', UserSchema);
