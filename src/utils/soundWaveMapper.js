// Constants for sound-to-color mapping
const SOUND_PROPERTIES = {
  // Vowels
  'i': { frequency: 2300, formants: [270, 2290], brightness: 0.9, saturation: 0.8 },
  'e': { frequency: 2000, formants: [390, 2300], brightness: 0.85, saturation: 0.75 },
  'a': { frequency: 1000, formants: [850, 1610], brightness: 0.8, saturation: 0.9 },
  'o': { frequency: 800, formants: [450, 800], brightness: 0.75, saturation: 0.85 },
  'u': { frequency: 300, formants: [310, 870], brightness: 0.7, saturation: 0.8 },

  // Stops
  'p': { frequency: 500, duration: 'short', intensity: 0.9, sharpness: 0.9 },
  'b': { frequency: 500, duration: 'short', intensity: 0.8, sharpness: 0.8 },
  't': { frequency: 4000, duration: 'short', intensity: 0.9, sharpness: 0.95 },
  'd': { frequency: 4000, duration: 'short', intensity: 0.8, sharpness: 0.85 },
  'k': { frequency: 1500, duration: 'short', intensity: 0.9, sharpness: 0.8 },
  'g': { frequency: 1500, duration: 'short', intensity: 0.8, sharpness: 0.7 },

  // Fricatives
  's': { frequency: 6000, duration: 'long', intensity: 0.7, turbulence: 0.9 },
  'z': { frequency: 6000, duration: 'long', intensity: 0.6, turbulence: 0.8 },
  'f': { frequency: 8000, duration: 'long', intensity: 0.6, turbulence: 0.7 },
  'v': { frequency: 8000, duration: 'long', intensity: 0.5, turbulence: 0.6 },
  'h': { frequency: 3000, duration: 'long', intensity: 0.4, turbulence: 0.5 },

  // Nasals
  'm': { frequency: 250, duration: 'medium', resonance: 0.8, flow: 0.7 },
  'n': { frequency: 200, duration: 'medium', resonance: 0.7, flow: 0.7 },
  'ŋ': { frequency: 200, duration: 'medium', resonance: 0.6, flow: 0.6 },

  // Liquids
  'l': { frequency: 250, duration: 'medium', fluidity: 0.8, resonance: 0.7 },
  'r': { frequency: 1200, duration: 'medium', fluidity: 0.9, resonance: 0.8 },
};

class SoundWaveMapper {
  constructor() {
    this.properties = SOUND_PROPERTIES;
  }

  frequencyToWavelength(freq) {
    // Map frequency range (200-8000 Hz) to visible spectrum (380-750 nm)
    const minFreq = 200;
    const maxFreq = 8000;
    const minWave = 380;
    const maxWave = 750;

    const logFreq = Math.log(freq);
    const logMin = Math.log(minFreq);
    const logMax = Math.log(maxFreq);

    return minWave + (maxWave - minWave) * 
           (logFreq - logMin) / (logMax - logMin);
  }

  wavelengthToRGB(wavelength) {
    let r, g, b;
    const gamma = 0.8;

    if (wavelength >= 380 && wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380);
      g = 0;
      b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
      r = 0;
      g = (wavelength - 440) / (490 - 440);
      b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
      r = 0;
      g = 1;
      b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1;
      b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
      r = 1;
      g = -(wavelength - 645) / (645 - 580);
      b = 0;
    } else if (wavelength >= 645 && wavelength <= 750) {
      r = 1;
      g = 0;
      b = 0;
    } else {
      r = 0;
      g = 0;
      b = 0;
    }

    // Intensity adjustment
    let factor;
    if (wavelength >= 380 && wavelength < 420) {
      factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if (wavelength >= 420 && wavelength <= 700) {
      factor = 1.0;
    } else if (wavelength > 700 && wavelength <= 750) {
      factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
    } else {
      factor = 0;
    }

    const adjustAndConvert = (value) => {
      return Math.round(255 * Math.pow(value * factor, gamma));
    };

    return {
      r: adjustAndConvert(r),
      g: adjustAndConvert(g),
      b: adjustAndConvert(b)
    };
  }

  getSoundColor(phoneme) {
    const props = this.properties[phoneme];
    if (!props) return '#000000';

    const wavelength = this.frequencyToWavelength(props.frequency);
    const { r, g, b } = this.wavelengthToRGB(wavelength);

    // Adjust color based on sound properties
    let adjustedR = r;
    let adjustedG = g;
    let adjustedB = b;

    if (props.brightness) {
      adjustedR *= props.brightness;
      adjustedG *= props.brightness;
      adjustedB *= props.brightness;
    }

    if (props.saturation) {
      const avg = (adjustedR + adjustedG + adjustedB) / 3;
      adjustedR = avg + (adjustedR - avg) * props.saturation;
      adjustedG = avg + (adjustedG - avg) * props.saturation;
      adjustedB = avg + (adjustedB - avg) * props.saturation;
    }

    return `#${Math.round(adjustedR).toString(16).padStart(2, '0')}${
      Math.round(adjustedG).toString(16).padStart(2, '0')}${
      Math.round(adjustedB).toString(16).padStart(2, '0')}`;
  }

  getColorGradient(sound1, sound2) {
    const color1 = this.getSoundColor(sound1);
    const color2 = this.getSoundColor(sound2);
    return `linear-gradient(to right, ${color1}, ${color2})`;
  }

  calculateHarmony(sound1, sound2) {
    const props1 = this.properties[sound1];
    const props2 = this.properties[sound2];
    if (!props1 || !props2) return 0;

    // Calculate frequency ratio
    const freqRatio = Math.min(props1.frequency, props2.frequency) / 
                     Math.max(props1.frequency, props2.frequency);

    // Simple harmony score based on frequency relationships
    return freqRatio;
  }
}

export default SoundWaveMapper;
