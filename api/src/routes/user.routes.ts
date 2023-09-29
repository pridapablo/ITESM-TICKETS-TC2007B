import { Router } from "express";
import * as UserCtrl  from '../controllers/users.controllers'

import { TokenValidation } from '../middlewares/authJwt'
import { AdminAuth } from '../middlewares/RolesAuth'

const router = Router();

router.get('/',TokenValidation,UserCtrl.getUsers);

router.get('/:id',TokenValidation, UserCtrl.getUser)

//Sign in route

router.post('/auth',UserCtrl.authUser);

router.post('/', TokenValidation,AdminAuth,UserCtrl.createUser);

router.put('/:id',TokenValidation,AdminAuth ,UserCtrl.updateUser);

router.delete('/:id', TokenValidation,AdminAuth,UserCtrl.deleteUser);

export default router;