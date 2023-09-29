import { Router } from "express";
import * as UserCtrl  from '../controllers/users.controllers'

import {TokenValidation} from '../middlewares/authJwt'

const router = Router();

router.get('/',TokenValidation,TokenValidation ,UserCtrl.getUsers);

router.get('/:id',TokenValidation, UserCtrl.getUser);

//Sign in route

router.post('/auth',UserCtrl.authUser);

router.post('/', TokenValidation,UserCtrl.createUser);

router.put('/:id',TokenValidation ,UserCtrl.updateUser);

router.delete('/:id', TokenValidation,UserCtrl.deleteUser);

export default router;