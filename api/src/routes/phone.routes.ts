import { Router } from "express";
import {  handleTicket, phoneConfirmation } from "../controllers/phone.controllers";

const router = Router();

// Phone added to user
router.post('/confirm', phoneConfirmation);

// Chatbot
router.post('/ticket', handleTicket);
    
export default router;