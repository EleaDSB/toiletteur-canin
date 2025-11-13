const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Vérification de la configuration email au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de configuration email:', error);
  } else {
    console.log('✅ Serveur email prêt à envoyer des messages');
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur backend Toutouchic actif!' });
});

// Route pour envoyer un message de contact
app.post('/api/contact', async (req, res) => {
  const { nom, email, telephone, chien, message } = req.body;

  // Validation des données
  if (!nom || !email || !telephone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis'
    });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format d\'email invalide'
    });
  }

  // Configuration de l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: email,
    subject: `🐕 Nouveau message de ${nom} - Toutouchic`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
          Nouveau message de contact
        </h2>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Nom:</strong> ${nom}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Téléphone:</strong> ${telephone}</p>
          ${chien ? `<p style="margin: 10px 0;"><strong>Chien:</strong> ${chien}</p>` : ''}
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Message:</h3>
          <p style="color: #4b5563; line-height: 1.6;">${message}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          Ce message a été envoyé depuis le formulaire de contact de Toutouchic
        </p>
      </div>
    `
  };

  // Envoi de l'email
  try {
    await transporter.sendMail(mailOptions);

    console.log(`✉️ Message envoyé de ${nom} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès!'
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    });
  }
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
