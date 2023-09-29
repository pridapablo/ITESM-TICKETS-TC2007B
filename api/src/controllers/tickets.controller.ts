import {Request,Response} from 'express'

// @ts-ignore
import ticket from "../models/ticket";


export const getTickets = async (_req:Request, res:Response) => {
    let u;
    try {
        u = await ticket.find();
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener tickets'});
    }
    res.status(200).json(u);
};

export const getTicket = async (req:Request, res:Response) => {
    let u;
    try {
        u =await ticket.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener ticket'});
    }
    res.status(200).json(u);
}

export const createTicket = async (req:Request, res:Response) => {
    const { classification, type, priority, resolutionID, closureTime } = req.body;

    if (!classification || !type || !priority || !resolutionID || !closureTime) {
        res.status(400).json({message: 'Faltan datos'});
    }
    const u = new ticket({
        classification,
        type,
        priority,
        resolutionID,
        closureTime,
    });

    let result;
    try {
        result = await u.save();
    } catch (error : any) {
        res.status(500).json({message: error.message});
    }
    if(!result) {
        res.status(500).json({message: 'Error al crear ticket'});
    }
    res.status(201).json(result);
}   

export const updateTicket = async (req:Request, res:Response) => {
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

export const deleteTicket = async (req:Request, res:Response) => {
    let u;
try {
        u = await ticket.findByIdAndDelete(req.params.id);
    
} catch (error: any) {
    res.status(500).json({message: error.message});
    
}
    if (!u) {
        res.status(500).json({message: 'Error al eliminar ticket'});
    }
    res.status(200).json(u);
}
