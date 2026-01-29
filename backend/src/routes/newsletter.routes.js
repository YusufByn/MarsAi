import { Router } from 'express';
import newsletterController from '../controllers/newsletter.controller.js';
import { 
  validateSubscribe, 
  validateUnsubscribe, 
  validateSendCampaign, 
  validatePreviewRecipients 
} from '../middlewares/validator/newsletter.validator.js';

const router = Router();

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    S'inscrire à la newsletter
 * @access  Public
 */
router.post('/subscribe', validateSubscribe, newsletterController.subscribe);

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Se désabonner de la newsletter
 * @access  Public
 */
router.post('/unsubscribe', validateUnsubscribe, newsletterController.unsubscribe);

/**
 * @route   GET /api/newsletter/count
 * @desc    Compter les abonnés actifs
 * @access  Public
 */
router.get('/count', newsletterController.getCount);

/**
 * @route   GET /api/newsletter
 * @desc    Récupérer tous les abonnés actifs
 * @access  Admin (à protéger plus tard avec middleware auth)
 * @todo    Ajouter middleware d'authentification superadmin
 */
router.get('/', newsletterController.getAllActive);

/**
 * @route   POST /api/newsletter/campaign/preview
 * @desc    Aperçu du nombre de destinataires par type
 * @access  Admin + Superadmin
 * @todo    Ajouter middleware d'authentification admin
 */
router.post('/campaign/preview', validatePreviewRecipients, newsletterController.previewRecipients);

/**
 * @route   POST /api/newsletter/campaign/send
 * @desc    Envoyer une campagne newsletter
 * @access  Admin + Superadmin
 * @todo    Ajouter middleware d'authentification admin
 */
router.post('/campaign/send', validateSendCampaign, newsletterController.sendCampaign);

export default router;
