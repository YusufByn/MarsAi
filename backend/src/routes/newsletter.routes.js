import { Router } from 'express';
import newsletterController from '../controllers/newsletter.controller.js';
import { 
  validateSubscribe, 
  validateUnsubscribe, 
  validateSendCampaign, 
  validatePreviewRecipients 
} from '../../../shared/validators/newsletter.validator.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// route publiques 
// route pour s'abonner
router.post('/subscribe', validateSubscribe, newsletterController.subscribe);
// route pour se désabonner
router.post('/unsubscribe', validateUnsubscribe, newsletterController.unsubscribe);
// route pour compter kes inscrit
router.get('/count', newsletterController.getCount);

router.use(checkAuth);


router.use(restrictTo('admin', 'superadmin'));

router.get('/', newsletterController.getAllActive);
router.post('/campaign/preview', validatePreviewRecipients, newsletterController.previewRecipients);
router.post('/campaign/send', validateSendCampaign, newsletterController.sendCampaign);

export default router;