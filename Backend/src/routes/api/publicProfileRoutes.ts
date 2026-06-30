import { Router } from 'express';
import { getPublicProfile } from '../../controllers/publicProfileController';

const router = Router();

router.get('/profiles/:id', getPublicProfile);

export default router;
