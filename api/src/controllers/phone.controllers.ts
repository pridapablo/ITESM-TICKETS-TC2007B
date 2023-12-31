import user from "../models/user";
import ticket from "../models/ticket";
import ticketUser from "../models/ticketUser";
import { printMessage, restartChatbot } from "../helpers/phoneHelpers";

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
            await printMessage(WaId, "Lo sentimos, tu teléfono no está dado de alta");

            return res.status(404).json({
                success: false,
                message: `User with phone number ${WaId} not found`,
            });
        } else {
            switch (u.chat.state) {
                case 0:
                case undefined:
                    // Ask for ticket description
                    await printMessage(WaId, "Por favor, ingresa la descripción de tu ticket.");
                    u.chat.state = 1;
                    await u.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Description request sent'
                    });

                case 1:
                    //Store ticket description directly
                    u.chat.ticket_description = Body;
                    await u.save();

                     // Send categories menu
                    let categoriesMenuText = menu.map((item, index) => `${index + 1}. ${item}`).join('\n');
                    await printMessage(WaId, `Por favor, selecciona una categoría: \n\n ${categoriesMenuText}`);
                    u.chat.state = 2;
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
                        u.chat.ticket_category = processedBody;
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
                    if (u.chat.ticket_category && u.chat.ticket_category in subMenu) {
                        let subcategoriesMenuText = subMenu[u.chat.ticket_category as keyof typeof subMenu].map((item, index) => `${index + 1}. ${item}`).join('\n');
                        await printMessage(WaId, `Por favor, selecciona una subcategoría. Aquí están las opciones: \n\n${subcategoriesMenuText}`);
                        u.chat.state = 3;
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
                    if (u.chat.ticket_category && u.chat.ticket_category in subMenu) {
                        const subcategories = subMenu[u.chat.ticket_category as keyof typeof subMenu];
                        if (index2 >= 0 && index2 < subcategories.length) {
                            const processedBody2 = subcategories[index2];
                            u.chat.ticket_subcategory = processedBody2;
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
                    u.chat.state = 4;
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
                        u.chat.ticket_priority = processedBody3;
                        await u.save();
                    }

                     // Ask for ticket confirmation
                    await printMessage(WaId, `Aquí están los detalles de tu ticket:\n\nDescripción: ${u.chat.ticket_description}\nCategoría: ${u.chat.ticket_category}\nSubcategoría: ${u.chat.ticket_subcategory}\nPrioridad: ${u.chat.ticket_priority}\n\nPor favor confirma si los detalles son correctos. Responde con "si" o "no".`);
                    u.chat.state = 5;
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
                        description: u.chat.ticket_description,
                        classification: u.chat.ticket_category,
                        subclassification: u.chat.ticket_subcategory,
                        priority: u.chat.ticket_priority,
                        user: u._id,
                        });
                        await t.save();
                        console.log(t);
                        const tu = new ticketUser({
                            userID: u._id,
                            ticketID: t._id,
                            interactionDate: new Date(),
                            interactionType: 'create',
                        });
                        await tu.save();
                        console.log(tu);
                        await printMessage(WaId, "Ticket creado con éxito.");
                        u.chat.state = 0;
                        await u.save();
                        return res.status(200).json({
                            success: true,
                            message: 'Ticket created'
                        });
                    } else if (processedBody4 === 'No' || processedBody4 === 'no' || processedBody4 === 'n') {
                        await printMessage(WaId, "Ticket cancelado, vuelve a comenzar enviando un mensaje con la palabra 'ticket'.");
                        u.chat.state = 0;
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
export const phoneConfirmation = async (req, res) => {
    const userID = req.userID;
    const { phone } = req.body;
    if (!userID || !phone ) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    let u;
    try {
        u = await user.findByIdAndUpdate(userID, { phone });
          if (!u) {
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
        await printMessage(phone, `Felicidades. Puedes enviar un mensaje con la palabra 'ticket' para hacer un reporte.`);
        res.status(200).json({ message: "Message sent and user updated" });
      
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending message" });
    }
}
