const { google } = require('googleapis');

// Configuration de l'authentification Google Calendar
const getCalendarClient = () => {
  // Vérifier si les credentials sont configurés
  if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
    console.warn('⚠️  Google Calendar non configuré - synchronisation désactivée');
    return null;
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('❌ Erreur lors de la configuration Google Calendar:', error.message);
    return null;
  }
};

// Créer un événement dans Google Calendar
const createCalendarEvent = async (appointment) => {
  const calendar = getCalendarClient();
  if (!calendar) return null;

  try {
    const appointmentDate = new Date(appointment.dateTime);
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000); // +1 heure

    const serviceNames = {
      'toilettage-complet': 'Toilettage complet',
      'bain-sechage': 'Bain + Séchage',
      'coupe': 'Coupe uniquement',
      'demêlage': 'Démêlage'
    };

    const event = {
      summary: `🐕 ${appointment.nom} - ${appointment.chien}`,
      description: `
Service : ${serviceNames[appointment.service] || appointment.service}
Client : ${appointment.nom}
Téléphone : ${appointment.telephone}
Email : ${appointment.email}
${appointment.notes ? `Notes : ${appointment.notes}` : ''}

ID rendez-vous : ${appointment.id}
      `.trim(),
      start: {
        dateTime: appointmentDate.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Paris',
      },
      attendees: [
        { email: appointment.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24h avant
          { method: 'popup', minutes: 60 }        // 1h avant
        ],
      },
      colorId: '10', // Vert pour toilettage
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const response = await calendar.events.insert({
      calendarId,
      resource: event,
      sendUpdates: 'all', // Envoyer les invitations par email
    });

    console.log(`📅 Événement Google Calendar créé: ${response.data.id}`);
    return response.data.id; // Retourner l'ID de l'événement Google

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'événement Google Calendar:', error.message);
    return null;
  }
};

// Supprimer un événement de Google Calendar
const deleteCalendarEvent = async (googleEventId) => {
  const calendar = getCalendarClient();
  if (!calendar || !googleEventId) return false;

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    await calendar.events.delete({
      calendarId,
      eventId: googleEventId,
      sendUpdates: 'all', // Notifier les participants
    });

    console.log(`🗑️  Événement Google Calendar supprimé: ${googleEventId}`);
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'événement Google Calendar:', error.message);
    return false;
  }
};

// Mettre à jour un événement dans Google Calendar
const updateCalendarEvent = async (googleEventId, appointment) => {
  const calendar = getCalendarClient();
  if (!calendar || !googleEventId) return false;

  try {
    const appointmentDate = new Date(appointment.dateTime);
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000);

    const serviceNames = {
      'toilettage-complet': 'Toilettage complet',
      'bain-sechage': 'Bain + Séchage',
      'coupe': 'Coupe uniquement',
      'demêlage': 'Démêlage'
    };

    const event = {
      summary: `🐕 ${appointment.nom} - ${appointment.chien}`,
      description: `
Service : ${serviceNames[appointment.service] || appointment.service}
Client : ${appointment.nom}
Téléphone : ${appointment.telephone}
Email : ${appointment.email}
${appointment.notes ? `Notes : ${appointment.notes}` : ''}

ID rendez-vous : ${appointment.id}
      `.trim(),
      start: {
        dateTime: appointmentDate.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Paris',
      },
      attendees: [
        { email: appointment.email }
      ],
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    await calendar.events.update({
      calendarId,
      eventId: googleEventId,
      resource: event,
      sendUpdates: 'all',
    });

    console.log(`📝 Événement Google Calendar mis à jour: ${googleEventId}`);
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'événement Google Calendar:', error.message);
    return false;
  }
};

module.exports = {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent
};
