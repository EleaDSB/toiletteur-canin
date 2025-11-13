import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    chien: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(false);
    setFormSubmitted(false);

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSubmitted(true);
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          chien: '',
          message: ''
        });

        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      } else {
        setFormError(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setFormError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contactez-moi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question ? Besoin d'un rendez-vous ? N'hésitez pas à me contacter !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire de contact */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Envoyez-moi un message
            </h2>

            {formSubmitted && (
              <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                <p className="font-bold">✅ Message envoyé !</p>
                <p>Je vous répondrais dans les plus brefs délais.</p>
              </div>
            )}

            {formError && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-bold">❌ Erreur</p>
                <p>Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter par téléphone.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nom" className="block text-gray-700 font-semibold mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="votre.email@exemple.fr"
                />
              </div>

              <div>
                <label htmlFor="telephone" className="block text-gray-700 font-semibold mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div>
                <label htmlFor="chien" className="block text-gray-700 font-semibold mb-2">
                  Race et nom de votre chien
                </label>
                <input
                  type="text"
                  id="chien"
                  name="chien"
                  value={formData.chien}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Ex: Golden Retriever - Max"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Décrivez votre demande..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-green-500 to-purple-500 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-green-600 hover:to-purple-600 transform hover:scale-105'
                }`}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            {/* Coordonnées */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Nos coordonnées
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Adresse</h3>
                    <p className="text-gray-600">123 Rue des Animaux<br />75001 Paris, France</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Téléphone</h3>
                    <p className="text-gray-600">01 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">contact@toutouchic.fr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Horaires d'ouverture
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Lundi - Vendredi</span>
                  <span className="text-gray-600">9h - 18h</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Samedi</span>
                  <span className="text-gray-600">9h - 17h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Dimanche</span>
                  <span className="text-gray-600">Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
