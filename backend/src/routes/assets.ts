import { Router } from 'express';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/assets';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Apply auth middleware to all asset routes
router.use(authenticate);

// Faculty, Security Officers, Admins can view assets
router.get('/', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER, Role.FACULTY, Role.AUDITOR]), getAssets);
router.get('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER, Role.FACULTY, Role.AUDITOR]), getAssetById);

// Only Security Officers and Admins can create/edit/delete assets
router.post('/', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER]), createAsset);
router.put('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER]), updateAsset);
router.delete('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN, Role.SECURITY_OFFICER]), deleteAsset);

export default router;
