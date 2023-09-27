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

const restartChatbot = async (WaId: string, u: any) => {
    await client.messages.create({
        body: "Error. Vuelve a comenzar enviando un mensaje con la palabra 'ticket'.",
        from: "whatsapp:+14155238886",
        to: `whatsapp:+${WaId}`,
    });
    u.chat_state = 0;
    await u.save();
}

const printMessage = async (WaId: string, message: string) => {
    await client.messages.create({
        body: message,
        from: "whatsapp:+14155238886",
        to: `whatsapp:+${WaId}`,
    });
}

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
                    await printMessage(WaId, "Por favor, ingresa la descripción de tu ticket.");
                    u.chat_state = 1;
                    await u.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Description request sent'
                    });

                case 1:
                    //Store ticket description directly
                    u.chat_ticket_description = Body;
                    await u.save();

                     // Send categories menu
                    let categoriesMenuText = menu.map((item, index) => `${index + 1}. ${item}`).join('\n');
                    await printMessage(WaId, `Por favor, selecciona una categoría: \n\n ${categoriesMenuText}`);
                    u.chat_state = 2;
                    await u.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Description stored and categories menu sent'
                    });
            
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
                        await printMessage(WaId, "El número ingresado no es válido. Por favor, ingresa una opción mostrada en el menú.");
                        return res.status(400).json({
                            success: false,
                            message: 'Index is not valid'
                        });
                    }

                   // Send subcategories menu based on category
                    if (u.chat_ticket_category && u.chat_ticket_category in subMenu) {
                        let subcategoriesMenuText = subMenu[u.chat_ticket_category as keyof typeof subMenu].map((item, index) => `${index + 1}. ${item}`).join('\n');
                        await printMessage(WaId, `Por favor, selecciona una subcategoría. Aquí están las opciones: \n\n${subcategoriesMenuText}`);
                        u.chat_state = 3;
                        await u.save();
                    } else {
                        // Handle the case where the category is not in the subMenu
                        await printMessage(WaId, "El número ingresado no es válido. Por favor, ingresa una opción mostrada en el menú.");
                        return res.status(400).json({
                            success: false,
                            message: 'Category is not valid'
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Category stored and subcategories menu sent'
                    });
                
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
                            await printMessage(WaId, "El número ingresado no es válido. Por favor, ingresa una opción mostrada en el menú.");
                            return res.status(400).json({
                                success: false,
                                message: 'Index is not valid'
                            });
                        }
                    } else {
                        // Handle the case where the category is not in the subMenu
                        await printMessage(WaId, "El número ingresado no es válido. Por favor, ingresa una opción mostrada en el menú.");
                        return res.status(400).json({
                            success: false,
                            message: 'Category is not valid'
                        });
                    }

                    // Send priorities menu
                    await printMessage(WaId, `Por favor, ingresa la prioridad de tu ticket. Las opciones son del 1 al 5.\n\n1. Muy baja\n2. Baja\n3. Media\n4. Alta\n5. Muy alta`);
                    u.chat_state = 4;
                    await u.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Subcategory stored and priorities menu sent'
                    });
                
                case 4:
                    // Store priority
                    const priority = parseInt(Body);
                    if (isNaN(priority) || priority < 1 || priority > 5) {
                        // Handle the case where the priority is not a number or is out of bounds
                        await printMessage(WaId, "El número ingresado no es válido. Por favor, ingresa un número del 1 al 5.");
                        return res.status(400).json({
                            success: false,
                            message: 'Priority is not valid'
                        });
                    } else {
                        const processedBody3 = priority;
                        u.chat_ticket_priority = processedBody3;
                        await u.save();
                    }

                     // Ask for ticket confirmation
                    await printMessage(WaId, `Aquí están los detalles de tu ticket:\n\nDescripción: ${u.chat_ticket_description}\nCategoría: ${u.chat_ticket_category}\nSubcategoría: ${u.chat_ticket_subcategory}\nPrioridad: ${u.chat_ticket_priority}\n\nPor favor confirma si los detalles son correctos. Responde con "si" o "no".`);
                    u.chat_state = 5;
                    await u.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Priority stored and confirmation message sent'
                    });
              
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
                        await printMessage(WaId, "Ticket creado con éxito.");
                        u.chat_state = 0;
                        await u.save();
                        return res.status(200).json({
                            success: true,
                            message: 'Ticket created'
                        });
                    } else if (processedBody4 === 'No' || processedBody4 === 'no' || processedBody4 === 'n') {
                        await printMessage(WaId, "Ticket cancelado, vuelve a comenzar enviando un mensaje con la palabra 'ticket'.");
                        u.chat_state = 0;
                        await u.save();
                        return res.status(200).json({
                            success: true,
                            message: 'Ticket cancelled'
                        });
                    } else {
                        // Handle the case where the user did not respond with yes or no
                        await printMessage(WaId, "El texto ingresado no es válido. Por favor, responde con 'si' o 'no'.");
                        return res.status(400).json({
                            success: false,
                            message: 'Text is not valid'
                        });
                    }
                default:
                    // Handle the case where the user's chat_state is not valid
                    await restartChatbot(WaId, u);
                    return res.status(500).json({
                        success: false,
                        message: 'An error occurred'
                    });
            }
        }
    } catch (e) {
        await printMessage(WaId, "Lo sentimos, ha ocurrido un error procesando su solicitud.");
        // Handle the case where an error occurred
        await restartChatbot(WaId, u);
        
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
    await printMessage(phone, `Felicidades, ${name}. Puedes enviar un mensaje con la palabra 'ticket' para hacer un reporte.`);
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
}}
