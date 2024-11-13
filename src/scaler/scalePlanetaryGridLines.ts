import { Scaler } from "./scaler";


export class scaleGridLines {
    realScaleDistances: number[]
    scaledScaleDistances: number[] = []
    static numRings: number = 10

    constructor(realScaleDistances: number[], scaledScaleDistances: number[]){
        this.realScaleDistances = realScaleDistances
        this.scaledScaleDistances = scaledScaleDistances
    }  
    
    getScaledGridVals(): number[] {
        return this.scaledScaleDistances
    }

    // Generate the scaled positions for the rings
    public static genScaledGridVals(scaler: Scaler){
        const scaledGridCircles = Array.from({ length: this.numRings }, (_, index) => {
            const ringValue = scaler.MINDISTANCE * Math.pow(scaler.BASE, index); // Generates values: 0.1, 0.2, 0.4, 0.8, ...
            return scaler.scalePlanetaryOrbit(ringValue);
        });
        return scaledGridCircles
    }
    public static generateLogarithmicGrid(startd: number, base: number, scaleFactor: number, offset: number) {
		const positions: number[] = [];
		let distance = startd; // Start from a small distance for the log scale

		// Generate positions at each step until a maximum distance
		for (let i = 0; i < 20; i++) {
			const logPosition = Math.log(distance) / Math.log(base) * scaleFactor + offset;
			positions.push(logPosition);
			distance *= base; // Move to the next step in the log scale
		}
		return positions;
	}
    
    public static genLogScaleOrbitalGrid(base: number, scaler: Scaler){
        const gridDist = this.generateLogarithmicGrid(0.001, base, 1, 0)
        const scaledGridDist = this.genScaledGridVals(scaler)
        return new scaleGridLines(gridDist, scaledGridDist)
    }

}


export abstract class GridLines {
    constructor(){

    }

    abstract genGridLineValues(): number[]
}

