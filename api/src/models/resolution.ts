import { Schema, model } from 'mongoose';

const ResolutionSchema = new Schema({
    whatWasDone: String,
    howWasDone: String,
    isSolved: Boolean,
    whyWasDone: String,
});

export default model('Resolution', ResolutionSchema);