import { Request } from 'express';

export interface RequestWithRole extends Request {
    userRole?: string;
    userID?: string;
}
