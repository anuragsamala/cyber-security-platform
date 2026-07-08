import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/users';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Apply auth middleware to all user routes
router.use(authenticate);

// Super Admins and Institution Admins can view and manage users
router.get('/', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN]), getUsers);
router.get('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN]), getUserById);
router.put('/:id', authorize([Role.SUPER_ADMIN, Role.INSTITUTION_ADMIN]), updateUser);
router.delete('/:id', authorize([Role.SUPER_ADMIN]), deleteUser);

export default router;
