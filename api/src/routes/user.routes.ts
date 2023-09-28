import { Router } from "express";
import * as UserCtrl  from '../controllers/users.controllers'

import {TokenValidation} from '../middlewares/authJwt'

const router = Router();

router.get('/',TokenValidation ,UserCtrl.getUsers);

router.get('/:id', UserCtrl.getUser);

router.post('/auth', UserCtrl.authUser);

router.post('/', UserCtrl.createUser);

router.put('/:id', UserCtrl.updateUser);

router.delete('/:id', UserCtrl.deleteUser);

export default router;