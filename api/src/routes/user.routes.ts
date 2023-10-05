import { Router } from "express";
import * as UserCtrl  from '../controllers/users.controllers'

//import { TokenValidation } from '../middlewares/authJwt'
//import { AdminAuth } from '../middlewares/RolesAuth'

const router = Router();

router.get('/',UserCtrl.getUsers);

router.get('/:id', UserCtrl.getUser)

//Sign in route

router.post('/auth',UserCtrl.authUser);

router.post('/', UserCtrl.createUser);

router.put('/:id',UserCtrl.updateUser);

router.delete('/:id',UserCtrl.deleteUser);

export default router;