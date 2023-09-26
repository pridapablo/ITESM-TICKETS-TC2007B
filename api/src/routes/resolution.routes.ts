import { Router } from "express";
import { createResolution, deleteResolution, getResolution, getResolutions, updateResolution } from "../controllers/resolution.controller";

const router = Router();

router.get('/resolution/:id', getResolution);

router.get('/resolution/', getResolutions);

router.post('/resolution/', createResolution);

router.put('/resolution/:id', updateResolution);

router.delete('/resolution/:id', deleteResolution);

export default router;