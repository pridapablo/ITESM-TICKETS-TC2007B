import { Router } from "express";
import {  handleTicket, sendConfirmation } from "../controllers/phone.controllers";

const router = Router();

// Phone added to user
router.post('/confirm', sendConfirmation);

// Chatbot
router.post('/ticket', handleTicket);
    
export default router;