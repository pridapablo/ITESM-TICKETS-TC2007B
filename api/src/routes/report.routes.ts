import {Router} from 'express'
import {getReport} from '../controllers/report.controller'

import { AdminAuth } from '../middlewares/RolesAuth'

const router = Router();

router.get('/',AdminAuth, getReport);


export default router;