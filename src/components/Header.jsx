import React, { useState } from 'react';

const Header = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'creations', label: 'Créations' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    setActiveSection('accueil');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50 border-b-2 border-green-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et nom */}
          <div
            onClick={handleLogoClick}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src={`${process.env.PUBLIC_URL}/logo.jpg`}
              alt="Toutou Chic Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-green-400 shadow-md"
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">Toutou Chic</h1>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-lg font-medium transition-all duration-300 hover:text-green-600 ${
                  activeSection === item.id ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('rendez-vous')}
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Prendre RDV
            </button>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 animate-fade-in">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-700 font-bold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('rendez-vous')}
              className="block w-full bg-gradient-to-r from-green-500 to-purple-500 text-white px-4 py-3 rounded-lg font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300 shadow-md"
            >
              Prendre RDV
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
