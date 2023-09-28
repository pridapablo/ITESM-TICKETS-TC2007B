import {Request,Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';
import {SECRET} from '../const'

//Schema
//import User from '../models/user';

export const TokenValidation =  (req:Request, res:Response, next:NextFunction)=>{
    const token = req.header('auth-token');

    if(!token){
        return res.status(401).json("Access-denied")
    }

    const verifyToken = jwt.verify(token,SECRET);
    console.log(verifyToken);

    return res.status(200);

    next();
    
}

