import {Request,Response} from 'express'
import resolution from "../models/resolution";

export const getResolutions = async (_req:Request, res:Response) => {
    let u;
    try {
        u = await resolution.find();
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener soluciones'});
    }
    res.status(200).json(u);
};

export const getResolution = async (req:Request, res:Response) => {
    let u;
    try {
        u =await resolution.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener solución'});
    }
    res.status(200).json(u);
}

export const createResolution = async (req:Request, res:Response) => {
    const { classification, type, priority, resolutionID, closureTime } = req.body;

    if (!classification || !type || !priority || !resolutionID || !closureTime) {
        res.status(400).json({message: 'Faltan datos'});
    }
    const u = new resolution({
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
        res.status(500).json({message: 'Error al crear solución'});
    }
    res.status(201).json(result);
}   

export const updateResolution = async (req:Request, res:Response) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Faltan datos' });
    }
    let u;
    try {
        u = await resolution.findByIdAndUpdate(req.params.id, req.body);
    
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    if (!u) {
        res.status(500).json({ message: 'Error al actualizar solución' });
    }
    
    res.status(200).json(u);
}

export const deleteResolution = async (req:Request, res:Response) => {
    let u;
try {
        u = await resolution.findByIdAndDelete(req.params.id);
    
} catch (error: any) {
    res.status(500).json({message: error.message});
    
}
    if (!u) {
        res.status(500).json({message: 'Error al eliminar solución'});
    }
    res.status(200).json(u);
}
