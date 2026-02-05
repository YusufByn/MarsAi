import newsletterModel from '../models/newsletter.model.js';
import { sendWelcomeEmail } from '../services/email.service.js';
import { pool } from '../db/index.js';

const newsletterController = {
  /**
   * S'inscrire à la newsletter
   */
  async subscribe(req, res, next) {
    try {
      const { email } = req.body;

      // gestion des erreurs

      // Vérifier si l'email existe déjà
      const existingSubscription = await newsletterModel.findByEmail(email);

      // Cas 1: Email déjà inscrit et actif
      if (existingSubscription && !existingSubscription.unsubscribed_at) {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed to the newsletter'
        });
      }

      // Cas 2: Email existant mais désabonné → Réabonner
      if (existingSubscription && existingSubscription.unsubscribed_at) {
        await newsletterModel.resubscribe(email);
        
        // Envoyer l'email de bienvenue
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // On continue même si l'email échoue
        }

        return res.status(200).json({
          success: true,
          message: 'Re-subscription successful! Welcome back among us.',
          data: { email }
        });
      }

      // Cas 3: Nouvelle inscription
      const newSubscription = await newsletterModel.create(email);

      // Envoyer l'email de bienvenue
      try {
        await sendWelcomeEmail(email);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // On continue même si l'email échoue
      }

      res.status(201).json({
        success: true,
        message: 'Subscription successful! A confirmation email has been sent to you.',
        data: newSubscription
      });
    } catch (error) {
      console.error('Error during subscription:', error);
      
      // Handle MySQL specific errors
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed'
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
          message: 'This email is not subscribed to the newsletter'
        });
      }

      if (existingSubscription.unsubscribed_at) {
        return res.status(400).json({
          success: false,
          message: 'This email is already unsubscribed'
        });
      }

      await newsletterModel.unsubscribe(email);

      res.status(200).json({
        success: true,
        message: 'Unsubscription successful. You will no longer receive our emails.',
        data: { email }
      });
    } catch (error) {
      console.error('Error during unsubscription:', error);
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
        message: 'List of active subscribers retrieved successfully',
        data: {
          count,
          subscribers
        }
      });
    } catch (error) {
      console.error('Error during retrieval of subscribers:', error);
      next(error);
    }
  },

  /**
   * Compter les abonnés actifs (public)
   */

  // calcule du nombre de newsletter abonnés

  async getCount(req, res, next) {
    try {
      const count = await newsletterModel.countActive();

      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Error during counting:', error);
      next(error);
    }
  },


  //Selection des différent destinataires pour l'envoi de la newsletter

  /**
   * Aperçu du nombre de destinataires par type (admin only)
   */
  async previewRecipients(req, res, next) {
    try {
      const { recipients } = req.body;

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please select at least one recipient type'
        });
      }

      const counts = await newsletterModel.countRecipientsByType(recipients);
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

      res.status(200).json({
        success: true,
        data: {
          total,
          breakdown: counts
        }
      });
    } catch (error) {
      console.error('Error during preview of recipients:', error);
      next(error);
    }
  },

  /**
   * Envoyer une campagne newsletter (admin only)
   */
  async sendCampaign(req, res, next) {
    const connection = await pool.getConnection();
    
    try {
      const { subject, message, recipients } = req.body;

      // Vérifier la limite d'envoi (2 par jour)
      const campaignsToday = await newsletterModel.countCampaignsToday();
      if (campaignsToday >= 500) {
        return res.status(429).json({
          success: false,
          message: 'Sending limit reached: maximum 2 newsletters per day'
        });
      }

      // Récupérer tous les emails uniques
      const emails = await newsletterModel.getUniqueEmailsForTypes(recipients);

      if (emails.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No recipients found for the selected types'
        });
      }

      // Commencer la transaction
      // beginTransaction pour la gestion des envois d'email en masse, le beginTransaction est une methode SQL pour envoyer que quand on a charger toutes les infos
      await connection.beginTransaction();

      // Envoyer les emails en masse
      const { sendBulkEmail } = await import('../services/email.service.js');
      const results = await sendBulkEmail(emails, subject, message);

      // Valider la transaction
      await connection.commit();

      res.status(200).json({
        success: true,
        message: `Campaign sent successfully to ${results.successful} recipients`,
        data: {
          totalSent: results.total,
          successful: results.successful,
          failed: results.failed,
          recipients: await newsletterModel.countRecipientsByType(recipients)
        }
      });
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await connection.rollback();
      console.error('Error during campaign sending:', error);
      next(error);
    } finally {
      connection.release();
    }
  }
};

export default newsletterController;
