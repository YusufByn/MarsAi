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
    secure: env.email.secure,
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
  const websiteUrl = env.websiteUrl || 'http://localhost:5173';
  const unsubscribeUrl = `${websiteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #050505;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            background: #050505;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #0d0d0d;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 16px;
            overflow: hidden;
            position: relative;
        }
        /* Header */
        .header {
            background: linear-gradient(160deg, #130a28 0%, #0d1520 60%, #0a0a0a 100%);
            padding: 48px 48px 40px 48px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -120px;
            right: -120px;
            width: 320px;
            height: 320px;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent 70%);
            border-radius: 50%;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -80px;
            left: -80px;
            width: 240px;
            height: 240px;
            background: radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent 70%);
            border-radius: 50%;
        }
        .logo {
            position: relative;
            z-index: 1;
            font-size: 48px;
            font-weight: 900;
            letter-spacing: -0.04em;
            line-height: 1;
            margin-bottom: 10px;
        }
        .logo-mars { color: #ffffff; }
        .logo-ai {
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .tagline {
            position: relative;
            z-index: 1;
            font-size: 10px;
            color: #555555;
            font-weight: 600;
            letter-spacing: 0.35em;
            text-transform: uppercase;
        }
        /* Body */
        .body {
            padding: 48px 48px 40px 48px;
            color: #ffffff;
        }
        .heading {
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.02em;
            line-height: 1.3;
            margin-bottom: 20px;
        }
        .subheading {
            font-size: 13px;
            font-weight: 600;
            color: #8B5CF6;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .message {
            font-size: 15px;
            line-height: 1.85;
            color: #a0a0a0;
            margin-bottom: 28px;
            font-weight: 300;
        }
        /* Info Card */
        .info-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 28px;
        }
        .info-card-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .info-card-row:last-child { border-bottom: none; }
        .info-card-label {
            font-size: 11px;
            font-weight: 600;
            color: #555555;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            min-width: 90px;
            padding-top: 2px;
        }
        .info-card-value {
            font-size: 14px;
            color: #d0d0d0;
            font-weight: 400;
            flex: 1;
        }
        /* Message Box */
        .message-box {
            background: rgba(139, 92, 246, 0.06);
            border-left: 3px solid #8B5CF6;
            border-radius: 0 10px 10px 0;
            padding: 20px 24px;
            margin-bottom: 28px;
        }
        .message-box-text {
            font-size: 15px;
            line-height: 1.85;
            color: #c0c0c0;
            font-weight: 300;
            font-style: italic;
        }
        /* CTA */
        .cta-wrapper {
            text-align: center;
            margin: 32px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            color: #ffffff;
            padding: 15px 44px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 12px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.35);
        }
        .cta-fallback {
            font-size: 12px;
            color: #555555;
            text-align: center;
            margin-top: 12px;
            word-break: break-all;
        }
        .cta-fallback a { color: #8B5CF6; text-decoration: none; }
        /* Status Badge */
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .badge-success {
            background: rgba(34, 197, 94, 0.12);
            color: #4ade80;
            border: 1px solid rgba(34, 197, 94, 0.25);
        }
        /* Divider */
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
            margin: 36px 0;
        }
        /* Footer */
        .footer {
            background: #0a0a0a;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding: 32px 48px;
            text-align: center;
        }
        .footer-contact {
            font-size: 12px;
            color: #555555;
            margin-bottom: 20px;
        }
        .footer-contact a { color: #8B5CF6; text-decoration: none; }
        .social-links {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        .social-links a {
            color: #444444;
            text-decoration: none;
            margin: 0 12px;
        }
        .footer-legal {
            font-size: 11px;
            color: #3a3a3a;
        }
        .footer-legal a { color: #555555; text-decoration: none; }
        @media (max-width: 600px) {
            .wrapper { padding: 0; }
            .container { border-radius: 0; border: none; }
            .header { padding: 36px 28px 32px 28px; }
            .body { padding: 36px 28px 32px 28px; }
            .footer { padding: 28px; }
            .logo { font-size: 38px; }
            .heading { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <div class="header">
                <div class="logo">
                    <span class="logo-mars">MARS</span><span class="logo-ai">AI</span>
                </div>
                <div class="tagline">Festival International de Cinéma Génératif</div>
            </div>

            <div class="body">
                ${content}
            </div>

            <div class="footer">
                <div class="footer-contact">
                    Une question ? <a href="mailto:contact@marsai.com">contact@marsai.com</a>
                </div>
                <div class="social-links">
                    <a href="#">Twitter</a> &bull;
                    <a href="#">LinkedIn</a> &bull;
                    <a href="#">Instagram</a>
                </div>
                <div class="footer-legal">
                    &copy; 2026 MarsAI Protocol &mdash;
                    <a href="${unsubscribeUrl}">Se désabonner</a>
                </div>
            </div>

        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Template email de bienvenue newsletter
 * @param {string} email
 */
const generateWelcomeEmailContent = (email) => {
  const websiteUrl = env.websiteUrl || 'http://localhost:5173';
  const content = `
    <div class="subheading">Bienvenue</div>
    <div class="heading">Vous faites désormais partie de l'aventure MarsAI.</div>
    <div class="message">
        Merci d'avoir rejoint notre communauté. Vous serez parmi les premiers à recevoir les actualités,
        les annonces exclusives et les temps forts du festival directement dans votre boîte mail.
    </div>
    <div class="info-card">
        <div class="info-card-row">
            <span class="info-card-label">Email</span>
            <span class="info-card-value">${email}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Statut</span>
            <span class="info-card-value"><span class="badge badge-success">Abonné actif</span></span>
        </div>
    </div>
    <div class="cta-wrapper">
        <a href="${websiteUrl}" class="cta-button">Découvrir le festival</a>
    </div>
  `;
  return generateBaseTemplate('Bienvenue sur MarsAI', content, email);
};

/**
 * Template campagne newsletter personnalisée
 * @param {string} subject
 * @param {string} message
 * @param {string} email
 */
const generateCustomEmailContent = (subject, message, email) => {
  const formattedMessage = message.replace(/\n/g, '<br>');
  const content = `
    <div class="heading">${subject}</div>
    <div class="divider"></div>
    <div class="message">${formattedMessage}</div>
  `;
  return generateBaseTemplate(subject, content, email);
};

/**
 * Template email de demande de modification de vidéo
 * @param {Object} videoData
 * @param {string} editToken
 * @param {string} realisatorEmail
 */
const generateEditRequestEmailContent = (videoData, editToken, realisatorEmail) => {
  const editUrl = `${env.websiteUrl}/video/edit/${videoData.id}?token=${editToken}`;
  const content = `
    <div class="subheading">Action requise</div>
    <div class="heading">Des modifications sont nécessaires sur votre soumission.</div>
    <div class="message">
        Bonjour ${videoData.realisator_name || 'cher réalisateur'},<br><br>
        Notre équipe a examiné votre soumission et vous demande d'apporter quelques ajustements
        avant validation. Le lien ci-dessous est valide pendant <strong style="color: #ffffff;">24 heures</strong>.
    </div>
    <div class="info-card">
        <div class="info-card-row">
            <span class="info-card-label">Film</span>
            <span class="info-card-value">${videoData.title}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Réalisateur</span>
            <span class="info-card-value">${videoData.realisator_name || ''} ${videoData.realisator_lastname || ''}</span>
        </div>
    </div>
    <div class="cta-wrapper">
        <a href="${editUrl}" class="cta-button">Modifier ma soumission</a>
    </div>
    <p class="cta-fallback">
        Si le bouton ne fonctionne pas :<br>
        <a href="${editUrl}">${editUrl}</a>
    </p>
  `;
  return generateBaseTemplate('Modification de votre soumission - MarsAI', content, realisatorEmail);
};

/**
 * Template email de confirmation de soumission de vidéo
 * @param {Object} videoData - { title, realisator_name, realisator_lastname, email }
 */
const generateVideoSubmissionEmailContent = (videoData) => {
  const websiteUrl = env.websiteUrl || 'http://localhost:5173';
  const submittedAt = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const content = `
    <div class="subheading">Soumission reçue</div>
    <div class="heading">Votre film a bien été enregistré.</div>
    <div class="message">
        Bonjour ${videoData.realisator_name || 'cher réalisateur'},<br><br>
        Votre soumission a été prise en compte. Notre équipe va l'examiner dans les prochains jours
        et vous recontactera si nécessaire.
    </div>
    <div class="info-card">
        <div class="info-card-row">
            <span class="info-card-label">Film</span>
            <span class="info-card-value">${videoData.title || 'Sans titre'}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Réalisateur</span>
            <span class="info-card-value">${[videoData.realisator_name, videoData.realisator_lastname].filter(Boolean).join(' ') || 'Non renseigné'}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Soumis le</span>
            <span class="info-card-value">${submittedAt}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Statut</span>
            <span class="info-card-value"><span class="badge badge-success">En cours d'examen</span></span>
        </div>
    </div>
    <div class="cta-wrapper">
        <a href="${websiteUrl}" class="cta-button">Retour au festival</a>
    </div>
  `;
  return generateBaseTemplate('Confirmation de soumission - MarsAI', content, videoData.email);
};

/**
 * Template email d'un sélectionneur vers un réalisateur (depuis le player)
 * @param {string} videoTitle - Titre de la vidéo concernée
 * @param {string} message - Message du sélectionneur
 * @param {string} realisatorEmail - Email du réalisateur
 */
const generateSelectorEmailContent = (videoTitle, message, realisatorEmail) => {
  const formattedMessage = message.replace(/\n/g, '<br>');
  const content = `
    <div class="subheading">Message d'un sélectionneur</div>
    <div class="heading">Un membre de l'équipe MarsAI vous a contacté.</div>
    <div class="message">
        Un sélectionneur du festival a consulté votre film et souhaite vous transmettre un message.
    </div>
    <div class="info-card">
        <div class="info-card-row">
            <span class="info-card-label">Film</span>
            <span class="info-card-value">${videoTitle}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Expéditeur</span>
            <span class="info-card-value">Sélectionneur MarsAI</span>
        </div>
    </div>
    <div class="message-box">
        <div class="message-box-text">${formattedMessage}</div>
    </div>
    <div class="message" style="font-size: 13px; color: #555555;">
        Pour répondre à ce message, contactez-nous directement à
        <a href="mailto:contact@marsai.com" style="color: #8B5CF6; text-decoration: none;">contact@marsai.com</a>.
    </div>
  `;
  return generateBaseTemplate(`Message MarsAI - ${videoTitle}`, content, realisatorEmail);
};

// ========================================
// FONCTIONS D'ENVOI
// ========================================

/**
 * Fonction générique d'envoi d'email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MarsAI Festival" <${env.email.user}>`,
      to,
      subject,
      html,
      text: text || subject
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
 * Envoie l'email de bienvenue à un nouvel abonné newsletter
 * @param {string} email
 */
