import { Atmosphere } from "./atmosphere"
import { Planet } from "./planet"
import { genPlanetParams, PlanetParams } from "./planetInterfaces"


/* [α-A-1.1.ST] ---------------------
        SUPERTERRAN
				2-10 M⊕​	1.5-2.5?? R⊕
    Mass, Core Mass Fraction, Radius, Temperature -> https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2019JE006124
--------------------*/
/**
 * 
 * @extends Planet
 * 
 */
export class SuperTerran extends Planet {
	public static massRange: [number, number] = [2,10]

	constructor(params: PlanetParams){
		super(params)
		this.atmosphere = params.atmosphere ?? new Atmosphere()
	}

	static genRandom(params: genPlanetParams): SuperTerran {
		const genMass = params.earthMass ?? this.genRandomMass()
		const genRads = this.estRadiusFromMass(genMass)

		return new SuperTerran({
			parentBody: params.parentBody,
			earthMass: genMass,
			earthRadius: genRads,
			name: params.name ?? ('SUPER_TERRAN-' + Planet.generatePlanetName()),
			position: params.position
		})
	}

}
