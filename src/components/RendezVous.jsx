import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, addMinutes, setHours, setMinutes, isBefore, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const RendezVous = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1); // 1: Date, 2: Heure, 3: Informations
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    chien: '',
    service: 'toilettage-complet',
    notes: ''
  });

  // Horaires d'ouverture
  const openingHours = {
    start: 9,
    end: 18,
    slotDuration: 60 // durée en minutes
  };

  // Jours fermés (dimanche = 0)
  const closedDays = [0]; // Dimanche

  // Générer les créneaux horaires disponibles
  const generateTimeSlots = (date) => {
    const slots = [];
    const now = new Date();

    // Si c'est samedi, fermer à 17h
    const endHour = date.getDay() === 6 ? 17 : openingHours.end;

    for (let hour = openingHours.start; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += openingHours.slotDuration) {
        const slotTime = setMinutes(setHours(date, hour), minute);

        // Ne pas afficher les créneaux passés pour aujourd'hui
        if (isSameDay(date, now) && isBefore(slotTime, now)) {
          continue;
        }

        slots.push(slotTime);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  // Vérifier si un jour est disponible
  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Désactiver les jours passés et les jours fermés
    return isBefore(date, today) || closedDays.includes(date.getDay());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créer l'événement pour Google Calendar
    const event = {
      summary: `Toilettage - ${formData.nom} (${formData.chien})`,
      description: `
Service: ${formData.service}
Client: ${formData.nom}
Email: ${formData.email}
Téléphone: ${formData.telephone}
Chien: ${formData.chien}
Notes: ${formData.notes}
      `.trim(),
      start: {
        dateTime: selectedTime.toISOString(),
        timeZone: 'Europe/Paris'
      },
      end: {
        dateTime: addMinutes(selectedTime, openingHours.slotDuration).toISOString(),
        timeZone: 'Europe/Paris'
      },
      attendees: [
        { email: formData.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 jour avant
          { method: 'popup', minutes: 60 } // 1 heure avant
        ]
      }
    };

    try {
      // Ici, on enverrait l'événement à Google Calendar
      // Pour le moment, on simule le succès
      console.log('Événement à créer:', event);

      // Dans une vraie implémentation, vous utiliseriez:
      // await createGoogleCalendarEvent(event);

      setBookingConfirmed(true);

      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setBookingConfirmed(false);
        setStep(1);
        setSelectedTime(null);
        setSelectedDate(new Date());
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          chien: '',
          service: 'toilettage-complet',
          notes: ''
        });
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const services = [
    { value: 'toilettage-complet', label: 'Toilettage complet', duree: '1h' },
    { value: 'bain-sechage', label: 'Bain + Séchage', duree: '45min' },
    { value: 'coupe', label: 'Coupe uniquement', duree: '45min' },
    { value: 'demêlage', label: 'Démêlage', duree: '1h' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Prendre Rendez-vous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Réservez votre créneau en quelques clics
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-semibold hidden md:inline">Date</span>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-semibold hidden md:inline">Heure</span>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 font-semibold hidden md:inline">Informations</span>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        {bookingConfirmed && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold text-lg">Rendez-vous confirmé !</p>
                <p>Vous recevrez un email de confirmation à {formData.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne Calendrier */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Étape {step}: {step === 1 ? 'Choisissez une date' : step === 2 ? 'Choisissez un horaire' : 'Vos informations'}
              </h2>

              {step === 1 && (
                <div className="calendar-container">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileDisabled={tileDisabled}
                    locale="fr-FR"
                    minDate={new Date()}
                    className="w-full border-none rounded-lg"
                  />
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Horaires d'ouverture</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>Lundi - Vendredi: 9h - 18h</li>
                      <li>Samedi: 9h - 17h</li>
                      <li>Dimanche: Fermé</li>
                    </ul>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-700">
                      <span className="font-semibold">Date sélectionnée:</span>
                      <br />
                      {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      Changer
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-4">Créneaux disponibles</h3>
                  <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                          selectedTime && selectedTime.getTime() === slot.getTime()
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-600'
                        }`}
                      >
                        {format(slot, 'HH:mm')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="votre.email@exemple.fr"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="01 23 45 67 89"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nom et race du chien *
                    </label>
                    <input
                      type="text"
                      name="chien"
                      value={formData.chien}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Max - Golden Retriever"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Service souhaité *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {services.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label} ({service.duree})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Notes / Demandes spéciales
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Informations complémentaires..."
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors duration-300"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Confirmer
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Colonne Récapitulatif */}
            <div className="bg-gradient-to-br from-green-500 to-purple-500 text-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>

              <div className="space-y-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Date
                  </h3>
                  <p className="text-lg">
                    {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : 'Non sélectionnée'}
                  </p>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Heure
                  </h3>
                  <p className="text-lg">
                    {selectedTime ? format(selectedTime, 'HH:mm') : 'Non sélectionnée'}
                  </p>
                </div>

                {formData.nom && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h3 className="font-bold mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Client
                    </h3>
                    <p className="text-lg">{formData.nom}</p>
                    {formData.chien && <p className="text-sm opacity-90">Chien: {formData.chien}</p>}
                  </div>
                )}

                {formData.service && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h3 className="font-bold mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Service
                    </h3>
                    <p className="text-lg">
                      {services.find(s => s.value === formData.service)?.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
                <h3 className="font-bold mb-2">Informations importantes</h3>
                <ul className="text-sm space-y-2 opacity-90">
                  <li>• Merci d'arriver 5 minutes avant l'heure du rendez-vous</li>
                  <li>• Pensez à apporter le carnet de vaccination</li>
                  <li>• En cas d'empêchement, prévenez-nous 24h à l'avance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Google Calendar */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Intégration Google Calendar
            </h3>
            <p className="text-gray-700 mb-2">
              Cette application peut être connectée à Google Calendar. Les rendez-vous seront automatiquement ajoutés à votre calendrier.
            </p>
            <p className="text-sm text-gray-600">
              Configuration requise: Clé API Google Calendar (voir README pour les instructions)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;
