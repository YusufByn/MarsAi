import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Configuration du transporteur Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure, // true pour port 465, false pour autres ports
    auth: {
      user: env.email.user,
      pass: env.email.password
    }
  });
};

/**
 * Génère le template HTML de l'email de bienvenue
 */
const generateWelcomeEmailHTML = (email) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur MarsAI</title>
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
            text-align: center;
            color: #ffffff;
        }
        .logo {
            font-size: 56px;
            font-weight: 900;
            margin-bottom: 8px;
            letter-spacing: -0.05em;
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
        }
        .greeting {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #ffffff;
            letter-spacing: -0.02em;
        }
        .message {
            font-size: 15px;
            line-height: 1.7;
            color: #b0b0b0;
            margin-bottom: 40px;
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
            .greeting {
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
        <!-- Background Glows -->
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>

        <!-- Main Content -->
        <div class="content">
            <div class="logo">
                <span class="logo-mars">MARS</span><span class="logo-ai">AI</span>
            </div>
            <div class="tagline">Festival International de Cinéma Génératif</div>

            <div class="greeting">Bienvenue dans le futur du cinéma 🎬</div>
            <div class="message">
                Merci d'avoir rejoint notre communauté. Vous recevrez désormais en avant-première les actualités, annonces exclusives et insights du festival MarsAI directement dans votre boîte mail.
            </div>

            <a href="${env.websiteUrl || 'http://localhost:5173'}" class="cta-button">Découvrir le Festival</a>

            <div class="divider"></div>

            <div class="message" style="font-size: 13px; margin-bottom: 10px;">
                Des questions ? Contactez-nous à <a href="mailto:contact@marsai.com" style="color: #8B5CF6; text-decoration: none;">contact@marsai.com</a>
            </div>
        </div>

        <!-- Footer -->
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
 * Envoie l'email de bienvenue à un nouvel abonné
 */
export const sendWelcomeEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MarsAI Festival" <${env.email.user}>`,
      to: email,
      subject: '🎬 Bienvenue sur MarsAI - Le Festival du Cinéma Génératif',
      html: generateWelcomeEmailHTML(email),
      text: `Bienvenue sur MarsAI !\n\nMerci d'avoir rejoint notre communauté. Vous recevrez désormais en avant-première les actualités, annonces exclusives et insights du festival MarsAI.\n\nDécouvrez le festival : ${env.websiteUrl || 'http://localhost:5173'}\n\n© 2026 MarsAI Protocol`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenue envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Impossible d\'envoyer l\'email de confirmation');
  }
};

/**
 * Génère un template HTML personnalisé pour les campagnes newsletter
 */
const generateCustomEmailHTML = (subject, message, email) => {
  // Convertir les retours à la ligne en <br>
  const formattedMessage = message.replace(/\n/g, '<br>');
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
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
        .subject {
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
            margin-bottom: 40px;
            font-weight: 300;
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
            .subject {
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
        <!-- Background Glows -->
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>

        <!-- Main Content -->
        <div class="content">
            <div class="logo">
                <span class="logo-mars">MARS</span><span class="logo-ai">AI</span>
            </div>
            <div class="tagline">Festival International de Cinéma Génératif</div>

            <div class="subject">${subject}</div>
            
            <div class="message">
                ${formattedMessage}
            </div>

            <div class="divider"></div>

            <div class="message" style="font-size: 13px; margin-bottom: 10px; text-align: center;">
                Une question ? Contactez-nous à <a href="mailto:contact@marsai.com" style="color: #8B5CF6; text-decoration: none;">contact@marsai.com</a>
            </div>
        </div>

        <!-- Footer -->
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
 * Envoie une campagne newsletter personnalisée
 */
export const sendCustomEmail = async (email, subject, message) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MarsAI Festival" <${env.email.user}>`,
      to: email,
      subject: subject,
      html: generateCustomEmailHTML(subject, message, email),
      text: `${subject}\n\n${message}\n\n© 2026 MarsAI Protocol`
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie une campagne en masse à plusieurs destinataires
 */
export const sendBulkEmail = async (emails, subject, message) => {
  const results = {
    total: emails.length,
    successful: 0,
    failed: 0,
    errors: []
  };

  for (const email of emails) {
    try {
      const result = await sendCustomEmail(email, subject, message);
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({ email, error: result.error });
      }
    } catch (error) {
      results.failed++;
      results.errors.push({ email, error: error.message });
    }
  }

  return results;
};

export default {
  sendWelcomeEmail,
  sendCustomEmail,
  sendBulkEmail
};
