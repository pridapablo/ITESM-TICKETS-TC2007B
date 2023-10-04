import { Request, Response } from 'express'

// @ts-ignore
import ticket from "../models/ticket";
import ticketUser from '../models/ticketUser';
import mongoose from 'mongoose';

export const getTickets = async (req: Request, res: Response) => {
    try {
        let query = {};

        // Verificar si el parámetro 'filter' está presente y es 'true'
        if (req.query.isDeleted === 'true') {
            console.log('Filtering tickets');
            query = { isDeleted: { $ne: true } };  // Tickets donde isDeleted no es true o no existe
        }

        const tickets = await ticket.find(query); // Utiliza la consulta aquí
        if (!tickets) {
            return res.status(500).json({ message: 'Error al obtener tickets' });
        }

        // Convert _id to id
        const modifiedTickets = tickets.map((ticket: any) => {
            const { _id, ...otherProps } = ticket.toObject(); // Convert the ticket to a plain object and destructure to get _id and other properties
            return { id: _id.toString(), ...otherProps };  // Convert _id to string and return a new object with id and otherProps
        });

        // Set the X-Total-Count header
        res.setHeader('X-Total-Count', modifiedTickets.length);

        return res.status(200).json(modifiedTickets);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTicket = async (req: Request, res: Response) => {
    let t;
    try {
        t = await ticket.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
        return;  // Don't forget to return here to exit the function
    }
    if (!t)
        return res.status(404).json({ message: 'Error al obtener ticket' });  // Consider using 404 for not found

    // Create a new object with the desired structure
    const responseObj = {
        id: t._id,
        ...t.toObject(),
    };
    return res.status(200).json(responseObj);
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

    return res.status(201).json({ ticket: ticketResult, user: userResult });
}


export const updateTicket = async (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Faltan datos' });
    }
    let u;
    try {
        u = await ticket.findByIdAndUpdate(req.params.id, req.body);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    if (!u) {
        res.status(500).json({ message: 'Error al actualizar ticket' });
    }

    res.status(200).json(u);
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

    return res.status(200).json({ ticket: ticketUpdateResult, ticketUser: ticketUserCreateRes });
}

