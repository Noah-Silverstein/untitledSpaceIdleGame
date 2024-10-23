import { Planet } from "./planet"
import { genPlanetParams, PlanetParams } from "./planetInterfaces"


/* [α-A-1.1.ST] ---------------------
        MININEPTUNIAN 
    10-25 M⊕​ 2.5-4?? R⊕
		Rocky core + gas
--------------------*/
export class MiniNeptunian extends Planet {

	public static massRange: [number, number] = [10,25]

	constructor(params: PlanetParams){
		super(params)
		this.name = params.name ?? ('MINI_NEPTUNIAN-' + Planet.generatePlanetName())
	}


	static genRandom(params: genPlanetParams): MiniNeptunian {
		const genMass = params.earthMass ?? this.genRandomMass()
		const genRads = this.estRadiusFromMass(genMass)

		return new MiniNeptunian({
			parentBody: params.parentBody,
			earthMass: genMass,
			earthRadius: genRads,
			name: params.name ?? ('MINI_NEPTUNIAN-' + Planet.generatePlanetName()),
			position: params.position
		})
	}

}
