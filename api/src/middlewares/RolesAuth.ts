import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../const';

import User from '../models/user';

interface IVerifyToken {
    _id: string;
}

export const GetToken = (req: Request): string | null => {
    const token = req.header("auth-token");

    if (!token) {
        return null; 
    }

    try {
        const verifyToken = jwt.verify(token, SECRET) as IVerifyToken;
        return verifyToken._id;
    } catch (error) {
        return null; 
    }
}
// @ts-ignore
export const AdminAuth = async (req: Request, res: Response, next: NextFunction) => {
    const userId = GetToken(req);

    try {
        if (!userId) {
            return res.status(401).json("Invalid token");
        }

        const u = await User.findById(userId).select("-username -pwdHash");

        if (u?.role.includes("admin")) {
            next();
        } else {
            return res.status(403).json("Requer Admin Role");
        }
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}

// @ts-ignore
export const RoleAuth = async (req:Request, res:Response, next:NextFunction)=>{
    const userId = GetToken(req);

    try{
        if(!userId){
            return res.status(401).json("Invalid token");
        }

        const u = await User.findById(userId).select("-username -pwdHash");

        if(u?.role.includes("admin") || u?.role.includes("Agent")){
            next();
        }
        else{
            return res.status(403).json("Require Admin or Coordinator Role");
        }
    }
    catch(error){
        return res.status(500).json("Internal server error");
    }
}