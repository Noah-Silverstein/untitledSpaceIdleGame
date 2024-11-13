import { getRandomInRange } from "../../global/globalFuncts"
import { BaseMaterial } from "../../materials/materials"
import { genRandomPlanetParams, Planet, PlanetParams } from "./planet"



/**
 * @interface TerranParams 
 * @extends PlanetParams
 * @param volcanicActivity - (optional) measurement of volcanic activity
 * @param weathering - (optional) the degree to which weathering effects the planet crust
 * 
 */
export interface TerranParams extends PlanetParams {
	volcanicActivity?: number, 
	weathering?: number, 
}


/**
 * Represents a terrestrial planet. Composed primarily of silicate, rocks or metals. 0-2 M⊕
 * @class
 * @extends Planet
 * @param {TerranParams} params - A TerranParams Interface
 * @param {string} params.name - Name of the planet
 * @param {PolarCoordinate} params.position - position of the planet
 * @param {AstronomicalBody} params.parentBody - the Body around which the planet orbits
 */
export class Terran extends Planet {
	//** Terran parameters **// 	<----------------EXAMPLES NOT USED YET
	volcanicActivity: number = 0
	weathering: number = 0
	//** Mass Range of game Terran**//		
	public static massRange: [number, number] = [0.075,2]

	constructor(params: TerranParams){
		super(params)
		this.volcanicActivity = params.volcanicActivity ?? 0
		this.weathering = params.weathering ?? 0
	}
	
	
	static genRandom(params: genRandomPlanetParams ): Terran {
		const name = params.name ?? this.generatePlanetName("Terran")
		const albedo = Math.random()
		const epsilon = Math.random()
		const radEfficRatio = 1
		const solarHeating = Planet.estSurfaceTempFromSolar(radEfficRatio, params.effLumin, albedo, epsilon)
		const plMass = getRandomInRange(this.massRange[0], this.massRange[1])
		
		const pl = new Terran({
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

		return pl
	}


}


