import { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
    classification: String,
    subclassification: String,
    priority: Number,
    description: String,
    resolutionID: { type: Schema.Types.ObjectId, ref: 'Resolution' },
    closureTime: Date,
    isDeleted: Boolean,
});

export default model('Ticket', TicketSchema);