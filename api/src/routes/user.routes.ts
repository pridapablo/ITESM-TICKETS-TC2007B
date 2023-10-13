import { Router } from "express";
import * as UserCtrl  from '../controllers/users.controllers'

import { AdminAuth } from '../middlewares/RolesAuth'

const router = Router();

router.get('/',AdminAuth,UserCtrl.getUsers);

router.get('/:id',AdminAuth, UserCtrl.getUser)

//Sign in route

router.post('/auth',UserCtrl.authUser);

router.post('/', AdminAuth,UserCtrl.createUser);

router.put('/:id',AdminAuth,UserCtrl.updateUser);

router.delete('/:id',AdminAuth,UserCtrl.deleteUser);

export default router;