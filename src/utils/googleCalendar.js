// Configuration Google Calendar API
// Pour configurer:
// 1. Aller sur https://console.cloud.google.com/
// 2. Créer un nouveau projet ou sélectionner un projet existant
// 3. Activer l'API Google Calendar
// 4. Créer des identifiants OAuth 2.0
// 5. Ajouter http://localhost:3000 aux origines autorisées
// 6. Copier le Client ID et l'API Key ci-dessous

const GOOGLE_API_CONFIG = {
  apiKey: 'VOTRE_API_KEY',
  clientId: 'VOTRE_CLIENT_ID.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar.events'
};

let gapi = null;
let isGapiInitialized = false;

// Charger l'API Google
export const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (isGapiInitialized) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init(GOOGLE_API_CONFIG);
          gapi = window.gapi;
          isGapiInitialized = true;
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Vérifier si l'utilisateur est connecté
export const isSignedIn = () => {
  if (!gapi || !gapi.auth2) return false;
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

// Se connecter à Google
export const signIn = async () => {
  if (!gapi) {
    await loadGoogleAPI();
  }
  try {
    await gapi.auth2.getAuthInstance().signIn();
    return true;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
};

// Se déconnecter
export const signOut = () => {
  if (gapi && gapi.auth2) {
    gapi.auth2.getAuthInstance().signOut();
  }
};

// Créer un événement dans Google Calendar
export const createGoogleCalendarEvent = async (event) => {
  if (!gapi) {
    await loadGoogleAPI();
  }

  if (!isSignedIn()) {
    const signedIn = await signIn();
    if (!signedIn) {
      throw new Error('Authentification requise');
    }
  }

  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.result;
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    throw error;
  }
};

// Récupérer les événements existants pour une date
export const getEventsForDate = async (date) => {
  if (!gapi) {
    await loadGoogleAPI();
  }

  if (!isSignedIn()) {
    return [];
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.result.items || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return [];
  }
};

// Vérifier si un créneau est disponible
export const isTimeSlotAvailable = async (dateTime, duration = 60) => {
  const events = await getEventsForDate(dateTime);

  const slotStart = new Date(dateTime);
  const slotEnd = new Date(slotStart.getTime() + duration * 60000);

  for (const event of events) {
    if (!event.start || !event.start.dateTime) continue;

    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    // Vérifier le chevauchement
    if (
      (slotStart >= eventStart && slotStart < eventEnd) ||
      (slotEnd > eventStart && slotEnd <= eventEnd) ||
      (slotStart <= eventStart && slotEnd >= eventEnd)
    ) {
      return false;
    }
  }

  return true;
};

export default {
  loadGoogleAPI,
  isSignedIn,
  signIn,
  signOut,
  createGoogleCalendarEvent,
  getEventsForDate,
  isTimeSlotAvailable
};
