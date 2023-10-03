import {Request,Response} from 'express'

// @ts-ignore
import ticket from "../models/ticket";


export const getTickets = async (_req: Request, res: Response) => {
    try {
        const tickets = await ticket.find();
        if (!tickets) {
            return res.status(500).json({message: 'Error al obtener tickets'});
        }
        
        // Convert _id to id
        const modifiedTickets = tickets.map((ticket: any) => {
            const { _id, ...otherProps } = ticket.toObject(); // Convert the ticket to a plain object and destructure to get _id and other properties
            return { id: _id, ...otherProps }; // Return the modified object
        });
        
        // Set the X-Total-Count header
        res.setHeader('X-Total-Count', modifiedTickets.length);
        
        return res.status(200).json(modifiedTickets);
    } catch (error: any) {
        return res.status(500).json({message: error.message});
    }
};

export const getTicket = async (req: Request, res: Response) => {
    let t;
    try {
        t = await ticket.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
        return;  // Don't forget to return here to exit the function
    }
    if (!t) {
        res.status(404).json({message: 'Error al obtener ticket'});  // Consider using 404 for not found
        return;  // Don't forget to return here to exit the function
    }
    // Create a new object with the desired structure
    const responseObj = {
        id: t._id,
        // ...other fields from t you want to include
        // e.g., name: t.name,
    };
    res.status(200).json(responseObj);
};


export const createTicket = async (req:Request, res:Response) => {
    const { classification, subclassification, priority, description } = req.body;

    if (!classification || !subclassification || !priority || !description ) {
        res.status(400).json({message: 'Faltan datos'});
    }
    const u = new ticket({
        classification,
        subclassification,
        priority,
        description,
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
