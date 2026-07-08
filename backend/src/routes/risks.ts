import { Router } from 'express';
import { getRisks, createRisk } from '../controllers/risks';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', getRisks);
router.post('/', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER]), createRisk);

export default router;
