import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../const';

interface IVerifyToken{
    _id:string;
    iat:number;
    exp:number;
}

// @ts-ignore
export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json("Access-denied");
    }

    try {
        const verifyToken = jwt.verify(token, SECRET) as IVerifyToken;
        req.userId = verifyToken._id;

        next();
    } catch (error) {
        return res.status(401).json("Invalid token");
    }
};
