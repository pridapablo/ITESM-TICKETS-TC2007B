import {Router} from 'express'
import {getPrueba} from '../controllers/prueba.controller'

const router = Router();

router.get('/', getPrueba);


export default router;