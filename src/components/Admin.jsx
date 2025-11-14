import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [token, setToken] = useState(null);

  // Vérifier si un token existe au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      loadAppointments(storedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setError('');
        loadAppointments(data.token);
      } else {
        setError(data.message || 'Mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppointments = async (authToken = token) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/appointments', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        // Trier par date (plus récent en premier)
        const sorted = data.appointments.sort((a, b) =>
          new Date(b.dateTime) - new Date(a.dateTime)
        );
        setAppointments(sorted);
      } else if (response.status === 401 || response.status === 403) {
        // Token invalide ou expiré
        setError('Session expirée. Veuillez vous reconnecter.');
        handleLogout();
      } else {
        setError(data.message || 'Erreur lors du chargement des rendez-vous');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      setError('Erreur lors du chargement des rendez-vous');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir annuler le rendez-vous de ${nom} ?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Recharger la liste
        loadAppointments();
        alert('Rendez-vous annulé avec succès');
      } else if (response.status === 401 || response.status === 403) {
        alert('Session expirée. Veuillez vous reconnecter.');
        handleLogout();
      } else {
        alert('Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'annulation');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setPassword('');
    setAppointments([]);
  };

  const serviceNames = {
    'toilettage-complet': 'Toilettage complet',
    'bain-sechage': 'Bain + Séchage',
    'coupe': 'Coupe uniquement',
    'demêlage': 'Démêlage'
  };

  const getFilteredAppointments = () => {
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => new Date(apt.dateTime) >= now);
      case 'past':
        return appointments.filter(apt => new Date(apt.dateTime) < now);
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
            <p className="text-gray-600 mt-2">Gestion des rendez-vous Toutouchic</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le mot de passe"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📋 Gestion des Rendez-vous
              </h1>
              <p className="text-gray-600">
                {filteredAppointments.length} rendez-vous {filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passés' : 'au total'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadAppointments}
                disabled={isLoading}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 flex items-center gap-2"
              >
                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>

              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                filter === 'all'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tous ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                filter === 'upcoming'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              À venir ({appointments.filter(apt => new Date(apt.dateTime) >= new Date()).length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                filter === 'past'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Passés ({appointments.filter(apt => new Date(apt.dateTime) < new Date()).length})
            </button>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-600">Aucun rendez-vous</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAppointments.map((apt) => {
              const appointmentDate = new Date(apt.dateTime);
              const isPast = appointmentDate < new Date();
              const formattedDate = format(appointmentDate, 'EEEE d MMMM yyyy', { locale: fr });
              const formattedTime = format(appointmentDate, 'HH:mm');

              return (
                <div
                  key={apt.id}
                  className={`bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl ${
                    isPast ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Informations principales */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-full ${isPast ? 'bg-gray-100' : 'bg-green-100'}`}>
                          <svg className={`w-6 h-6 ${isPast ? 'text-gray-500' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">{apt.nom}</h3>
                          <p className="text-gray-600">🐕 {apt.chien}</p>
                        </div>
                        {isPast && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                            Passé
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold capitalize">{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{formattedTime}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span>{apt.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span>{apt.telephone}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="font-semibold text-gray-800 mb-1">✂️ Service : {serviceNames[apt.service]}</p>
                        {apt.notes && (
                          <p className="text-gray-600 text-sm mt-2">
                            <strong>Notes :</strong> {apt.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-3">
                      <button
                        onClick={() => handleDelete(apt.id, apt.nom)}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Annuler
                      </button>

                      <a
                        href={`mailto:${apt.email}`}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>

                      <a
                        href={`tel:${apt.telephone}`}
                        className="flex-1 md:flex-none px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Appeler
                      </a>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                    <span>ID: {apt.id}</span>
                    <span>Créé le {format(new Date(apt.createdAt), 'd MMM yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
