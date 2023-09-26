import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser, authUser } from "../controllers/users.controllers";

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/auth', authUser);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;