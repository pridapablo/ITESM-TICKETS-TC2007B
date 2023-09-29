import { Router } from "express";
import * as TicketCtrl from '../controllers/tickets.controller'


const router = Router();

router.get('/', TicketCtrl.getTickets);

router.get('/:id', TicketCtrl.getTicket);

router.post('/', TicketCtrl.createTicket);

router.put('/:id', TicketCtrl.updateTicket);

router.delete('/:id', TicketCtrl.deleteTicket);


export default router;