import User, { IUser } from "../models/user";
import LoggerUser from '../models/LoggerUser'
import {Request,Response} from 'express'
import jwt from 'jsonwebtoken'
import {SECRET} from '../const'
import mongoose from "mongoose";
import { RequestWithRole } from "../types/ReqWithUserRole";
// import { printMessage } from "../helpers/phoneHelpers";
export const getUsers = async (_req:Request, res:Response) => {
    try {
        const u = await User.find().select("-pwdHash -_v");
        if(!u){
            return res.status(404).json({message: "Error al obtener los usuarios"});
        }

                // Convert _id to id
        const modifiedUsers = u.map((user: any) => {
            const { _id, ...otherProps } = user.toObject(); // Convert the ticket to a plain object and destructure to get _id and other properties
            return { id: _id, ...otherProps }; // Return the modified object
            });

            res.setHeader('X-Total-Count', modifiedUsers.length);

            return res.status(200).json(modifiedUsers);

    } catch (error: any) {
        return res.status(500).json({message:error.message});
    }
};

export const getUser = async (req:Request, res:Response) => {
    try {
        const u = await User.findById(req.params.id).select("-pwdHash -_v");
        if(!u){
            return res.status(404).json({message: "Error al obtener el usuario"})
        }

        const responseObj = {
            id:u._id,
            ...u.toObject()
        }

        return res.status(200).json(responseObj);

    } catch (error:any) {
        return res.status(500).json({message:error.message})
    }
}

export const createUser = async (req: RequestWithRole, res: Response) => {
    const { username, pwdHash, role, phone} = req.body;
    const uLogger = req.userID;
    console.log(uLogger); // TODO: CHANGE UNDEFINED VALUE

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
    // User Logger
    const uLog = new LoggerUser({
        loggedID:uLogger,
        modifiedUserID:result._id,
        action:"Created User"
    })
    
    console.log(` result : \n ${result}`)
    console.log(` Ulog : \n ${uLog}`)

    await uLog.save();
    return res.status(201).json({ message: result });
    } catch (error:any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req:RequestWithRole, res:Response) => {
    const filter  = req.params.id;
    const { phone,userID } = req.body;
    const userToLog = req.userID;

    if (!userToLog) {
        return res.status(400).json({ message: 'Faltan datos' });
    } // TODO log the update user interaction

    console.log(userID)
    if (!filter || !mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        const userUpdatedResult = await User.findByIdAndUpdate(filter,req.body,{new:true});

        if (phone) {
        //    printMessage(req.body.phone, "Un administrador ha actualizado tu número de teléfono.");
        }
        
        if(!userUpdatedResult){
            return res.status(404).json({message:"User Not Found"});
        }

        const responseObj = {
            id: userUpdatedResult._id,
            ...userUpdatedResult.toObject()
        }

        return res.status(203).json(responseObj);

    } catch (error:any) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteUser = async (req: RequestWithRole, res: Response) => {
    const userID = req.userID; // TODO use this to LOG the delete user interaction
    
    if (!userID) {
        return res.status(400).json({ message: 'Faltan datos' });
    } 

    let u;
    try {
        u = await User.findByIdAndDelete(req.params.id);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
    
    if (!u) {
        return res.status(500).json({ message: 'Error al eliminar usuario' });
    }
    
    return res.status(200).json(u);
};


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
        userID: u._id, // TODO: remove once front-end is updated
        role: u.role,
        message: "¡Bienvenido, " + u.username + "!",
    });
};