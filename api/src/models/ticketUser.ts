import { Schema, model } from 'mongoose';

const TicketUserSchema = new Schema({
    userID: String,
    ticketID: String,
    interactionDate: [Date],
});

export default model('TicketUser', TicketUserSchema);
