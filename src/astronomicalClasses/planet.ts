import * as UNI from "./globalVars"
import { getRandomNumberInRange, randomInteger } from "./globalFuncts";
import { AstronomicalBody, PlanetaryMassObject } from "./baseAstronomicalClasses";
import { Star } from "./stars";
import { Atmosphere } from "./atmosphere";
import { genRandomFromMassPlanetParams, genRandomPlanetParams, PlanetParams } from "./planetInterfaces";



/**
 * MAS RADIUS RELATION FROM THIS PAPER -> https://www.aanda.org/articles/aa/full_html/2024/06/aa48690-23/aa48690-23.html
 * EXOPLANET ARCHIVE -> https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS
 * a substellar-mass body that has never undergone nuclear fusion and has enough gravitation to be round 
 * due to hydrostatic equilibrium, regardless of its orbital parameters.
 * 
 */

/**
 * PLANETS
 * @extends PlanetaryMassObject
 * @param {PlanetParams} params
 * 
 */

export abstract class Planet extends PlanetaryMassObject {
	public earthMass: number;
	public earthRadius: number;
	public atmosphere: Atmosphere | undefined;
	public interiorLayers: number[];
	public orbitalDistance: number;
	public orbitalPeriod: number;	//in days
	public retrograde: Boolean = false
	public parentBody: AstronomicalBody;
	public vEscape: number;
	public effectiveIncomingLuminosity: number = 0
	public bBTemp: number;
	public albedo: number = randomInteger(1,10)/10
	public hillRadius: number;
	public static massRange: [number, number]

	constructor(params: PlanetParams){	//Parent Body is REQUIRED FOR PLANET (rogue planet is under Planetart Mass Object)
		const realMass = params.earthMass*UNI.EARTH_MASS;
		const realRadius = params.earthRadius*UNI.EARTH_RADIUS
		super({
			realMass: realMass,
			realRadius: realRadius,
			...params
		})
		// ** ASSIGN PROPERTIES **//
		this.earthMass = params.earthMass 
		this.earthRadius = params.earthRadius 
		this.parentBody = params.parentBody 
		//** ASSIGN/CALC OPTIONAL PARAM PROPERTIES **//
		this.atmosphere = params.atmosphere ?? new Atmosphere()
		this.bBTemp = params.temperature ?? this.calcTempAsBlackBody(this.effectiveIncomingLuminosity)
		// ** CALCULATE PROPERTIES **//
		this.orbitalDistance = params.position.r
		this.hillRadius = this.calculateHillRadius()
		this.orbitalPeriod = this.calcOrbitalPeriod(this.orbitalDistance, this.parentBody.mass)/UNI.SECONDS_PER_DAY //in days
		this.interiorLayers = [0,1,2]
		this.effectiveIncomingLuminosity = this.calcEffIncomLumin()
		this.vEscape = Math.pow(2*UNI.UNIVERSAL_GRAVITATIONAL_CONSTANT*this.earthMass/(this.radius*UNI.EARTH_RADIUS), 0.5)
	}

  // ** Required methods for Subclasses **
	static genRandom(params: genRandomPlanetParams): Planet {
		const index = randomInteger(0, params.planetTypes.length - 1)
		const pl = params.planetTypes[index].genRandom({parentBody: params.parentBody, position: params.position, name: params.name, earthMass: params.earthMass})
		return pl
	}

	static genRandomFromMass(params: genRandomFromMassPlanetParams): Planet {
		const planetOptions = params.planetTypes.filter((planet) => 
			params.earthMass >= planet.massRange[0] && params.earthMass <= planet.massRange[1])
		if (planetOptions.length !== 0){
			if (planetOptions.length > 1){
					console.log('__MULTIPLE PLANETS FIT MASS CRITERIA! CHOOSING RANDOM FROM OPTIONS___')
					return this.genRandom({planetTypes: planetOptions, parentBody: params.parentBody, position: params.position, name: params.name, earthMass: params.earthMass })
			} else {
				return planetOptions[0].genRandom(params)
			}
		} else {
			console.log("No planet for EARTH MASS: ", params.earthMass)
			throw new Error('___NO PLANETS FOUND THAT FIT MASS___')
		}

	}

	protected static genRandomMass(){
		return randomInteger(this.massRange[0]*1e5, this.massRange[1]*1e5)/1e5
	}
	/**
	 * Estimate the Radius if a Planet based on Mass
	 * largely based on this paper (formula fit to real data): https://www.aanda.org/articles/aa/full_html/2024/06/aa48690-23/aa48690-23.html
	 * @param mass in Earth Mass
	 * @returns Radius in Earth Radius 
	 */
	protected static estRadiusFromMass(mass: number): number{
		const lowBound = 4.37;
    const highBound = 127;

    if (mass < lowBound) {
        // Lower boundary case
        return getRandomNumberInRange(1.02, 0.03) * Math.pow(mass, getRandomNumberInRange(0.27, 0.04));
    } else if (mass >= lowBound && mass <= highBound) {
        // Middle range case
        return getRandomNumberInRange(0.56, 0.03) * Math.pow(mass, getRandomNumberInRange(0.67, 0.05));
    } else {
        // Upper boundary case
        return getRandomNumberInRange(18.6, 6.7) * Math.pow(mass, getRandomNumberInRange(-0.06, 0.07));
    }
	}
	
	protected static generatePlanetName(): string {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const randomLetters = Array(3).fill("").map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
		const randomDigits = randomInteger(1e3,1e4 ) // Generates a 4-digit number
		return `${randomLetters}${randomDigits}`;
	}

	/**
	 * Effective Temp of Planet as BlackBody 
	 * @param distance distance in meters to planet (if just calculating )
	 * @param effectiveLuminosity is the effective Luminosity recieved in SOLAR LUMIN (= Lsun/D**2)
	 * @returns effective temp given the effective luminosity of a body approx as black body
	 */
	public calcTempAsBlackBody(effectiveIncomingLuminosity:number){
		return Math.pow((effectiveIncomingLuminosity*UNI.SOLAR_LUMINOSITY * (1 - this.albedo)) / (16 * Math.PI * UNI.STEFAN_BOLTZMANN_CONSTANT), 0.25);
	}

	public calcEffIncomLumin(): number{
		if(this.parentBody instanceof Star){
			return (this.parentBody.luminosity/(this.orbitalDistance*UNI.ASTRO_UNIT**2))
		} else if (this.parentBody instanceof Planet){
			return this.parentBody.effectiveIncomingLuminosity
		}
		console.log("___COULDN'T CALC INCOMING LUMINOSITY FOR:__", this)
		return 0
	}

	/**
	 * Calc Orbital Period
	 * @param orbDist in AU
	 * @param massParentBody in Kg
	 * @returns the orbital period in seconds
	 * https://en.wikipedia.org/wiki/Orbital_period
	 */
	protected calcOrbitalPeriod(orbDist: number, massParentBody: number): number {
		let orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(orbDist*UNI.ASTRO_UNIT, 3) / (UNI.UNIVERSAL_GRAVITATIONAL_CONSTANT * massParentBody))
		return  orbitalPeriod;
	}

	/**
	 * use Escape Velocity > 6 x Thermal Velocity -> atmosphere can hold if thermal escape velocity of gas molecules is 6x lower than Escape Velocity
	 * Vthermal​<1/6​Vescape
	 * 
	 */

	protected estimateAvgGasMassForAtmRetention(): number{
			return 48*UNI.BOLTZMANN_CONSTANT*this.bBTemp/(Math.PI*(this.vEscape**2))
	}

	getParentBody(): AstronomicalBody{
		return this.parentBody
	}
}

