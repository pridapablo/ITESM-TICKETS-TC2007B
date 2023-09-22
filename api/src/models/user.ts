import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    classification: String,
    type: String,
    priority: Number,
    resolutionID: String,
    closureTime: Date,
});

export default model('User', UserSchema);