export const sendWelcomeEmail = async (email) => {
  const html = generateWelcomeEmailContent(email);
  const text = `Bienvenue sur MarsAI !\n\nMerci d'avoir rejoint notre communauté. Vous serez parmi les premiers à recevoir les actualités du festival.\n\nDécouvrir le festival : ${env.websiteUrl || 'http://localhost:5173'}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: email,
    subject: 'Bienvenue sur MarsAI - Festival de Cinéma Génératif',
    html,
    text
  });
};

/**
 * Envoie un email personnalisé (newsletter, campagnes)
 * @param {string} email
 * @param {string} subject
 * @param {string} message
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
 * @param {Array<string>} emails
 * @param {string} subject
 * @param {string} message
 */
export const sendBulkEmail = async (emails, subject, message) => {
  const results = {
    total: emails.length,
    successful: 0,
    failed: 0,
    errors: []
  };

  console.log(`[EMAIL BULK] Debut envoi en masse : ${emails.length} destinataires`);

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
 * @param {Object} videoData
 * @param {string} editToken
 */
export const sendVideoEditRequestEmail = async (videoData, editToken) => {
  if (!videoData.email) {
    throw new Error('Email du réalisateur manquant dans les données vidéo');
  }

  const html = generateEditRequestEmailContent(videoData, editToken, videoData.email);
  const editUrl = `${env.websiteUrl}/video/edit/${videoData.id}?token=${editToken}`;
  const text = `Modification requise pour votre film\n\nBonjour ${videoData.realisator_name || 'cher réalisateur'},\n\nNotre équipe a examiné votre soumission "${videoData.title}" et vous demande d'apporter quelques modifications.\n\nLien (valide 24h) : ${editUrl}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: videoData.email,
    subject: `Modification requise - ${videoData.title} | MarsAI`,
    html,
    text
  });
};

