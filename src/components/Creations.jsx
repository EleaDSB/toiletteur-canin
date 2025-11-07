import React, { useState } from 'react';

const Creations = () => {
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const categories = [
    { id: 'tous', label: 'Tous' },
    { id: 'petits', label: 'Petits chiens' },
    { id: 'moyens', label: 'Chiens moyens' },
    { id: 'grands', label: 'Grands chiens' }
  ];

  const creations = [
    {
      id: 1,
      category: 'petits',
      title: 'Yorkshire Terrier',
      description: 'Coupe complète avec nœud',
      colorBefore: 'from-pink-300 to-pink-400',
      colorAfter: 'from-pink-500 to-pink-700'
    },
    {
      id: 2,
      category: 'moyens',
      title: 'Cocker Spaniel',
      description: 'Toilettage complet',
      colorBefore: 'from-green-300 to-green-400',
      colorAfter: 'from-green-500 to-green-700'
    },
    {
      id: 3,
      category: 'petits',
      title: 'Bichon Maltais',
      description: 'Coupe nounours',
      colorBefore: 'from-purple-300 to-purple-400',
      colorAfter: 'from-purple-500 to-purple-700'
    },
    {
      id: 4,
      category: 'grands',
      title: 'Golden Retriever',
      description: 'Bain et soin du pelage',
      colorBefore: 'from-yellow-300 to-orange-400',
      colorAfter: 'from-yellow-500 to-orange-700'
    },
    /*{
      id: 5,
      category: 'moyens',
      title: 'Caniche',
      description: 'Coupe créative',
      colorBefore: 'from-green-300 to-teal-400',
      colorAfter: 'from-green-500 to-teal-700'
    },
    {
      id: 6,
      category: 'grands',
      title: 'Berger Australien',
      description: 'Démêlage et coupe',
      colorBefore: 'from-indigo-300 to-purple-400',
      colorAfter: 'from-indigo-500 to-purple-700'
    },
    {
      id: 7,
      category: 'petits',
      title: 'Shih Tzu',
      description: 'Coupe complète et nœuds',
      colorBefore: 'from-red-300 to-pink-400',
      colorAfter: 'from-red-500 to-pink-700'
    },
    {
      id: 8,
      category: 'moyens',
      title: 'Schnauzer',
      description: 'Épilation et mise en forme',
      colorBefore: 'from-gray-400 to-gray-500',
      colorAfter: 'from-gray-600 to-gray-800'
    },
    {
      id: 9,
      category: 'grands',
      title: 'Labrador',
      description: 'Bain et séchage',
      colorBefore: 'from-amber-300 to-amber-400',
      colorAfter: 'from-amber-500 to-amber-700'
    }*/
  ];

  const filteredCreations = selectedCategory === 'tous'
    ? creations
    : creations.filter(creation => creation.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Mes Créations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez mes plus belles réalisations et laissez-vous inspirer
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Galerie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {filteredCreations.map((creation) => (
            <div
              key={creation.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              {/* Conteneur Avant/Après */}
              <div className="relative grid grid-cols-2 gap-0">
                {/* Photo AVANT */}
                <div className="relative overflow-hidden">
                  <div className={`bg-gradient-to-br ${creation.colorBefore} h-64 md:h-80 flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <svg className="w-20 h-20 text-white opacity-40" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                    </svg>
                    {/* Badge AVANT */}
                    <div className="absolute top-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      Avant
                    </div>
                  </div>
                </div>

                {/* Photo APRÈS */}
                <div className="relative overflow-hidden border-l-4 border-white">
                  <div className={`bg-gradient-to-br ${creation.colorAfter} h-64 md:h-80 flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <svg className="w-20 h-20 text-white opacity-60" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                    </svg>
                    {/* Badge APRÈS */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      Après
                    </div>
                  </div>
                </div>
              </div>

              {/* Séparateur avec icône */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-white rounded-full p-3 shadow-2xl border-4 border-white">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {creation.title}
                </h3>
                <p className="text-gray-600">
                  {creation.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Ce que disent nos clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Service impeccable ! Mon Bichon est ressorti magnifique. L'équipe est adorable et professionnelle."
              </p>
              <p className="text-gray-500 font-semibold">- Marie D.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Je recommande les yeux fermés ! Mon Golden Retriever adore y aller. Excellent rapport qualité-prix."
              </p>
              <p className="text-gray-500 font-semibold">- Thomas L.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Envie de faire partie de notre galerie ?
          </p>
          <button className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Prendre rendez-vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Creations;
