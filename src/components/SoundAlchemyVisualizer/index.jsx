import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

// Initial color mappings (will be moved to separate config)
const PREFERRED_VOWEL_COLORS = {
  'i': { base: '#00bfff', highlight: '#4dd2ff' },
  'e': { base: '#00ff91', highlight: '#4dffc1' },
  'a': { base: '#ff0088', highlight: '#ff4dab' },
  'o': { base: '#fbff00', highlight: '#fcff4d' },
  'u': { base: '#00ffcc', highlight: '#4dffe1' },
};

const SoundAlchemyVisualizer = () => {
  const [selectedSounds, setSelectedSounds] = useState([]);
  const [soundColors, setSoundColors] = useState(PREFERRED_VOWEL_COLORS);
  const [isWaveMode, setIsWaveMode] = useState(false);
  
  const consonants = ['p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 's', 'z', 'h', 'm', 'n', 'ŋ', 'l', 'r'];
  const vowels = ['i', 'e', 'a', 'o', 'u'];

  // Basic sound toggling functionality
  const toggleSound = (sound) => {
    setSelectedSounds(prev => {
      if (prev.length < 9) {
        const isVowel = vowels.includes(sound);
        const lastThree = prev.slice(-3);
        const consecutiveCount = lastThree.filter(s => 
          vowels.includes(s) === isVowel
        ).length;
        
        if (consecutiveCount < 3) {
          return [...prev, sound];
        }
      }
      return prev;
    });
  };

  const clearSelection = () => {
    setSelectedSounds([]);
  };

  return (
    <Card className="p-6 bg-gray-900">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Sound Alchemy Lab</h2>
          <button 
            onClick={clearSelection}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>

        {/* Sound combination display */}
        <div className="mb-6">
          <div className="w-full p-4 rounded-lg bg-gray-800">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSounds.map((sound, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: soundColors[sound]?.base }}
                >
                  {sound}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consonants */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">Consonants</h3>
          <div className="flex flex-wrap gap-1">
            {consonants.map(sound => (
              <button
                key={sound}
                onClick={() => toggleSound(sound)}
                className="w-10 h-10 rounded-full font-bold text-white"
                style={{ backgroundColor: soundColors[sound]?.base }}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>

        {/* Vowels */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">Vowels</h3>
          <div className="flex flex-wrap gap-1">
            {vowels.map(sound => (
              <button
                key={sound}
                onClick={() => toggleSound(sound)}
                className="w-10 h-10 rounded-full font-bold text-white"
                style={{ backgroundColor: soundColors[sound]?.base }}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundAlchemyVisualizer;
