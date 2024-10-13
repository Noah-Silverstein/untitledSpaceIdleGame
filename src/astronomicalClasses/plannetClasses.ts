import * as UNI from './globalVars'
import {PlanetaryMassObject, PlanetaryMassParams, AstronomicalBody} from './planetarySystemUtils.tsx'
import { PolarCoordinate } from './polarCoordinate.ts';
import { randomInteger } from './globalFuncts.ts';
import { Star } from './Stars.ts';



function generatePlanetName(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array(3).fill("").map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
    const randomDigits = randomInteger(1e3,1e4 ) // Generates a 7-digit number
    return `${randomLetters}${randomDigits}`;
}


//α-A-1.1
/**
* Parameters for initializing a planet.
* 
* @interface PlanetParams
* @extends PlanetaryMassParams
*/
export interface PlanetParams extends PlanetaryMassParams {
				/**
			 * The astronomical body around which the planet orbits.
			 * 
			 * @type {AstronomicalBody}
			 */
				parentBody: AstronomicalBody;
        /**
         * Parameters to initialize Planet
         * 
         * @type {Atmosphere}
         * @optional
         */
        atmosphere?: Atmosphere;
        /**
         * The natural satellites of the planet.
         * 
         * @type {PlanetaryMassObject[]}
         * @optional
         */
        naturalSatellites?: PlanetaryMassObject[];
				/**
         * The Temperature (black body approx) of the Body.
         * 
         * @type {number}
         */
				temperature?: number;
				
}


/* [α-A-1.1] ---------------------
        PLANET
    KEY: Orbits their star (or gas giant?) directly (perhaps will allow for moons being miniterran? for now no moons)
	I'm using https://phl.upr.edu/hwc types based on size. But will use more info (habital zone , hot/cold/warm) as well.
	Again there's no agreed upon classification system for planets where they all filter into neat groups. booo astronomers 
	PHL's type classification are Type - PHL's classification of planets that includes host star spectral type (F, G, K, M), habitable zone location (hot, warm, cold), 
	and size (miniterran, subterran, terran, superterran, neptunian, jovian )
	weirdly I couldn't find the actual range of radius on the site...perhaps this is something that is common knowledge but i couldn't find it. any way the ranges i've gone with are
	0.03-0.5-0.8-1.25-2.0-6.0-15.0
--------------------*/
interface AtmosphereParams {
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
/**
 * @extends PlanetaryMassObject
 * @param {PlanetParams} params
 * 
 */
export class Planet extends PlanetaryMassObject {
    public atmosphere: Atmosphere | undefined;
		public interiorLayers: number[];
		public radius: number;
    public orbitalDistance: number;
		public orbitalPeriod: number;	//
		public position: PolarCoordinate
		public parentBody: AstronomicalBody;
		public temperature: number;
		public vEscape: number;
		public hillRadius: number | null = null;
     
    constructor(params: PlanetParams){	//Parent Body is REQUIRED FOR PLANET (rogue planet is under Planetart Mass Object)
        super(params)
				this.mass = params.mass 
				this.radius = params.radius 

				this.atmosphere = params.atmosphere ?? undefined

        this.position = params.position //redundant
				this.orbitalDistance = this.position.r
				this.parentBody = params.parentBody 

				this.orbitalPeriod = this.calcOrbitalPeriod(this.orbitalDistance, this.parentBody.mass)/(60*60*24) //in days

				this.interiorLayers = [0]

				this.temperature = params.temperature ?? this.estimateTemp(this.position.r)
				this.vEscape = Math.pow(2*UNI.UNIVERSAL_GRAVITATIONAL_CONSTANT*this.mass/(this.radius*UNI.EARTH_RADIUS), 0.5)
    }

		protected estimateTemp(distanceToStar: number){
			return Math.pow(distanceToStar, -0.5)
		}

		protected calcOrbitalPeriod(orbDist: number, massParentBody: number): number {
			let massConstant = 1
			if(this.parentBody instanceof Star){
				massConstant = UNI.SOLAR_MASS
			} else if (this.parentBody instanceof Planet){
				massConstant = UNI.EARTH_MASS
			}
			return  (2 * Math.PI * Math.sqrt(Math.pow(orbDist*UNI.ASTRO_UNIT, 3) / (UNI.UNIVERSAL_GRAVITATIONAL_CONSTANT * massParentBody*massConstant)));
		}

		/**
		 * use Escape Velocity > 6 x Thermal Velocity -> atmosphere can hold if thermal escape velocity of gas molecules is 6x lower than Escape Velocity
		 * Vthermal​<1/6​Vescape
		 * 
		 */

