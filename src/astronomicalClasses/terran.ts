import { Atmosphere } from "./atmosphere"
import { Planet } from "./planet"
import { genPlanetParams, PlanetParams } from "./planetInterfaces"



/**
 * Represents a terrestrial planet. Composed primarily of silicate, rocks or metals. 
 * @extends Planet
 * 0-2 M⊕​	0-1.5?? R⊕
 * 
 */
export class Terran extends Planet {

	public static massRange: [number, number] = [0.001,2]

	/**
	 * Creates an instance of Terran. Composition: Silicates, Metals
	 * @param {PlanetParams} params - The parameters for creating a Terran planet.
	 * @param {number} [params.mass] - mass of planet in Earth mass (terran range is 0-2)
 	 * @param {number} [params.radius] - The radius of the planet in Earth radii. (terran range is 0-1.5)
	 * @param {PolarCoordinate} params.position - The position of the planet in its orbit.
	 * @param {AstronomicalBody} params.parentBody - The astronomical body around which the planet orbits.
	 * @param {Atmosphere} [params.atmosphere] - The atmosphere of the planet (optional).
	 *
	 */
	constructor(params: PlanetParams){
		super(params)
		this.name = params.name ?? this.parentBody.name.substring(0,3).concat("-Terran", Planet.generatePlanetName())
	}


	static genRandom(params: genPlanetParams): Terran {
		// ** GEN RANDOM MASS (created lower bound of 0.0010)
		if (params.earthMass){
			console.log('CREATING PL GIVEN MASS', params)
		}
		const genMass = params.earthMass ?? this.genRandomMass()
		const genRads = this.estRadiusFromMass(genMass)

		return new Terran({
			parentBody: params.parentBody,
			earthMass: genMass,
			earthRadius: genRads,
			name: params.name ?? ('Terran-' + Planet.generatePlanetName()),
			position: params.position
		})
	}



}