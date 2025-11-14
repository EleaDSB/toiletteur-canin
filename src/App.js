import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './components/Accueil';
import Tarifs from './components/Tarifs';
import Creations from './components/Creations';
import Contact from './components/Contact';
import RendezVous from './components/RendezVous';
import Admin from './components/Admin';

function App() {
  const [activeSection, setActiveSection] = useState('accueil');

  // Remonter en haut de la page lors du changement d'onglet
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'accueil':
        return <Accueil setActiveSection={setActiveSection} />;
      case 'tarifs':
        return <Tarifs />;
      case 'creations':
        return <Creations />;
      case 'contact':
        return <Contact />;
      case 'rendez-vous':
        return <RendezVous />;
      case 'admin':
        return <Admin />;
      default:
        return <Accueil />;
    }
  };

  return (
    <div className="App min-h-screen flex flex-col">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-grow">
        {renderSection()}
      </main>
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}

export default App;