		protected estimateAvgGasMassForAtmRetention(): number{
				return 48*UNI.BOLTZMANN_CONSTANT*this.temperature/(Math.PI*(this.vEscape**2))
		}

		getParentBody(): AstronomicalBody{
			return this.parentBody
		}
}


/**
 * Represents a MiniTerran planet.
 * @extends Planet
 */
export class MiniTerran extends Planet {
		constructor(params: PlanetParams){
			super(params)
			
			this.atmosphere = params.atmosphere ?? undefined
		}

		static genRandom(genParentBody:AstronomicalBody, genPosition: PolarCoordinate, genName?:string): Terran {
			const genRadius = (randomInteger(3, 50)/100) //in EARHT_RAD
			const genMass = (randomInteger(5,100)/100)	//in EARTH_MASS
	
			return new MiniTerran({
				parentBody: genParentBody,
				mass: genMass,
				radius: genRadius,
				name: genName ?? genParentBody.name.substring(0,3).concat('-MiniTerran', generatePlanetName()),
				position: genPosition
			})
		}

}
/* [α-A-1.1.ST] ---------------------
        SUBTERRAN - [0.5, 0.8]
    
--------------------*/
export class SubTerran extends Planet {
	constructor(params: PlanetParams){
		super(params)
		this.atmosphere = params.atmosphere ?? new Atmosphere()
		this.radius = params.radius ?? (randomInteger(50, 80)/100)	// in EARTH_RADIUS

	}
}

//[α-A-1.1.T]
/**
 * Represents a Terran planet.
 * @extends Planet
 */
export class Terran extends Planet {
	/**
	 * Creates an instance of Terran.
	 * @param {PlanetParams} params - The parameters for creating a Terran planet.
	 * @param {Atmosphere} [params.atmosphere] - The atmosphere of the planet (optional).
	 * @param {number} [params.radius] - The radius of the planet in Earth radii (optional).
	 * @param {PolarCoordinate} params.position - The position of the planet in its orbit.
	 * @param {AstronomicalBody} params.parentBody - The astronomical body around which the planet orbits.
	 */
	constructor(params: PlanetParams){
		super(params)
		
		this.atmosphere = params.atmosphere ?? new Atmosphere()

		this.name = this.parentBody.name.substring(0,3).concat("-Terran", generatePlanetName())
	}

	static genRandom(genParentBody:AstronomicalBody, genPosition: PolarCoordinate): Terran {
		const genRadius = (randomInteger(80, 125)/100)
		const genMass = this.estimateTerranMass(genRadius)

		return new Terran({
			parentBody: genParentBody,
			mass: genMass,
			radius: genRadius,
			name: genParentBody.name.substring(0,3).concat('-Terran', generatePlanetName()),
			position: genPosition
		})
	}

	/**
	 * Estimates the mass of a terrestrial planet based on its radius->Volume.
	 * @param radius - The radius of the planet in kilometers.
	 * @returns The estimated mass of the planet in kilograms.
	 */
	private static estimateTerranMass(radius: number): number {
		// Volume of a sphere: V = (4/3) * π * r³
		const volume = (4 / 3) * Math.PI * Math.pow(radius*UNI.EARTH_RADIUS, 3);
		const mass = volume * UNI.AVG_TERRAN_DENSITY / UNI.EARTH_MASS; 
		return mass; // Return mass in kg
	}
}
/* [α-A-1.1.ST] ---------------------
        SUPERTERRAN - [1.25, 2.0]
    
--------------------*/
export class SuperTerran extends Planet {
	constructor(params: PlanetParams){
		super(params)
		this.atmosphere = params.atmosphere ?? new Atmosphere()
		this.radius = params.radius ?? (randomInteger(125, 200)/100)	// in EARTH_RADIUS
	}
}

/* [α-A-1.1.ST] ---------------------
        NEPTUNIAN - [2.0, 6.0]
    ICE GIANTS?
--------------------*/
export class Neptunian extends Planet {
	constructor(params: PlanetParams){
		super(params)
		this.atmosphere = params.atmosphere ?? new Atmosphere()
		this.radius = params.radius ?? (randomInteger(200, 600)/100)	// in EARTH_RADIUS
	}
}

/* [α-A-1.1.ST] ---------------------
        JOVIAN - [6.0, 15.0]
    GAS GIANTS
--------------------*/
export class Jovian extends Planet {
	constructor(params: PlanetParams){
		super(params)
		this.atmosphere = params.atmosphere ?? new Atmosphere()
		this.radius = params.radius ?? (randomInteger(600, 1500)/100)	// in EARTH_RADIUS
		this.name = this.parentBody.name.substring(0,3).concat("-JOVIAN", generatePlanetName())

	}

}
