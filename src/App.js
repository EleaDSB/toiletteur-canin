import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './components/Accueil';
import Tarifs from './components/Tarifs';
import Creations from './components/Creations';
import Contact from './components/Contact';
import RendezVous from './components/RendezVous';

function App() {
  const [activeSection, setActiveSection] = useState('accueil');

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
      <Footer />
    </div>
  );
}

export default App;
