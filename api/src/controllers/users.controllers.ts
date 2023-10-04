import User, { IUser } from "../models/user";
import {Request,Response} from 'express'
import jwt from 'jsonwebtoken'
import {SECRET} from '../const'

export const getUsers = async (_req:Request, res:Response) => {
    let u;
    try {
        u = await User.find().select("-username -pwdHash -_v "); 
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener usuarios'});
    }
    res.status(200).json(u);
};

export const getUser = async (req:Request, res:Response) => {
    let u;
    try {
        u =await User.findById(req.params.id).select("-username -pwdHash -_v ");
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener usuario'});
    }
    res.status(200).json(u);
}

export const createUser = async (req: Request, res: Response) => {
    const { username, pwdHash, role, phone} = req.body;

    if (!username || !pwdHash || !role) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        const u: IUser = new User({
            username,
            pwdHash,
            role,
            phone,
    });

    await u.encryptPassword(pwdHash);

        const result = await u.save();
        return res.status(201).json({ message: result });
    } catch (error:any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req:Request, res:Response) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Faltan datos' });
    }
    let u;
    try {
        u = await User.findByIdAndUpdate(req.params.id, req.body);
    
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    if (!u) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
    
    res.status(200).json(u);
}

export const deleteUser = async (req:Request, res:Response) => {
    let u;
try {
        u = await User.findByIdAndDelete(req.params.id);
    
} catch (error: any) {
    res.status(500).json({message: error.message});
    
}
    if (!u) {
        res.status(500).json({message: 'Error al eliminar usuario'});
    }
    res.status(200).json(u);
}

export const authUser = async (req: Request, res: Response) => {
    const { username, pwdHash } = req.body;
    const u = await User.findOne({ username });

    if (!u) {
        return res.status(400).json({ message: "Username or password incorrect" });
    }

    const correctPassword: boolean = await u.validatePassword(pwdHash, u.pwdHash);

    if (!correctPassword) {
        return res.status(403).json({ message: "Incorrect Password" });
    }

    const token: string = jwt.sign({ _id: u._id }, SECRET, { expiresIn: 86400 });
    return res.header("Authorization", token).status(200).json({
        userID: u._id,
        message: "¡Bienvenido, " + u.username + "!",
    });
};