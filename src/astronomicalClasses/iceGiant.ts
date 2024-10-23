import { Atmosphere } from "./atmosphere"
import { Planet } from "./planet"
import { genPlanetParams, PlanetParams } from "./planetInterfaces"



/* [α-A-1.1.ST] ---------------------
        ICEGIANT 
    25-100 M⊕​	4-6?? R⊕
		Ices, volatiles
--------------------*/

export class IceGiant extends Planet {

	public static massRange: [number, number] = [25,100]

	constructor(params: PlanetParams){
		super(params)
		this.name = params.name ?? ('ICE_GIANT-' + Planet.generatePlanetName())
	}


	static genRandom(params: genPlanetParams): IceGiant {
		const genMass = params.earthMass ?? this.genRandomMass()
		const genRads = this.estRadiusFromMass(genMass)

		return new IceGiant({
			parentBody: params.parentBody,
			earthMass: genMass,
			earthRadius: genRads,
			name: params.name ?? ('ICE_GIANT-' + Planet.generatePlanetName()),
			position: params.position
		})
	}
	

}