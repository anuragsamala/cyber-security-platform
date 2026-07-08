import { Router } from 'express';
import { getInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution } from '../controllers/institutions';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Apply auth middleware to all institution routes
router.use(authenticate);

// Only Super Admins can manage institutions directly
router.get('/', authorize([Role.SUPER_ADMIN]), getInstitutions);
router.post('/', authorize([Role.SUPER_ADMIN]), createInstitution);

// Institution Admins can view/edit their own, Super Admins can do it for any
router.get('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN]), getInstitutionById);
router.put('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN]), updateInstitution);
router.delete('/:id', authorize([Role.SUPER_ADMIN]), deleteInstitution);

export default router;
