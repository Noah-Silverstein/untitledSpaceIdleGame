import { getRandomInRange } from "../../global/globalFuncts"
import { genRandomPlanetParams, Planet, PlanetParams } from "./planet"


/**
 *SUPERTERRAN
 *Mass, Core Mass Fraction, Radius, Temperature -> https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2019JE006124
 */


/**
 * Represents a large rocky planet 2-10 M⊕
 * @class 
 * @extends Planet
 * @param {string} params.name - Name of the planet
 * @param {PolarCoordinate} params.position - position of the planet
 * @param {AstronomicalBody} params.parentBody - the Body around which the planet orbits
 */
export class SuperTerran extends Planet {
	public static massRange: [number, number] = [2,10]

	constructor(params: PlanetParams){
		super(params)
	}

	static genRandom(params: genRandomPlanetParams ): SuperTerran{
		const name = params.name ?? this.generatePlanetName("SuperTerran")
		const albedo = Math.random()
		const epsilon = Math.random()
		const radEfficRatio = 0.5
		const solarHeating = Planet.estSurfaceTempFromSolar(radEfficRatio, params.effLumin, albedo, epsilon)
		const plMass = getRandomInRange(this.massRange[0], this.massRange[1])
		
		const p = new SuperTerran({
			parentBody: params.parentBody,
			position: params.position,
			name: name,
			earthMass: plMass,
			earthRadius: Planet.estRadiusFromMass(plMass),
			effLumin: params.effLumin,

			effTemp: solarHeating,
			albedo: albedo,
			epsilon: epsilon,
			radEfficRatio: radEfficRatio,
			retrograde: false
		})

		return p
	}

}
