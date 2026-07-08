import { Router } from 'express';
import { getComplianceRecords, createComplianceRecord } from '../controllers/compliance';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', getComplianceRecords);
router.post('/', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER, Role.AUDITOR]), createComplianceRecord);

export default router;