/**
 * Envoie un email de confirmation de soumission de vidéo au réalisateur
 * @param {Object} videoData - { title, realisator_name, realisator_lastname, email }
 */
export const sendVideoSubmissionConfirmationEmail = async (videoData) => {
  if (!videoData.email) {
    console.log('[EMAIL] Pas d\'email réalisateur, confirmation non envoyée pour :', videoData.title);
    return { success: false, error: 'Email réalisateur manquant' };
  }

  const html = generateVideoSubmissionEmailContent(videoData);
  const text = `Votre film a bien été soumis\n\nBonjour ${videoData.realisator_name || 'cher réalisateur'},\n\nVotre soumission "${videoData.title}" a été enregistrée. Notre équipe va l'examiner prochainement.\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: videoData.email,
    subject: `Soumission confirmée - ${videoData.title} | MarsAI`,
    html,
    text
  });
};

/**
 * Template email d'invitation jury
 * @param {string} email
 * @param {string} inviteLink
 */
const generateInvitationEmailContent = (email, inviteLink) => {
  const content = `
    <div class="subheading">Invitation</div>
    <div class="heading">Vous avez été invité à rejoindre MarsAI Festival.</div>
    <div class="message">
        Bonjour,<br><br>
        L'équipe MarsAI vous invite à créer votre compte jury. Ce lien est valable
        <strong style="color: #ffffff;">24 heures</strong> et ne peut être utilisé qu'une seule fois.
    </div>
    <div class="info-card">
        <div class="info-card-row">
            <span class="info-card-label">Email</span>
            <span class="info-card-value">${email}</span>
        </div>
        <div class="info-card-row">
            <span class="info-card-label">Validité</span>
            <span class="info-card-value">24 heures</span>
        </div>
    </div>
    <div class="cta-wrapper">
        <a href="${inviteLink}" class="cta-button">Créer mon compte</a>
    </div>
    <p class="cta-fallback">
        Si le bouton ne fonctionne pas :<br>
        <a href="${inviteLink}">${inviteLink}</a>
    </p>
  `;
  return generateBaseTemplate('Votre invitation MarsAI', content, email);
};

/**
 * Envoie un email d'invitation à un futur membre jury
 * @param {string} email
 * @param {string} token
 */
export const sendInvitationEmail = async (email, token) => {
  const link = `${env.websiteUrl}/register?token=${token}`;
  const html = generateInvitationEmailContent(email, link);
  const text = `Invitation MarsAI Festival\n\nVous avez été invité à créer votre compte jury.\nLien (valide 24h) : ${link}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: email,
    subject: 'Votre invitation MarsAI Festival',
    html,
    text
  });
};

/**
 * Envoie un email d'un sélectionneur au réalisateur (depuis le player)
 * @param {Object} videoData - { title, email }
 * @param {string} message - Message du sélectionneur
 */
export const sendSelectorEmailToCreator = async (videoData, message) => {
  if (!videoData.email) {
    throw new Error('Email du réalisateur manquant');
  }

  const html = generateSelectorEmailContent(videoData.title, message, videoData.email);
  const text = `Message d'un sélectionneur MarsAI\n\nConcernant votre film : ${videoData.title}\n\n${message}\n\n© 2026 MarsAI Protocol`;

  return sendEmail({
    to: videoData.email,
    subject: `Message MarsAI - ${videoData.title}`,
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
  sendVideoEditRequestEmail,
  sendVideoSubmissionConfirmationEmail,
  sendSelectorEmailToCreator,
  sendInvitationEmail
};
