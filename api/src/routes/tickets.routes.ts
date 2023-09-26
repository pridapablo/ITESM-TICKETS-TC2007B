import { Router } from "express";
import { createTicket, deleteTicket, getTicket, getTickets, updateTicket } from "../controllers/tickets.controller";

const router = Router();

router.get('/', getTickets);

router.get('/:id', getTicket);

router.post('/', createTicket);

router.put('/:id', updateTicket);

router.delete('/:id', deleteTicket);


export default router;