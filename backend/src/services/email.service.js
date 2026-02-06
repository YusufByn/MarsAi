import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Service d'envoi d'emails générique pour MarsAI
 * Utilise Nodemailer avec templates HTML cohérents
 */

// ========================================
// CONFIGURATION TRANSPORTEUR
// ========================================

/**
 * Crée et configure le transporteur Nodemailer
 * @returns {Object} Transporteur Nodemailer configuré
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure, // true pour port 465, false pour 587
    auth: {
      user: env.email.user,
      pass: env.email.password
    }
  });
};

// ========================================
// TEMPLATES HTML
// ========================================

/**
 * Template de base MarsAI avec design cohérent
 * @param {string} title - Titre de l'email
 * @param {string} content - Contenu HTML personnalisé
 * @param {string} email - Email du destinataire (pour lien désabonnement)
 * @returns {string} HTML complet
 */
const generateBaseTemplate = (title, content, email) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #000000;
            line-height: 1.5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f1419 100%);
            position: relative;
            overflow: hidden;
        }
        .glow {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.3;
        }
        .glow-1 {
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, #8B5CF6, #D946EF);
            top: -150px;
            right: -150px;
        }
        .glow-2 {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, #D946EF, #EC4899);
            bottom: -100px;
            left: -100px;
        }
        .content {
            position: relative;
            z-index: 1;
            padding: 60px 40px;
            color: #ffffff;
        }
        .logo {
            font-size: 56px;
            font-weight: 900;
            margin-bottom: 8px;
            letter-spacing: -0.05em;
            text-align: center;
        }
        .logo-mars {
            color: #ffffff;
        }
        .logo-ai {
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .tagline {
            font-size: 11px;
            color: #666666;
            margin-bottom: 50px;
            font-weight: 600;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            text-align: center;
        }
        .heading {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 30px;
            color: #ffffff;
            letter-spacing: -0.02em;
            text-align: center;
        }
        .message {
            font-size: 15px;
            line-height: 1.8;
            color: #b0b0b0;
            margin-bottom: 30px;
            font-weight: 300;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            color: #ffffff;
            padding: 16px 48px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 13px;
            margin: 20px 0;
            transition: all 0.3s ease;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            margin: 50px 0 30px 0;
        }
        .footer {
            padding: 40px 40px 50px 40px;
            text-align: center;
            font-size: 11px;
            color: #555555;
            border-top: 1px solid rgba(255,255,255,0.05);
            position: relative;
            z-index: 1;
        }
        .footer a {
            color: #8B5CF6;
            text-decoration: none;
            transition: color 0.3s;
        }
        .footer a:hover {
            color: #EC4899;
        }
        .social-links {
            margin: 20px 0;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
        .social-links a {
            margin: 0 16px;
        }
        @media (max-width: 600px) {
            .content {
                padding: 40px 25px;
            }
            .logo {
                font-size: 42px;
            }
            .heading {
                font-size: 22px;
            }
            .glow-1, .glow-2 {
                filter: blur(80px);
                opacity: 0.2;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>

        <div class="content">
            <div class="logo">
                <span class="logo-mars">MARS</span><span class="logo-ai">AI</span>
            </div>
            <div class="tagline">Festival International de Cinéma Génératif</div>

            ${content}

            <div class="divider"></div>

            <div class="message" style="font-size: 13px; margin-bottom: 10px; text-align: center;">
                Une question ? Contactez-nous à <a href="mailto:contact@marsai.com" style="color: #8B5CF6; text-decoration: none;">contact@marsai.com</a>
            </div>
        </div>

        <div class="footer">
            <div class="social-links">
                <a href="#">Twitter</a> •
                <a href="#">LinkedIn</a> •
                <a href="#">Instagram</a>
            </div>
            <p style="margin-top: 20px; color: #444444;">© 2026 MarsAI Protocol. <a href="${env.websiteUrl || 'http://localhost:5173'}/unsubscribe?email=${encodeURIComponent(email)}">Se désabonner</a></p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Template pour l'email de bienvenue à la newsletter
 * @param {string} email - Email du destinataire
 * @returns {string} HTML complet
 */
const generateWelcomeEmailContent = (email) => {
  const content = `
    <div class="heading">Bienvenue dans le futur du cinéma 🎬</div>
    <div class="message">
        Merci d'avoir rejoint notre communauté. Vous recevrez désormais en avant-première les actualités, annonces exclusives et insights du festival MarsAI directement dans votre boîte mail.
    </div>
    <div style="text-align: center;">
        <a href="${env.websiteUrl || 'http://localhost:5173'}" class="cta-button">Découvrir le Festival</a>
    </div>
  `;
  return generateBaseTemplate('Bienvenue sur MarsAI', content, email);
};

/**
 * Template pour une campagne newsletter personnalisée
 * @param {string} subject - Sujet de l'email
 * @param {string} message - Message (converti en HTML)
 * @param {string} email - Email du destinataire
 * @returns {string} HTML complet
 */
const generateCustomEmailContent = (subject, message, email) => {
  const formattedMessage = message.replace(/\n/g, '<br>');
  const content = `
    <div class="heading">${subject}</div>
    <div class="message">
        ${formattedMessage}
    </div>
  `;
  return generateBaseTemplate(subject, content, email);
};

/**
 * Template pour l'email de demande de modification de vidéo
 * @param {Object} videoData - Données de la vidéo
 * @param {string} editToken - Token JWT pour éditer
 * @param {string} realisatorEmail - Email du réalisateur
 * @returns {string} HTML complet
 */
const generateEditRequestEmailContent = (videoData, editToken, realisatorEmail) => {
  const editUrl = `${env.websiteUrl}/video/edit/${videoData.id}?token=${editToken}`;

  const content = `
    <div class="heading">Modification requise pour votre film 🎬</div>
    <div class="message">
        Bonjour ${videoData.realisator_name || 'cher réalisateur'},
        <br><br>
        Notre équipe a examiné votre soumission <strong>"${videoData.title}"</strong> et nous avons besoin que vous apportiez quelques modifications.
        <br><br>
        Veuillez cliquer sur le bouton ci-dessous pour accéder au formulaire de modification. Ce lien est valide pendant <strong>24 heures</strong>.
    </div>
    <div style="text-align: center;">
        <a href="${editUrl}" class="cta-button">Modifier ma soumission</a>
    </div>
    <div class="message" style="font-size: 13px; margin-top: 30px; color: #888888; text-align: center;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
        <a href="${editUrl}" style="color: #8B5CF6; word-break: break-all;">${editUrl}</a>
    </div>
  `;

  return generateBaseTemplate('Modification de votre soumission - MarsAI', content, realisatorEmail);
};

// ========================================
// FONCTIONS D'ENVOI
// ========================================

/**
 * Fonction générique d'envoi d'email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Email destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.html - Contenu HTML
 * @param {string} options.text - Version texte (optionnel)
 * @returns {Promise<Object>} Résultat de l'envoi
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MarsAI Festival" <${env.email.user}>`,
      to,
      subject,
      html,
      text: text || subject // Fallback texte si non fourni
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Email envoyé à ${to} - Message ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      recipient: to
    };
  } catch (error) {
    console.error(`[EMAIL ERROR] Erreur envoi email à ${to}:`, error.message);
    return {
      success: false,
      error: error.message,
      recipient: to
    };
  }
};

/**
 * Envoie l'email de bienvenue à un nouvel abonné
 * @param {string} email - Email du destinataire
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export const sendWelcomeEmail = async (email) => {
  const html = generateWelcomeEmailContent(email);
  const text = `Bienvenue sur MarsAI !\n\nMerci d'avoir rejoint notre communauté. Vous recevrez désormais en avant-première les actualités, annonces exclusives et insights du festival MarsAI.\n\nDécouvrir le festival : ${env.websiteUrl || 'http://localhost:5173'}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: email,
    subject: 'Bienvenue sur MarsAI - Festival de Cinéma Génératif',
    html,
    text
  });
};

/**
 * Envoie un email personnalisé (newsletter, annonces)
 * @param {string} email - Email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} message - Message (texte avec \n)
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export const sendCustomEmail = async (email, subject, message) => {
  const html = generateCustomEmailContent(subject, message, email);
  const text = `${subject}\n\n${message}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: email,
    subject,
    html,
    text
  });
};

/**
 * Envoie une campagne en masse à plusieurs destinataires
 * @param {Array<string>} emails - Liste d'emails
 * @param {string} subject - Sujet
 * @param {string} message - Message
 * @returns {Promise<Object>} Statistiques d'envoi
 */
export const sendBulkEmail = async (emails, subject, message) => {
  const results = {
    total: emails.length,
    successful: 0,
    failed: 0,
    errors: []
  };

  console.log(`[EMAIL BULK] Début envoi en masse : ${emails.length} destinataires`);

  for (const email of emails) {
    const result = await sendCustomEmail(email, subject, message);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({ email, error: result.error });
    }
  }

  console.log(`[EMAIL BULK] Envoi terminé : ${results.successful} succès / ${results.failed} échecs`);
  return results;
};

/**
 * Envoie un email de demande de modification de vidéo au réalisateur
 * @param {Object} videoData - Données de la vidéo
 * @param {string} editToken - Token JWT pour éditer (valide 24h)
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export const sendVideoEditRequestEmail = async (videoData, editToken) => {
  if (!videoData.email) {
    throw new Error('Email du réalisateur manquant dans les données vidéo');
  }

  const html = generateEditRequestEmailContent(videoData, editToken, videoData.email);
  const editUrl = `${env.websiteUrl}/video/edit/${videoData.id}?token=${editToken}`;
  const text = `Modification requise pour votre film\n\nBonjour ${videoData.realisator_name || 'cher réalisateur'},\n\nNotre équipe a examiné votre soumission "${videoData.title}" et nous avons besoin que vous apportiez quelques modifications.\n\nLien de modification (valide 24h) :\n${editUrl}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: videoData.email,
    subject: `Modification requise - ${videoData.title} | MarsAI`,
    html,
    text
  });
};

// ========================================
// EXPORTS
// ========================================

export default {
  sendEmail,
  sendWelcomeEmail,
  sendCustomEmail,
  sendBulkEmail,
  sendVideoEditRequestEmail
};
