import React from 'react';

const Tarifs = () => {
  const tarifsBySize = [
    {
      size: "Petit",
      description: "Moins de 10kg",
      examples: "Chihuahua, Yorkshire, Bichon...",
      color: "from-green-400 to-green-600",
      services: [
        { name: "Bain + Séchage", price: "25€" },
        { name: "Coupe complète", price: "35€" },
        { name: "Toilettage complet", price: "45€" }
      ]
    },
    {
      size: "Moyen",
      description: "10-25kg",
      examples: "Cocker, Beagle, Bulldog...",
      color: "from-green-400 to-green-600",
      services: [
        { name: "Bain + Séchage", price: "35€" },
        { name: "Coupe complète", price: "50€" },
        { name: "Toilettage complet", price: "65€" }
      ]
    },
    {
      size: "Grand",
      description: "Plus de 25kg",
      examples: "Golden, Berger, Labrador...",
      color: "from-purple-400 to-purple-600",
      services: [
        { name: "Bain + Séchage", price: "50€" },
        { name: "Coupe complète", price: "70€" },
        { name: "Toilettage complet", price: "90€" }
      ]
    }
  ];

  const extraServices = [
    { name: "Coupe des griffes", price: "10€" },
    { name: "Nettoyage des oreilles", price: "8€" },
    { name: "Démêlage intensif", price: "15€ - 30€" },
    { name: "Épilation", price: "20€" },
    { name: "Soin du pelage (masque)", price: "15€" },
    { name: "Blanchiment dentaire", price: "25€" }
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nos Tarifs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des prix transparents adaptés à la taille de votre compagnon
          </p>
        </div>

        {/* Tarifs par taille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tarifsBySize.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`bg-gradient-to-r ${category.color} text-white p-6 text-center`}>
                <h2 className="text-3xl font-bold mb-2">{category.size}</h2>
                <p className="text-lg opacity-90">{category.description}</p>
                <p className="text-sm mt-2 opacity-80">{category.examples}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {category.services.map((service, idx) => (
                    <li key={idx} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                      <span className="text-gray-700 font-medium">{service.name}</span>
                      <span className="text-2xl font-bold text-purple-500">{service.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Services supplémentaires */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Services Supplémentaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extraServices.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors duration-300"
                >
                  <span className="text-gray-700 font-medium">{service.name}</span>
                  <span className="text-xl font-bold text-green-600">{service.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Informations pratiques
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Le toilettage complet inclut : bain, séchage, coupe, coupe des griffes et nettoyage des oreilles
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Prise de rendez-vous obligatoire - Possibilité de rendez-vous en urgence selon disponibilité
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tarif dégressif : -10% à partir du 3ème chien de la même famille
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Moyens de paiement : CB, espèces, chèques
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Prendre rendez-vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tarifs;
