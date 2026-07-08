import { Router } from 'express';
import { getIncidents, getIncidentById, createIncident, updateIncident, deleteIncident } from '../controllers/incidents';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', getIncidents);
router.get('/:id', getIncidentById);

router.post('/', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER]), createIncident);
router.put('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER]), updateIncident);
router.delete('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN]), deleteIncident);

export default router;
