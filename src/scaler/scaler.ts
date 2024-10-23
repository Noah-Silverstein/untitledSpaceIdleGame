import * as UNI from "../astronomicalClasses/globalVars";
import { Planet } from "../astronomicalClasses/planet";

export class Scaler {

	constructor(){
	}

	/**
 * General scaling function to convert actual distances to screen positions.
 * Can be used for both grid lines and planetary orbit positioning.
 * @param distance - The distance to scale (in AU or chosen unit).
 * @param base - The base for the logarithmic-like scaling (e.g., 2, 10).
 * @param scaleFactor - Multiplier to control how distances are mapped to screen space.
 * @param offset - Offset to shift the scaled positions (optional).
 * @returns The scaled screen coordinate.
 */
public scaleDistance(distance: number, base: number = 10, scaleFactor: number = 100, offset: number = 0): number {
	// Using a pseudo-logarithmic scaling to convert the distance
	// You can adjust the formula to make it more log-like or smooth the intervals
	const scaled = Math.log(distance) / Math.log(base);
	return scaled * scaleFactor + offset;
}



/** PUT IN SYSTEMM?
* Position planets using the same scaling function for consistent visual representation.
* @param planets - Array of planetary objects with distances.
* @param base - The base for the logarithmic-like scaling.
* @param scaleFactor - Scaling factor for planetary positioning.
* @param offset - Offset to adjust the planetary positions.
* @returns An array of scaled positions for the planetary orbits.
*/
public scalePlanetaryOrbit(planet: Planet, base: number, scaleFactor: number, offset: number): number {
	const distance = planet.orbitalDistance; // or planet.distance if you have direct access
	const scaledDistance = this.scaleDistance(distance, base, scaleFactor, offset);
	return scaledDistance
}


	private mapRangeLog(value: number, srcMin: number, srcMax: number , destMin: number , destMax: number): number {
		// Ensure the input is clamped within the source range
		if (value < srcMin) value = srcMin;
		if (value > srcMax) value = srcMax;
	
		// Apply logarithmic mapping formula
		const logSrcMin = Math.log(srcMin);
		const logSrcMax = Math.log(srcMax);
		const logValue = Math.log(value);
	
		// Normalize and map to the destination range
		const normalized = (logValue - logSrcMin) / (logSrcMax - logSrcMin);
		return destMin + normalized * (destMax - destMin);
	}
	

	public scaleSysMoonRadius(radius:number): number {
		return 0.1
	}

	public scaleSysPlanetRadius(radius: number): number{
		const scaledRadius = this.mapRangeLog(radius, UNI.MIN_PLANETARY_RADIUS, UNI.MAX_PLANETARY_RADIUS, 0.1, 2 )
		console.log("scaledRadius to ", scaledRadius)
		return scaledRadius
	}

	public scaleSysStarRadius(radius: number): number{
		return 1
	}

	public scalePSGridLines(value: number): number {
		let scaledDistance = this.mapRangeLog(value, 0.01, 2500, 0, 150)
		return scaledDistance

	}

	public scaleSysPlanetaryDistances(value: number): number {
		let scaledDistance = this.mapRangeLog(value, 0.01, 2500, 0.1, 25)
		console.log("scaledDistance", scaledDistance)
		return scaledDistance
	}

	public scaleSysMoonDistances(orbitalDistance: number): number{
		return 1.1 + orbitalDistance
	}
}