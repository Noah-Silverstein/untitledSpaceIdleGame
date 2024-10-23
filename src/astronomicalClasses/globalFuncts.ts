import * as UNI from "./globalVars";



//** RANDOM FUNCTIONS **//

export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export function getRandomNumberInRange(value: number, error: number): number {
    // Calculate the minimum and maximum values based on the given value and error range
    const minValue = value - error;
    const maxValue = value + error;

    // Generate a random number within the specified range
    const randomNumber = Math.random() * (maxValue - minValue) + minValue;

    // Return the random number rounded to the same number of decimal places as the input value
    return parseFloat(randomNumber.toFixed(getDecimalPlaces(value)));
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