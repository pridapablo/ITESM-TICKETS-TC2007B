import { Router } from "express";
import { getClassifications } from "../controllers/classification.controllers";

const router = Router();

router.get('/', getClassifications);

export default router;