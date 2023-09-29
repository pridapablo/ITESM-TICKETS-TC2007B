import { Router } from "express";
import * as TicketUserCtrl from '../controllers/ticketUser.controller'

const router = Router();

router.get('/', TicketUserCtrl.getTicketsUser);

router.get('/:id', TicketUserCtrl.getTicketUser);

router.post('/', TicketUserCtrl.createTicketUser);

router.put('/:id', TicketUserCtrl.updateTicketUser);

router.delete('/:id', TicketUserCtrl.deleteTicketUser);

export default router;