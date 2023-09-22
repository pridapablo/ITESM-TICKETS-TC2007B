import { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
    classification: ['Servicios', 'Digital', 'Infraestructura', 'Recursos Humanos', 'Beneficiarios', 'Mobiliario', 'Seguridad', 'Materiales', 'Fenómeno meteorológico'],
    type: ['Agua', 'Luz', 'Teléfono', 'Basura', 'Limpieza del Aula', 'Internet, Servidores y Equipos', 'Software', 'Hardware', 'Cámaras de seguridad', 'Soporte técnico presencial y remoto', 'Paredes', 'Techo', 'Ventanas', 'Puertas', 'Aulas en general', 'Permisos', 'Trámites', 'Honorarios', 'Asistencias', 'Documentación', 'Apoyo académico', 'Salud', 'Seguridad/Bullying', 'Sillas/butacas', 'Escritorios','Pizzarones','Cafetería', 'Estantes, archiveros', 'Delincuencia', 'Robos', 'Bandalismo', 'Imagen institucional', 'Educativos', 'Papelería', 'Limpieza', 'Inundaciones', 'Incendios', 'Sismos'],
    priority: Number,
    resolutionID: String,
    closureTime: Date,
});

export default model('Ticket', TicketSchema);