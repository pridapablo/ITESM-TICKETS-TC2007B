import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../const"
import user from "../models/user";
import ticket from "../models/ticket";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const menu = ["Servicios", "Digital", "Infraestructura", "Recursos Humanos", "Beneficiarios", "Mobiliario", "Seguridad", "Materiales", "Fenómeno meteorológico"];
const subMenu = {
    'Servicios': ['Agua', 'Luz', 'Teléfono', 'Basura', 'Limpeza del Aula'],
    'Digital': ['Internet', 'Servidores y Equipos', 'Software', 'Hardware', 'Cámaras de Seguridad', 'Soporte Técnico Presencial y Remoto'],
    'Infraestructura': ['Paredes', 'Techo', 'Ventanas', 'Puertas', 'Aulas en general'],
    'Recursos Humanos': ['Permisos', 'Asistencias', 'Salud', 'Trámites', 'Honorarios', 'Asistencias'],
    'Beneficiarios': ['Asistencias', 'Documentación', 'Apoyo Académico', 'Salud', 'Seguridad/Bullying'],
    'Mobiliario': ['Sillas/Butacas', 'Escritorios', 'Pizarrones', 'Cafetería', 'Estantes/Archiveros'],
    'Seguridad': ['Delincuencia', 'Robos', 'Bandalismo', 'Imagen Institucional'],
    'Materiales': ['Educativos', 'Papelería', 'Limpieza'],
    'Fenómeno meteorológico': ['Inundaciones', 'Incendios', 'Sismos']
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
            switch (u.chat_state) {
                case 0:
                case undefined:
                    // Ask for ticket description
                    await client.messages.create({
                        body: "Por favor, ingresa la descripción de tu ticket.",
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_state = 1;
                    await u.save();
                    break;

                case 1:
                    //Store ticket description directly
                    u.chat_ticket_description = Body;
                    await u.save();

                     // Send categories menu
                    let categoriesMenuText = menu.map((item, index) => `${index + 1}. ${item}`).join('\n');
                    await client.messages.create({
                        body: `Por favor, selecciona una categoría: \n\n ${categoriesMenuText}`,
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_state = 2;
                    await u.save();
                    break;
            
                case 2:
                    // Store category
                    const index = parseInt(Body) - 1; // Subtract 1 because array indices start at 0
                    if (index >= 0 && index < menu.length) {
                        const processedBody = menu[index];
                        u.chat_ticket_category = processedBody;
                        await u.save();
                    }
                    else {
                        // Handle the case where the index is out of bounds
                        await client.messages.create({
                            body: "Por favor, selecciona una opción válida. (Digita el número de la opción)",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                    }

                   // Send subcategories menu based on category
                    if (u.chat_ticket_category && u.chat_ticket_category in subMenu) {
                        let subcategoriesMenuText = subMenu[u.chat_ticket_category as keyof typeof subMenu].map((item, index) => `${index + 1}. ${item}`).join('\n');
                        await client.messages.create({
                            body: `Por favor, selecciona una subcategoría. Aquí están las opciones: \n\n${subcategoriesMenuText}`,
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                        u.chat_state = 3;
                        await u.save();
                    } else {
                        console.log("no entro", u.chat_ticket_category);
                        // Handle the case where the category is not in the subMenu
                        await client.messages.create({
                            body: "Por favor, selecciona una opción válida. (Digita el número de la opción)",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                    }
                    break;
                
                case 3:
                    // Store subcategory
                    // Assuming Body contains the integer response
                    const index2 = parseInt(Body) - 1; // Subtract 1 because array indices start at 0

                    // Check if the index is within the array bounds
                    if (u.chat_ticket_category && u.chat_ticket_category in subMenu) {
                        const subcategories = subMenu[u.chat_ticket_category as keyof typeof subMenu];
                        if (index2 >= 0 && index2 < subcategories.length) {
                            const processedBody2 = subcategories[index2];
                            u.chat_ticket_subcategory = processedBody2;
                            await u.save();
                        } else {
                            // Handle the case where the index is out of bounds
                            await client.messages.create({
                                body: "Por favor, selecciona una opción válida. (Digita el número de la opción)",
                                from: "whatsapp:+14155238886",
                                to: `whatsapp:+${WaId}`,
                            });
                        }
                    } else {
                        // Handle the case where the category is not in the subMenu
                        await client.messages.create({
                            body: "Por favor, selecciona una opción válida. (Digita el número de la opción)",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                    }

                    // Send priorities menu
                    const prioritiesMenuText = ["1", "2", "3", "4", "5"].join(', ');
                    await client.messages.create({
                        body: `Por favor, selecciona una prioridad. Aquí están las opciones: ${prioritiesMenuText}`,
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_state = 4;
                    await u.save();
                    break;
                
                case 4:
                    // Store priority
                    const priority = parseInt(Body);
                    if (isNaN(priority) || priority < 1 || priority > 5) {
                        // Handle the case where the priority is not a number or is out of bounds
                        await client.messages.create({
                            body: "Por favor, selecciona una opción válida. (Digita la prioridad en número del 1 al 5)",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                    } else {
                        const processedBody3 = priority;
                        u.chat_ticket_priority = processedBody3;
                        await u.save();
                    }

                     // Ask for ticket confirmation
                    await client.messages.create({
                    body: `Aquí están los detalles de tu ticket:\n\nDescripción: ${u.chat_ticket_description}\nCategoría: ${u.chat_ticket_category}\nSubcategoría: ${u.chat_ticket_subcategory}\nPrioridad: ${u.chat_ticket_priority}\n\nPor favor confirma si los detalles son correctos. Responde con "si" o "no".`,
                    from: "whatsapp:+14155238886",
                    to: `whatsapp:+${WaId}`,
                    });
                    u.chat_state = 5;
                    await u.save();
                    break;
              
                case 5:
                    // Validate yes/no
                    const processedBody4 = Body.toLowerCase();

                    if (processedBody4 === 'Si' || processedBody4 === 'Sí' || processedBody4 === 'si' || processedBody4 === 'sí' || processedBody4 === 's') {
                         const t = new ticket({
                        description: u.chat_ticket_description,
                        category: u.chat_ticket_category,
                        subcategory: u.chat_ticket_subcategory,
                        priority: u.chat_ticket_priority,
                        user: u._id,
                        });
                        await t.save();
                        await client.messages.create({
                            body: "Ticket creado con éxito.",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                        u.chat_state = 0;
                        await u.save();
                    } else if (processedBody4 === 'No' || processedBody4 === 'no' || processedBody4 === 'n') {
                        u.chat_state = 0;
                        await client.messages.create({
                            body: "Reiniciando chatbot.",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                        await u.save();
                    } else {
                        await client.messages.create({
                            body: "Por favor, responde con 'Si' o 'No'.",
                            from: "whatsapp:+14155238886",
                            to: `whatsapp:+${WaId}`,
                        });
                    }
                    break;
                default:
                    await client.messages.create({
                        body: "Estado desconocido, reiniciando chatbot.",
                        from: "whatsapp:+14155238886",
                        to: `whatsapp:+${WaId}`,
                    });
                    u.chat_state = 0;
                    await u.save();
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
