// Data collection and storage utilities
export class SoundAlchemyData {
  constructor() {
    this.ratings = [];
    this.combinations = new Set();
  }

  // Add a new rating for a sound combination
  addRating(combination, rating, colors) {
    this.ratings.push({
      combination,
      rating,
      colors,
      timestamp: new Date().toISOString()
    });
    this.combinations.add(combination);
  }

  // Export all collected data
  exportData() {
    return {
      ratings: this.ratings,
      uniqueCombinations: Array.from(this.combinations),
      stats: this.calculateStats()
    };
  }

  // Calculate basic statistics
  calculateStats() {
    if (this.ratings.length === 0) return {};

    const ratings = this.ratings.map(r => r.rating);
    return {
      totalRatings: this.ratings.length,
      uniqueCombinations: this.combinations.size,
      averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      highestRated: this.ratings.reduce((max, curr) => 
        curr.rating > max.rating ? curr : max, this.ratings[0]),
      lowestRated: this.ratings.reduce((min, curr) => 
        curr.rating < min.rating ? curr : min, this.ratings[0])
    };
  }

  // Get all ratings for a specific combination
  getRatingsForCombination(combination) {
    return this.ratings.filter(r => r.combination === combination);
  }

  // Clear all stored data
  clearData() {
    this.ratings = [];
    this.combinations.clear();
  }

  // Save data to localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem('soundAlchemyData', JSON.stringify(this.exportData()));
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  }

  // Load data from localStorage
  loadFromLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('soundAlchemyData'));
      if (data) {
        this.ratings = data.ratings || [];
        this.combinations = new Set(data.uniqueCombinations || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load data:', error);
      return false;
    }
  }
}
