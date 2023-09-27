// @ts-ignore
import classification from "../models/classification";

// @ts-ignore
export const getClassifications = async (_req, res) => {
    let c;
    try {
        c = await classification.find();
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!c) {
        res.status(500).json({message: 'Error al obtener clasificaciones'});
    }
    res.status(200).json(c);
};
