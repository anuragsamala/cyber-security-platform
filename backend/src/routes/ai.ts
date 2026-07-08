import { Router } from 'express';
import { askChatbot, predictRisk } from '../controllers/ai';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/chat', askChatbot);
router.post('/predict', predictRisk);

export default router;
