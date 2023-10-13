import { Request, Response } from 'express'

// @ts-ignore
import ticket from "../models/ticket";
import ticketUser from '../models/ticketUser';
import mongoose from 'mongoose';

export const getTickets = async (req: Request, res: Response) => {
    try {
        let query: any = {
            interactionType: 'create',
        };

        let sortKey = 'interactionDate';

        // Buscar los TicketUser y poblar los datos del Ticket
        const ticketUsers = await ticketUser.find(query)
            .populate([
                {
                    path: 'ticketID',
                    // Puedes añadir select, match, etc. aquí si lo deseas.
                },
                {
                    path: 'userID',
                    // Puedes seleccionar o excluir campos específicos aquí, por ejemplo:
                    select: 'username _id', // incluye solo los campos name y email, excluye _id
                }
            ])
            .sort({ [sortKey]: -1 });

        let validTicketUsers = ticketUsers.filter((tu: any) => tu.ticketID !== null);

        // Verificar si el parámetro 'filter' está presente y es 'true'
        if (req.query.isDeleted === 'true') {
            console.log('Filtering tickets');
            validTicketUsers = validTicketUsers.filter((tu: any) => tu.ticketID && tu.ticketID.isDeleted !== true);
        }

        // Si req.query.sortByPriority es true, ordenar por priority después de recuperar los datos
        if (req.query.sortByPriority === 'true') {
            console.log('Sorting by priority');
            validTicketUsers.sort((a: any, b: any) => b.ticketID.priority - a.ticketID.priority);
        }

        // Convert _id to id
        const modifiedTickets = validTicketUsers.map((ticketUser: any) => {
            const { _id, ...otherProps } = ticketUser.ticketID.toObject();
            const userData = ticketUser.userID ? ticketUser.userID.toObject() : {};

            return {
                id: _id.toString(),
                ...otherProps,
                createdOn: ticketUser.interactionDate,
                creator: userData
            };
        });


        // Set the X-Total-Count header
        res.setHeader('X-Total-Count', modifiedTickets.length);

        console.log('Tickets', modifiedTickets);
        return res.status(200).json(modifiedTickets);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTicket = async (req: Request, res: Response) => {
    try {
        // Buscar el ticket por id
        const t = await ticket.findById(req.params.id);

        if (!t) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Buscar la entrada correspondiente en TicketUser para obtener la fecha de creación y el creador
        const tUser = await ticketUser.findOne({ ticketID: t._id })
            .populate({
                path: 'userID',
                select: 'username _id',
            });

        if (!tUser) {
            // Handle the case when TicketUser entry is not found
            // You might choose to handle this differently depending on your use case
            return res.status(404).json({ message: 'TicketUser not found' });
        }

        const { _id, ...otherProps } = t.toObject();
        const userData = tUser.userID
            ? { _id: (tUser.userID as any)._id, username: (tUser.userID as any).username }
            : {};


        // Construir el objeto de respuesta
        const responseObj = {
            id: _id.toString(),
            ...otherProps,
            createdOn: tUser.interactionDate,
            creator: userData,
        };

        console.log('Ticket', responseObj);
        return res.status(200).json(responseObj);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const createTicket = async (req: Request, res: Response) => {
    const { classification, subclassification, priority, description, userID } = req.body;


    if (!classification || !subclassification || !priority || !description || !mongoose.Types.ObjectId.isValid(userID)) {
        res.status(400).json({ message: 'Faltan datos' });
        return;
    }

    const t = new ticket({
        classification,
        subclassification,
        priority,
        description,
    });

    let ticketResult;
    let userResult;

    try {
        ticketResult = await t.save();

        userResult = await ticketUser.create({
            userID,
            ticketID: ticketResult._id,
            interactionDate: new Date(),
            interactionType: 'create',
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }

    if (!ticketResult || !userResult) {
        return res.status(500).json({ message: 'Error al crear ticket o usuario del ticket' });
    }

    console.log('Ticket updated', ticketResult);
    console.log('Ticket user created', userResult);

    // Create a new object with the desired structure
    const responseObj = {
        id: ticketResult._id,
        ...ticketResult.toObject(),
    };
    return res.status(200).json(responseObj);
}

export const updateTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userID } = req.body;  // assuming userID is provided in the request body

    if (!id || !mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    let ticketUpdateResult;
    let ticketUserCreateRes;

    try {
        ticketUpdateResult = await ticket.findByIdAndUpdate(id, req.body, { new: true });  // { new: true } to return the updated document

        ticketUserCreateRes = await ticketUser.create({
            userID,
            ticketID: id,
            interactionDate: new Date(),
            interactionType: 'update',
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }

    if (!ticketUpdateResult || !ticketUserCreateRes) {
        return res.status(500).json({ message: 'Error al actualizar ticket o usuario del ticket' });
    }

    console.log('Ticket updated', ticketUpdateResult);
    console.log('Ticket user created', ticketUserCreateRes);

    // Create a new object with the desired structure
    const responseObj = {
        id: ticketUpdateResult._id,
        ...ticketUpdateResult.toObject(),
    };
    return res.status(200).json(responseObj);
}

export const deleteTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userID } = req.body; // Aquí recibes el userID del cuerpo

    console.log('Deleting ticket with id', id);
    console.log('User ID', userID);

    if (!id || !mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    let ticketUpdateResult;
    let ticketUserCreateRes;

    try {
        // Marcar el ticket como eliminado
        ticketUpdateResult = await ticket.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        // Registrar la interacción en ticketUser
        ticketUserCreateRes = await ticketUser.create({
            userID,
            ticketID: id,
            interactionDate: new Date(),
            interactionType: 'delete',
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }

    if (!ticketUpdateResult || !ticketUserCreateRes) {
        return res.status(500).json({ message: 'Error al marcar el ticket como eliminado o registrar la interacción' });
    }

    console.log('Ticket updated', ticketUpdateResult);
    console.log('Ticket user created', ticketUserCreateRes);

    // Create a new object with the desired structure
    const responseObj = {
        id: ticketUpdateResult._id,
        ...ticketUpdateResult.toObject(),
    };
    return res.status(200).json(responseObj);
}