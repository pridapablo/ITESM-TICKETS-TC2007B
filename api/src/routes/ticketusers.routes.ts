import { Router } from "express";
import { createTicketUser, deleteTicketUser, getTicketUser, getTicketsUser, updateTicketUser } from "../controllers/ticketUser.controller";

const router = Router();

router.get('/', getTicketsUser);

router.get('/:id', getTicketUser);

router.post('/', createTicketUser);

router.put('/:id', updateTicketUser);

router.delete('/:id', deleteTicketUser);

export default router;