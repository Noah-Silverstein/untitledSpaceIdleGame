import { getRandomInRange } from "../../global/globalFuncts"
import { AstronomicalBody } from "../baseAstronomicalClasses"
import { PolarCoordinate } from "../polarCoordinate"
import { genRandomPlanetParams, Planet, PlanetParams } from "./planet"





/**
 * Represents a terrestrial planet. 2-10 M⊕
 * @interface GenRandomSubTerranParams
 * @param {AstronomicalBody} parentBody - the AstronomicalBody around which the Terran orbits
 * @param {PolarCoordinate} position - the starting PolarCoordinate of the Terran (r will be the orbitalDistance[d])
 * @param {number} effLumin - the estimated incoming effective solar lumination [L/D^2] [D distance from lumin source]
 * @param {string} [name] - name of the Terran
 */
export interface GenRandomSubTerranParams {
	parentBody: AstronomicalBody
	position: PolarCoordinate
	effLumin: number 
	name?: string

}

export interface SubTerranParams extends PlanetParams{

}
/**
 * Represents a large rocky planet 2-10 M⊕
 * @class 
 * @extends Planet
 * @param {string} params.name - Name of the planet
 * @param {PolarCoordinate} params.position - position of the planet
 * @param {AstronomicalBody} params.parentBody - the Body around which the planet orbits
 */
export class SubTerran extends Planet {
	public static massRange: [number, number] = [0.0005,0.075]

	constructor(params: SubTerranParams){
		super(params)
	}

	static genRandom(params: genRandomPlanetParams ): SubTerran{
		const name = params.name ?? this.generatePlanetName("SubTerran")
		const albedo = Math.random()
		const epsilon = Math.random()
		const radEfficRatio = 0.5
		const solarHeating = Planet.estSurfaceTempFromSolar(radEfficRatio, params.effLumin, albedo, epsilon)
		const plMass = getRandomInRange(this.massRange[0], this.massRange[1])
		
		const p = new SubTerran({
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
