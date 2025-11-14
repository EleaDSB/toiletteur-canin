const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createCalendarEvent, deleteCalendarEvent } = require('./googleCalendar');
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

// ==================== AUTHENTIFICATION ADMIN ====================

// Middleware pour vérifier le JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification manquant'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    req.user = user;
    next();
  });
};

// Route de connexion admin
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Mot de passe requis'
    });
  }

  try {
    // Vérifier le mot de passe avec bcrypt
    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // Générer un JWT token (expire dans 8 heures)
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log('✅ Admin connecté');

    res.json({
      success: true,
      message: 'Authentification réussie',
      token
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
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

// ==================== GESTION DES RENDEZ-VOUS ====================

const APPOINTMENTS_FILE = path.join(__dirname, 'appointments.json');

// Fonction pour lire les rendez-vous
const readAppointments = async () => {
  try {
    const data = await fs.readFile(APPOINTMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, créer un tableau vide
    await fs.writeFile(APPOINTMENTS_FILE, '[]');
    return [];
  }
};

// Fonction pour sauvegarder les rendez-vous
const saveAppointments = async (appointments) => {
  await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));
};

// GET - Récupérer tous les rendez-vous (PROTÉGÉ)
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await readAppointments();
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('❌ Erreur lors de la lecture des rendez-vous:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET - Vérifier les disponibilités pour une date
app.get('/api/appointments/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const appointments = await readAppointments();

    // Filtrer les rendez-vous pour la date demandée
    const dateAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime).toISOString().split('T')[0];
      return aptDate === date;
    });

    // Extraire les heures occupées
    const occupiedSlots = dateAppointments.map(apt => apt.dateTime);

    res.json({ success: true, occupiedSlots });
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des disponibilités:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST - Créer un nouveau rendez-vous
app.post('/api/appointments', async (req, res) => {
  const { nom, email, telephone, chien, service, notes, dateTime } = req.body;

  // Validation des données
  if (!nom || !email || !telephone || !chien || !service || !dateTime) {
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

  try {
    const appointments = await readAppointments();

    // Vérifier si le créneau est déjà pris
    const isSlotTaken = appointments.some(apt => apt.dateTime === dateTime);
    if (isSlotTaken) {
      return res.status(409).json({
        success: false,
        message: 'Ce créneau est déjà réservé'
      });
    }

    // Créer le rendez-vous
    const newAppointment = {
      id: uuidv4(),
      nom,
      email,
      telephone,
      chien,
      service,
      notes: notes || '',
      dateTime,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      googleEventId: null // Sera rempli après création dans Google Calendar
    };

    // Créer l'événement dans Google Calendar
    const googleEventId = await createCalendarEvent(newAppointment);
    if (googleEventId) {
      newAppointment.googleEventId = googleEventId;
    }

    appointments.push(newAppointment);
    await saveAppointments(appointments);

    // Préparer les détails du rendez-vous pour l'email
    const appointmentDate = new Date(dateTime);
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Mapper les noms de services
    const serviceNames = {
      'toilettage-complet': 'Toilettage complet',
      'bain-sechage': 'Bain + Séchage',
      'coupe': 'Coupe uniquement',
      'demêlage': 'Démêlage'
    };

    // Email de confirmation au client
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✅ Confirmation de votre rendez-vous - Toutouchic`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #9333ea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🐕 Toutouchic</h1>
            <p style="color: white; margin: 10px 0 0 0;">Toilettage canin professionnel</p>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #10b981; margin-top: 0;">Rendez-vous confirmé !</h2>

            <p style="color: #4b5563; font-size: 16px;">
              Bonjour ${nom},
            </p>

            <p style="color: #4b5563; font-size: 16px;">
              Votre rendez-vous a été confirmé avec succès. Voici les détails :
            </p>

            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <p style="margin: 10px 0;"><strong style="color: #374151;">📅 Date:</strong> ${formattedDate}</p>
              <p style="margin: 10px 0;"><strong style="color: #374151;">🕐 Heure:</strong> ${formattedTime}</p>
              <p style="margin: 10px 0;"><strong style="color: #374151;">🐶 Chien:</strong> ${chien}</p>
              <p style="margin: 10px 0;"><strong style="color: #374151;">✂️ Service:</strong> ${serviceNames[service] || service}</p>
              ${notes ? `<p style="margin: 10px 0;"><strong style="color: #374151;">📝 Notes:</strong> ${notes}</p>` : ''}
            </div>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">⚠️ Informations importantes</h3>
              <ul style="color: #78350f; margin: 10px 0; padding-left: 20px; font-size: 14px;">
                <li>Merci d'arriver 5 minutes avant l'heure du rendez-vous</li>
                <li>Pensez à apporter le carnet de vaccination</li>
                <li>En cas d'empêchement, prévenez-nous 24h à l'avance</li>
              </ul>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #374151; margin-top: 0; font-size: 16px;">📍 Nos coordonnées</h3>
              <p style="margin: 5px 0; color: #4b5563;">📍 123 Rue des Animaux, 75001 Paris</p>
              <p style="margin: 5px 0; color: #4b5563;">📞 01 23 45 67 89</p>
              <p style="margin: 5px 0; color: #4b5563;">✉️ contact@toutouchic.fr</p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              À très bientôt ! 🐾
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Cet email a été envoyé automatiquement depuis Toutouchic
            </p>
          </div>
        </div>
      `
    };

    // Email de notification au propriétaire
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `📅 Nouveau rendez-vous - ${nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            Nouveau rendez-vous
          </h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Détails du client</h3>
            <p style="margin: 10px 0;"><strong>Nom:</strong> ${nom}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Téléphone:</strong> ${telephone}</p>
            <p style="margin: 10px 0;"><strong>Chien:</strong> ${chien}</p>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #374151; margin-top: 0;">Rendez-vous</h3>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 10px 0;"><strong>Heure:</strong> ${formattedTime}</p>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${serviceNames[service] || service}</p>
            ${notes ? `<p style="margin: 10px 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>

          <p style="color: #6b7280; font-size: 12px;">
            ID du rendez-vous: ${newAppointment.id}
          </p>
        </div>
      `
    };

    // Envoyer les emails
    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(ownerMailOptions)
    ]);

    console.log(`📅 Nouveau rendez-vous créé: ${nom} - ${formattedDate} ${formattedTime}`);

    res.status(201).json({
      success: true,
      message: 'Rendez-vous créé avec succès!',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du rendez-vous'
    });
  }
});

// DELETE - Annuler un rendez-vous (PROTÉGÉ)
app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await readAppointments();

    const appointmentIndex = appointments.findIndex(apt => apt.id === id);

    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé'
      });
    }

    const [deletedAppointment] = appointments.splice(appointmentIndex, 1);

    // Supprimer l'événement de Google Calendar si existant
    if (deletedAppointment.googleEventId) {
      await deleteCalendarEvent(deletedAppointment.googleEventId);
    }

    await saveAppointments(appointments);

    console.log(`🗑️ Rendez-vous annulé: ${deletedAppointment.nom}`);

    res.json({
      success: true,
      message: 'Rendez-vous annulé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'annulation du rendez-vous:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation'
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
