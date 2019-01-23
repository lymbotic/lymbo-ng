/**
 * Represents a swatch
 */
class Swatch {

  /** Array of RGB colors */
  rgb: number[];
  /** Population */
  population: number;

  /**
   * Constructor
   */
  constructor() {
    this.rgb = [0, 0, 0];
    this.population = 0;
  }
}

/**
 * Represents a vibrant palette
 */
export class VibrantPalette {

  /** Vibrant swatch */
  vibrant: Swatch;
  /** Dark vibrant swatch */
  darkVibrant: Swatch;
  /** Light vibrant swatch */
  lightVibrant: Swatch;
  /** Muted swatch */
  muted: Swatch;
  /** Dark muted swatch */
  darkMuted: Swatch;
  /** Light muted swatch */
  lightMuted: Swatch;

  /**
   * Constructor
   */
  constructor() {
    this.vibrant = new Swatch();
    this.darkVibrant = new Swatch();
    this.lightVibrant = new Swatch();
    this.muted = new Swatch();
    this.darkMuted = new Swatch();
    this.lightMuted = new Swatch();
  }
}
