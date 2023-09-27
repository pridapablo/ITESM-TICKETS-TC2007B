import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../const"
import user from "../models/user";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const menu = "Por favor, ingresa una opción válida: \n\n 1. Servicios \n 2. Digital \n 3. Infraestructura \n 4. Recursos Humanos \n 5. Beneficiarios \n 6. Mobiliario \n 7. Seguridad \n 8. Materiales \n 9. Fenómeno meteorológico";
const subMenu = {
    '1': ['Agua', 'Luz', 'Teléfono', 'Basura', 'Limpeza del Aula'],
    '2': ['Internet, Servidores y Equipos, Software', 'Hardware', 'Cámaras de Seguridad', 'Soporte Técnico Presencial y Remoto'],
    '3': ['Paredes', 'Techo', 'Ventanas', 'Puertas', 'Aulas en general'],
    '4': ['Permisos', 'Asistencias', 'Salud', 'Trámites', 'Honorarios', 'Asistencias'],
    '5': ['Asistencias', 'Documentación', 'Apoyo Académico', 'Salud', 'Seguridad/Bullying'],
    '6': ['Sillas/Butacas', 'Escritorios', 'Pizarrones', 'Cafetería', 'Estantes/Archiveros'],
    '7': ['Delincuencia', 'Robos', 'Bandalismo', 'Imagen Institucional'],
    '8': ['Educativos', 'Papelería', 'Limpieza'],
    '9': ['Inundaciones', 'Incendios', 'Sismos' ]
};

//@ts-ignore
export const handleTicket = async (req, res) => {
    // @ts-ignore body unused 
    const { Body, WaId } = req.body;
    console.log(WaId);
    let u;
    try {
        u = await user.findOne({ phone: WaId });
        if (!u) {
            // User is not signed up
            await client.messages.create({
                body: "Lo sentimos, tu teléfono no está dado de alta",
                from: "whatsapp:+14155238886",
                to: `whatsapp:+${WaId}`,
            });

            return res.status(404).json({
                success: false,
                message: `User with phone number ${WaId} not found`,
            });
        } else {
           
            switch (u.chat_state){
                case 0:
                case undefined:
                   //Ask for ticket description and store the user's response
                    await client.messages.create({
                        body: "Please enter your ticket description.",
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_state = 1;
                    await u.save();
                    break;
                
                case 1:
                    //Ask for ticket category and store the user's response
                    await client.messages.create({
                        body: menu,
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_ticket_category = Body;
                    u.chat_state = 2;
                    await u.save();
                    break;

                case 2:
                //Ask for ticket subcategory
                if((subMenu as {[key: string]: string[]})[Body]){
                    let formattedSubMenu = (subMenu as {[key: string]: string[]})[Body].join('\n');
                    await client.messages.create({
                        body: `Please enter your ticket subcategory: \n${formattedSubMenu}`,
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_ticket_subcategory = Body;
                    u.chat_state = 3;
                    await u.save();
                } else {
                    await client.messages.create({
                        body: "Invalid Category",
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                }
                break;
            case 3:
                //Ask for ticket priority
                await client.messages.create({
                    body: "Please enter your ticket priority from 1 to 5.",
                    from: "whatsapp:+14155238886",
                    to: `whatsapp:+${WaId}`,
                });
                u.chat_ticket_priority = Body;
                /*Create send confirmation here*/
                await client.messages.create({
                    body: `Your ticket has been created successfully. Thank you!`,
                    from: "whatsapp:+14155238886",
                    to: `whatsapp:+${WaId}`,
                });
                u.chat_state = 0; // Reset the state to initial
                await u.save();
                break;

                default:
                    await client.messages.create({
                        body: "Invalid State",
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    break;
            }
               
        }
    } catch (e) {
        await client.messages.create({
            body: "Lo sentimos, ha ocurrido un error procesando su solicitud.",
            from: "whatsapp:+14155238886",
            to: `whatsapp:+${WaId}`,
        });
        
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }   
};


//@ts-ignore
export const sendConfirmation = async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        res.status(400).json({ message: 'Faltan datos' });
    }
try {
    const message = await client.messages.create({
      body: `Felicidades, ${name}. Ya puedes crear tickets desde aquí.`,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${phone}`,
    });

    console.log(message.sid);
    console.log(message.body);
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
}}
