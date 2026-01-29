import newsletterModel from '../models/newsletter.model.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const newsletterController = {
  /**
   * S'inscrire à la newsletter
   */
  async subscribe(req, res, next) {
    try {
      const { email } = req.body;

      // Vérifier si l'email existe déjà
      const existingSubscription = await newsletterModel.findByEmail(email);

      // Cas 1: Email déjà inscrit et actif
      if (existingSubscription && !existingSubscription.unsubscribed_at) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà inscrit à la newsletter'
        });
      }

      // Cas 2: Email existant mais désabonné → Réabonner
      if (existingSubscription && existingSubscription.unsubscribed_at) {
        await newsletterModel.resubscribe(email);
        
        // Envoyer l'email de bienvenue
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
          // On continue même si l'email échoue
        }

        return res.status(200).json({
          success: true,
          message: 'Réinscription réussie ! Bienvenue de nouveau parmi nous.',
          data: { email }
        });
      }

      // Cas 3: Nouvelle inscription
      const newSubscription = await newsletterModel.create(email);

      // Envoyer l'email de bienvenue
      try {
        await sendWelcomeEmail(email);
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // On continue même si l'email échoue
      }

      res.status(201).json({
        success: true,
        message: 'Inscription réussie ! Un email de confirmation vous a été envoyé.',
        data: newSubscription
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gérer les erreurs MySQL spécifiques
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà inscrit'
        });
      }

      next(error);
    }
  },

  /**
   * Se désabonner de la newsletter
   */
  async unsubscribe(req, res, next) {
    try {
      const { email } = req.body;

      const existingSubscription = await newsletterModel.findByEmail(email);

      if (!existingSubscription) {
        return res.status(404).json({
          success: false,
          message: 'Cet email n\'est pas inscrit à la newsletter'
        });
      }

      if (existingSubscription.unsubscribed_at) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà désabonné'
        });
      }

      await newsletterModel.unsubscribe(email);

      res.status(200).json({
        success: true,
        message: 'Désinscription réussie. Vous ne recevrez plus nos emails.',
        data: { email }
      });
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      next(error);
    }
  },

  /**
   * Récupérer tous les abonnés actifs (admin only)
   */
  async getAllActive(req, res, next) {
    try {
      const subscribers = await newsletterModel.findAllActive();
      const count = await newsletterModel.countActive();

      res.status(200).json({
        success: true,
        message: 'Liste des abonnés récupérée avec succès',
        data: {
          count,
          subscribers
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés:', error);
      next(error);
    }
  },

  /**
   * Compter les abonnés actifs (public)
   */
  async getCount(req, res, next) {
    try {
      const count = await newsletterModel.countActive();

      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Erreur lors du comptage:', error);
      next(error);
    }
  }
};

export default newsletterController;
