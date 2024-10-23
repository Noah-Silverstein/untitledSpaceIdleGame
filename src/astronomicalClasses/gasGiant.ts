import { Atmosphere } from "./atmosphere"
import { Planet } from "./planet"
import { genPlanetParams, PlanetParams } from "./planetInterfaces"




/* [α-A-1.1.ST] ---------------------
        GAS GIANTS 
    100+ - 4000? M⊕​ 10-12? R⊕
--------------------*/
export class GasGiant extends Planet {

	public static massRange: [number, number] = [100,3000]

	constructor(params: PlanetParams){
		super(params)
		this.atmosphere = params.atmosphere ?? new Atmosphere()
	}

	static genRandom(params: genPlanetParams): GasGiant {
		const genMass = params.earthMass ?? this.genRandomMass()
		const genRads = this.estRadiusFromMass(genMass)

		return new GasGiant({
			parentBody: params.parentBody,
			earthMass: genMass,
			earthRadius: genRads,
			name: params.name ?? ('GAS_GIANT-' + Planet.generatePlanetName()),
			position: params.position
		})
	}
}