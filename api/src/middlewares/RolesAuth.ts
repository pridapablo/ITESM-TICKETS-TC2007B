import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../const";

import User from "../models/user";
import { RequestWithRole } from "../types/ReqWithUserRole";

interface IVerifyToken {
  _id: string;
}

export const GetToken = (req: Request): string | null => {
  const token = req.header("Authentication");

  if (!token) {
    return null;
  }

  try {
    const verifyToken = jwt.verify(token, SECRET) as IVerifyToken;
    return verifyToken._id;
  } catch (error) {
    return null;
  }
};
// @ts-ignore
export const AdminAuth = async (
  req: RequestWithRole,
  res: Response,
  next: NextFunction
) => {
  const userId = GetToken(req);

  try {
    if (!userId) {
      return res.status(401).json("Invalid token");
    }

    const u = await User.findById(userId).select("-username -pwdHash -_v");

    if (u?.role.includes("admin")) {
      // Attach the role to the request object
      req.userRole = u.role;
      req.userID = u._id;

      next();
    } else {
      return res.status(403).json("Requer Admin Role");
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

//General Middleware (all user types) ADD
// @ts-ignore
export const GeneralAuth = async (
  req: RequestWithRole,
  res: Response,
  next: NextFunction
) => {
  const userId = GetToken(req);

  try {
    if (!userId) {
      return res.status(401).json("Invalid token");
    }

    const u = await User.findById(userId).select("-username -pwdHash");

    if (
      u?.role.includes("admin") ||
      u?.role.includes("agent") ||
      u?.role.includes("user")
    ) {
      // Attach the role to the request object
      req.userRole = u.role;
      req.userID = u._id;
      next();
    } else {
      return res.status(403).json("Require Admin, Agent or User Role");
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
