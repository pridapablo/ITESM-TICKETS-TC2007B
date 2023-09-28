import { Router } from "express";
import * as ResolutionCtrl from '../controllers/resolution.controller';

const router = Router();

router.get('/resolution/:id', ResolutionCtrl.getResolution);

router.get('/resolution/', ResolutionCtrl.getResolutions);

router.post('/resolution/', ResolutionCtrl.createResolution);

router.put('/resolution/:id', ResolutionCtrl.updateResolution);

router.delete('/resolution/:id', ResolutionCtrl.deleteResolution);

export default router;