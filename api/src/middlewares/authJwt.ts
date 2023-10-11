import {  Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../const';
import { RequestWithRole } from '../types/ReqWithUserRole';

interface IVerifyToken{
    _id:string;
    iat:number;
    exp:number;
}

// @ts-ignore
export const TokenValidation = (req: RequestWithRole, res: Response, next: NextFunction) => {
    const token = req.header('Authentication');

    if (!token) {
        return res.status(401).json("Access-denied");
    }

    try {
        const verifyToken = jwt.verify(token, SECRET) as IVerifyToken;
        req.userID = verifyToken._id;

        next();
    } catch (error) {
        return res.status(401).json("Invalid token");
    }
};
