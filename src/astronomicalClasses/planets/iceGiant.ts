import { getRandomInRange } from "../../global/globalFuncts"
import { genRandomPlanetParams, Planet, PlanetParams } from "./planet"



/* [α-A-1.1.ST] ---------------------
        ICEGIANT 
    25-100 M⊕​	4-6?? R⊕
		Ices, volatiles
--------------------*/



//Mass Metallicity ratio https://iopscience.iop.org/article/10.3847/0004-637X/831/1/64

/**
 * Represents a terrestrial planet. Composed primarily of silicate, rocks or metals. 25-100 M⊕
 * @class
 * @extends IceGiant
 * @param {PlanetParams} params - A TerranParams Interface
 * @param {string} params.name - Name of the planet
 * @param {PolarCoordinate} params.position - position of the planet
 * @param {AstronomicalBody} params.parentBody - the Body around which the planet orbits
 */
export class IceGiant extends Planet {

	public static massRange: [number, number] = [25,100]

	constructor(params: PlanetParams){
		super(params)
	}


	static genRandom(params: genRandomPlanetParams ): IceGiant {
		const name = params.name ?? this.generatePlanetName("IceGiant")
		const albedo = Math.random()
		const epsilon = Math.random()
		const radEfficRatio = 0.5
		const solarHeating = Planet.estSurfaceTempFromSolar(radEfficRatio, params.effLumin, albedo, epsilon)
		const plMass = getRandomInRange(this.massRange[0], this.massRange[1])
		
		const pl = new IceGiant({
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