import { Schema, model } from 'mongoose';

const TicketUserSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    ticketID: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    interactionDate: Date,
    interactionType: String,
});

export default model('TicketUser', TicketUserSchema);
