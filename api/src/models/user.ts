import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    username: String,
    pwdHash: String,
    role: ['admin', 'user', 'manager'],
    phone: String,
    // The following fields are used for the chatbot and are used to construct a ticket object (once the user has finished the chatbot flow)
    chat_state: Number,
    chat_ticket_description: String,
    chat_ticket_category: String,
    chat_ticket_subcategory: String,
    chat_ticket_priority: Number,
});

export default model('User', UserSchema);
