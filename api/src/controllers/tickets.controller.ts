import { Request, Response } from 'express'

// @ts-ignore
import ticket from "../models/ticket";
import ticketUser from '../models/ticketUser';
import mongoose from 'mongoose';
import { RequestWithRole } from '../types/ReqWithUserRole';

export const getTickets = async (req: RequestWithRole, res: Response) => {
    try {
        let query: any = {};

        if (req.query.isDeleted === 'true') {
            console.log('Filtering tickets');
            query.isDeleted = { $ne: true };  // Tickets where isDeleted is not true or doesn't exist
        }

        // Check if the role is 'user'
        if (req.userRole?.includes('user')) {
            // Find the tickets created by this user
            const userTickets = await ticketUser.find({ userID: req.userId, interactionType: 'create' }).select('ticketID');
            const ticketIds = userTickets.map(t => t.ticketID);

            // Add to query
            query._id = { $in: ticketIds };
        }

        const tickets = await ticket.find(query); // Use the query here
        if (!tickets) {
            return res.status(500).json({ message: 'Error fetching tickets' });
        }

        // Convert _id to id
        const modifiedTickets = tickets.map((ticket: any) => {
            const { _id, ...otherProps } = ticket.toObject();
            return { id: _id.toString(), ...otherProps };
        });

        // Set the X-Total-Count header
        res.setHeader('X-Total-Count', modifiedTickets.length);

        return res.status(200).json(modifiedTickets);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};


export const getTicket = async (req: RequestWithRole, res: Response) => {
    let t;
    try {
        t = await ticket.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
        return; 
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

     console.log('Ticket updated', ticketResult);
    console.log('Ticket user created', userResult);

    // Create a new object with the desired structure
    const responseObj = {
        id: ticketResult._id,
        ...ticketResult.toObject(),
    };
    return res.status(200).json(responseObj);
}

export const updateTicket = async (req: RequestWithRole, res: Response) => {
    const { id } = req.params;
    const userID = req.userID;
    if (!userID) {
        return res.status(400).json({ message: 'Token no válido' });
    }

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

export const deleteTicket = async (req: RequestWithRole, res: Response) => {
    const { id } = req.params;
    const userID = req.userID;

    console.log('Deleting ticket with id', id);
    console.log('User ID', userID);

    if (!userID) {
        return res.status(400).json({ message: 'Token no válido' });
    }
    
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