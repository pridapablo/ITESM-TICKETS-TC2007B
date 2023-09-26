// @ts-ignore
import ticketUser from "../models/ticket";

// @ts-ignore
export const getTicketsUser = async (_req, res) => {
    let u;
    try {
        u = await ticketUser.find();
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener usuarios'});
    }
    res.status(200).json(u);
};

// @ts-ignore
export const getTicketUser = async (req, res) => {
    let u;
    try {
        u =await ticketUser.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener usuario'});
    }
    res.status(200).json(u);
}

// @ts-ignore
export const createTicketUser = async (req, res) => {
    const { classification, type, priority, resolutionID, closureTime } = req.body;

    if (!classification || !type || !priority || !resolutionID || !closureTime) {
        res.status(400).json({message: 'Faltan datos'});
    }
    const u = new ticketUser({
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
        res.status(500).json({message: 'Error al crear usuario'});
    }
    res.status(201).json(result);
}   

// @ts-ignore
export const updateTicketUser = async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Faltan datos' });
    }
    let u;
    try {
        u = await ticketUser.findByIdAndUpdate(req.params.id, req.body);
    
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    if (!u) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
    
  res.status(200).json(u);
}

// @ts-ignore
export const deleteTicketUser = async (req, res) => {
    let u;
try {
        u = await ticketUser.findByIdAndDelete(req.params.id);
    
} catch (error: any) {
    res.status(500).json({message: error.message});
    
}
    if (!u) {
        res.status(500).json({message: 'Error al eliminar usuario'});
    }
    res.status(200).json(u);
}
