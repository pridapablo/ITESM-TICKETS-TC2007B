import { Router } from "express";
import {  handleTicket, phoneConfirmation } from "../controllers/phone.controllers";
import { TokenValidation } from "../middlewares/authJwt";

const router = Router();

// Phone added to user
router.post('/confirm', TokenValidation, phoneConfirmation); 

// Chatbot
router.post('/ticket', handleTicket);// NO MIDDLEWARE (TWILIO PINGS)
    
export default router;