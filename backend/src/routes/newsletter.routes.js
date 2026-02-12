import { Router } from 'express';
import newsletterController from '../controllers/newsletter.controller.js';
import { 
  validateSubscribe, 
  validateUnsubscribe, 
  validateSendCampaign, 
  validatePreviewRecipients 
} from '../middlewares/validator/newsletter.validator.js';
import { checkAuth, restrictTo } from '../middlewares/auth.middleware.js';
const router = Router();


router.post('/subscribe', validateSubscribe, newsletterController.subscribe);
router.post('/unsubscribe', validateUnsubscribe, newsletterController.unsubscribe);
router.get('/count', newsletterController.getCount);


router.use(checkAuth);

router.use(restrictTo('admin', 'superadmin'));

router.get('/', newsletterController.getAllActive);
router.post('/campaign/preview', validatePreviewRecipients, newsletterController.previewRecipients);
router.post('/campaign/send', validateSendCampaign, newsletterController.sendCampaign);

export default router;