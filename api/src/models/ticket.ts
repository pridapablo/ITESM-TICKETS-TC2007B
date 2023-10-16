import { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
    classification: String,
    subclassification: String,
    priority: Number, // 1 = muy baja, 2 = baja, 3 = media, 4 = alta, 5 = muy alta
    description: String, // not shown on datagrid
    status: Number, // 1 = nuevo, 2 = abierto, 3 = pendiente, 4 = en espera, 5 = resuelto
    topic: String, // not shown on datagrid
    folio: String, // opcional
    responsible: String, // not shown on datagrid
    resolution: { 
        whatWasDone: String,
        howWasDone: String,
        whyWasDone: String,
        closureTime: Date, // will be null if ticket is not closed (show solved time on datagrid... maybe a cross icon if ticket is not closed)
    },
    isDeleted: { type: Boolean, default: false }, // shown as a cross icon on datagrid
});

export default model('Ticket', TicketSchema);