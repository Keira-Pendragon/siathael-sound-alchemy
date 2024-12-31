import React from 'react';
import SoundAlchemyVisualizer from './components/SoundAlchemyVisualizer';
import './styles.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white text-center">
          Siathael Sound Alchemy
        </h1>
        <p className="text-gray-300 text-center mt-2">
          Explore the relationship between sounds and colors
        </p>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <SoundAlchemyVisualizer />
      </main>
      
      <footer className="max-w-7xl mx-auto mt-8 text-center text-gray-400">
        <p>Created with 💜 for the Siathael language project</p>
      </footer>
    </div>
  );
}

export default App;
