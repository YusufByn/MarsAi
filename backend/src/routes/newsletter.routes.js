import { Router } from 'express';
import newsletterController from '../controllers/newsletter.controller.js';
import { 
  validateSubscribe, 
  validateUnsubscribe, 
  validateSendCampaign, 
  validatePreviewRecipients 
} from '../middlewares/validator/newsletter.validator.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.middleware.js';

const router = Router();

// route publiques 
// route pour s'abonner à la newsletter
router.post('/subscribe', validateSubscribe, newsletterController.subscribe);
// route pour se désabonner de la newsletter
router.post('/unsubscribe', validateUnsubscribe, newsletterController.unsubscribe);
// route pour compter les abonnés actifs
router.get('/count', newsletterController.getCount);

// routes protégées

// route pour récupérer tous les abonnées actifs
router.get('/', checkAuth, requireRole('admin', 'superadmin'), newsletterController.getAllActive);
// route pour prévisualiser le nombre de destinataires par type
router.post('/campaign/preview', checkAuth, requireRole('admin', 'superadmin'), validatePreviewRecipients, newsletterController.previewRecipients);
// route pour envoyer une campagne newsletter
router.post('/campaign/send', checkAuth, requireRole('admin', 'superadmin'), validateSendCampaign, newsletterController.sendCampaign);

export default router;
