import * as UNI from "./globalVars";



//** RANDOM FUNCTIONS **//

export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
export function getRandomInRange(min: number, max: number){
  return (Math.random() * (max - min)) + min;

}

export function pickWithProbability<T>(items: T[], probabilities: number[]): T | null {
  if (items.length !== probabilities.length) {
      throw new Error("Items and probabilities arrays must be of the same length.");
  }

  const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
  if (totalProbability !== 1) {
      throw new Error("Probabilities must sum up to 1.");
  }

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < items.length; i++) {
      cumulative += probabilities[i];
      if (random < cumulative) {
          return items[i];
      }
  }

  return null; // In case something goes wrong
}


export function toFixedNumber(num: number, digits: number, base: number){
  const pow = Math.pow(base ?? 10, digits);
  return Math.round(num*pow) / pow;
}

export function getRandomNumberInErrRange(value: number, error: number): number {
    // Calculate the minimum and maximum values based on the given value and error range
    const minValue = value - error;
    const maxValue = value + error;

    // Generate a random number within the specified range
    const randomNumber = Math.random() * (maxValue - minValue) + minValue;

    // Return the random number rounded to the same number of decimal places as the input value
    return parseFloat(randomNumber.toFixed(getDecimalPlaces(value)));
}

export function getRandomAngle(minRadians: number, maxRadians: number): number {
  const angle = Math.random() * (maxRadians - minRadians) + minRadians;
  return parseFloat(angle.toFixed(2));
}
// Helper function to determine the number of decimal places in a number
function getDecimalPlaces(num: number): number {
  const str = num.toString();
  const decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}

export function getRandomPercentage(num: number){
  return num*Math.random()
}

//** DISTRIBUTION FUNCTIONS **/
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve

//generate a random number that follows the normal distribution 
export function randomNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Return the normally distributed random number with the given mean and standard deviation
  return z * stdDev + mean;
}

export function randomSkewedNormal(mean: number, leftStdDev: number, rightStdDev: number): number {
  const u = Math.random(); // Uniform(0,1) random number
  let z: number;

  // Use the left stddev for values below the mean and right stddev for values above
  if (u < 0.5) {
      // Sample from the left side
      z = (Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random())) * leftStdDev;
  } else {
      // Sample from the right side
      z = (Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random())) * rightStdDev;
  }

  return mean + z; // Scale and shift
}

/**
 * Generates a random value from a skewed normal distribution.
 * @param mean - The mean of the distribution.
 * @param stddev - The standard deviation of the distribution.
 * @param skew - The skewness parameter (positive for right skew, negative for left skew).
 * @returns A random value from the skewed normal distribution.
 */
function skewedNormalDistribution(mean: number, stddev: number, skew: number): number {
  const u = Math.random(); // Uniform random value in [0, 1)
  const v = Math.random(); // Another uniform random value

  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); // Standard normal variable
  const skewedZ = skew * (z + 0.5); // Adjust the z-value based on skewness
  const skewedValue = mean + stddev * skewedZ; // Scale to the desired mean and standard deviation

  return Math.max(skewedValue, 0); // Ensure the result is not negative
}

/**
* Generate multiple random values from the specified skewed normal distribution.
* @param count - Number of random values to generate.
* @returns An array of random values.
*/
function generateSkewedNormalValues(count: number): number[] {
  const mean = 2; // Desired mean
  const stddev = 1; // Standard deviation (you can adjust this)
  const skew = 5; // Skewness factor (adjust to achieve the desired skew)

  const values = [];
  for (let i = 0; i < count; i++) {
      let value = skewedNormalDistribution(mean, stddev, skew);
      while (value > 8) { // Filter values greater than 8
          value = skewedNormalDistribution(mean, stddev, skew);
      }
      values.push(value);
  }
  return values;
}

/**
 * Generates a random number based on the given boxplot values.
 * @param min - Minimum value of the distribution.
 * @param q1 - First quartile (25th percentile).
 * @param median - Median value (50th percentile).
 * @param q3 - Third quartile (75th percentile).
 * @param max - Maximum value of the distribution.
 * @returns A random number following the boxplot distribution.
 */
export function randomFromBoxplot(min: number, q1: number, median: number, q3: number, max: number): number {
  // Generate a random number between 0 and 1
  const rand = Math.random();
  
  // Determine which segment of the boxplot the random number falls into
  if (rand < 0.25) {
      // Lower segment: Uniformly between min and Q1
      return min + (q1 - min) * Math.random();
  } else if (rand < 0.5) {
      // Middle segment: Triangular distribution between Q1 and median
      const t = Math.random();
      return q1 + (median - q1) * t * t; // Quadratic to skew towards Q1
  } else if (rand < 0.75) {
      // Upper segment: Triangular distribution between median and Q3
      const t = Math.random();
      return median + (q3 - median) * t * t; // Quadratic to skew towards Q3
  } else {
      // Top segment: Uniformly between Q3 and max
      return q3 + (max - q3) * Math.random();
  }
}

export interface BoxPlot {
  min: number,
  max: number,
  median: number,
  q1: number,
  q3: number,
}


export function clamp(val: number, min: number, max: number): number{
  return Math.min(Math.max(val, min), max);
}
//** ARRAY FUNCTIONS **//
export function getRandomElements<T>(arr: T[], count: number): T[] {
  // If the requested count is greater than the array length, return a copy of the whole array shuffled
  if (count >= arr.length) {
      return arr.slice().sort(() => Math.random() - 0.5);
  }

  const result: T[] = [];
  const arrCopy = [...arr]; // Create a copy to avoid mutating the original array

  // Loop to extract random elements
  for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * arrCopy.length);
      result.push(arrCopy[randomIndex]);
      arrCopy.splice(randomIndex, 1); // Remove the selected element to avoid duplicates
  }

  return result;
}

//** MAPPING FUNCTIONS **//
//map origin range to destination range with a linear function
export function mapRangeLin(value: number, originMin: number, originMax: number, destMin: number, destMax: number): number {
  // Ensure the input is clamped within the source range
  if (value < originMin) value = originMin;
  if (value > originMax) value = originMax;

  // Apply the linear mapping formula
  return destMin + ((value - originMin) / (originMax - originMin)) * (destMax - destMin);
}


//extract the elements from an elemental composition
//uses UNI.ELEMENTS to find elements
export function extractElements(composition: string): string[] {
  // Regex to match elements and their counts
  const regex = /([A-Z][a-z]?)(\d*)/g;
  const elements: Set<string> = new Set(); // Use a Set to avoid duplicates

  let match: RegExpExecArray | null;
  while ((match = regex.exec(composition)) !== null) {
      const element: string = match[1]; // The element symbol
      // Check if the matched element is in the valid elements Set
      if (UNI.ELEMENTS.has(element)) {
          elements.add(element); // Add to Set
      }
  }

  return Array.from(elements); // Convert Set to Array and return
}