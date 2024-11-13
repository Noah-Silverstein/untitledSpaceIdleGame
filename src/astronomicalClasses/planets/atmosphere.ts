import * as UNI from "../../global/globalVars";




export interface AtmosphereParams {
	size? :number;
	layers?: number[];
	composition?: Record<UNI.AtmosphericGas, number>;
}

export class Atmosphere {
	public size: number;
	public composition: Record<UNI.AtmosphericGas, number>;
	public weightedAvgMass: number

	private calcWeightedAvg(): number{
		const totalWeight = Object.entries(this.composition).reduce((acc, [gas, percentage]) => {	//reduce is a for-each + accumulator
			const weight = UNI.AtmosphericGasWeights[gas as UNI.AtmosphericGas];  // Get weight from the AtmosphericGasWeights
			return acc + weight * percentage;  	// Weighted 
		}, 0);
		return totalWeight
	}

	constructor(param: AtmosphereParams = {}){
		this.size = param.size ?? 10e6
		this.composition = param.composition ??  {'N2': 0.8, 'O': 0.2 } as Record<UNI.AtmosphericGas, number>
		this.weightedAvgMass = this.calcWeightedAvg()
	}
}
