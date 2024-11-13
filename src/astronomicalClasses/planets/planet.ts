import * as UNI from "../../global/globalVars"
import { getRandomNumberInErrRange, randomInteger } from "../../global/globalFuncts";
import { AstronomicalBody, PlanetaryMassObject, PlanetaryMassParams, WithoutRealValues } from "../baseAstronomicalClasses";
import { Atmosphere } from "./atmosphere";
import { PolarCoordinate } from "../polarCoordinate";
import { BaseMaterial } from "../../materials/materials";



/**
 * MAS RADIUS RELATION FROM THIS PAPER -> https://www.aanda.org/articles/aa/full_html/2024/06/aa48690-23/aa48690-23.html
 * EXOPLANET ARCHIVE -> https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS
 * a substellar-mass body that has never undergone nuclear fusion and has enough gravitation to be round 
 * due to hydrostatic equilibrium, regardless of its orbital parameters.
 * 
 */
/**
 * @interface genRandomPlanetParams
 * @param parentBody - the AstronomicalBody around which the Terran orbits
 * @param position - the starting PolarCoordinate of the Terran (r will be the orbitalDistance[d])
 * @param effLumin - the estimated incoming effective solar lumination [L/D^2] [D distance from lumin source]
 * @param name - (optional) name of the Terran
 */
export interface genRandomPlanetParams {
	parentBody: AstronomicalBody
	position: PolarCoordinate
	effLumin: number 
	name?: string

}

/**
 * @interface PlanetParams
 * @param parentBody - the AstronomicalBody around which the Planet rotates
 * @param earthRadius - the radius of the Planet as a fraction of Earth's Radius
 * @param earthMass - the mass of the Planet as a fraction of Earth's Mass
 * @param effTemp - the effective temp on the surface solar + internal heat sources (ex: radioactive decay, tidal forces, initial forming heat, ..)
 * @param albedo - the fraction of solar light that is reflected 
 * @param epsilon - the fraction of solar rad radiated out
 * @param radEfficRatio - the Radiative Efficiency Ratio, the fraction of area absorbing solar/area emitting [0.5: slow rotators or tidally locked, 0.25: fast rotators]
 */
export interface PlanetParams extends WithoutRealValues<PlanetaryMassParams> {
	//position & name inherited from AstronomicalObjectParams
	//optional Satellites[] inherited from AstronomicalBodyParams
	parentBody: AstronomicalBody;
	earthRadius: number;
	earthMass: number;
	effLumin: number;
	effTemp: number;
	albedo: number;
	epsilon: number;
	radEfficRatio: number;
	retrograde: Boolean;	
}



/**
 *  Abstract class for Planets: a substellar-mass body that has never undergone nuclear fusion and has enough gravitation to be round
 * @class 
 * @extends PlanetaryMassObject
 */
export abstract class Planet extends PlanetaryMassObject {
	//** positional **//
	public parentBody: AstronomicalBody;
	//** movement **//
	public orbitalDistance: number;				//in AU
	public orbitalPeriod: number = 0			//in days -> Via Keplers 3rd Law https://en.wikipedia.org/wiki/Orbital_period
	public retrograde: Boolean = false
	//** basic data **/
	public earthMass: number;
	public earthRadius: number;
	//** temperature data **//
	public effTemp: number = 0					//estimated temp on planet: estSurfaceTemp() + Any non solar temperature source (internal or external)
	public effLumin: number = 0					// real Units
	public radEfficRatio: number = 1			//The Area that absorbs solar radiation/The Area that radiates temp (0.5 for normal rotators, 0.25 for fast rotators)
	public albedo: number = Math.random()	
	public epsilon: number = Math.random()	// emissivity
	//** atmosphere data **//
	protected vEscape: number = 0				//escape velocity from https://en.wikipedia.org/wiki/Escape_velocity
	public atmosphere: Atmosphere | null;
	//** interior data **/
	public crustMaterial: BaseMaterial[] = []


	//** abstract class data **/
	public static massRange: [number, number]
	
	constructor(params: PlanetParams){	//Parent Body is REQUIRED FOR PLANET (rogue planet is under Planetart Mass Object)
		//catch earth values and pass on real values
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
		this.effLumin = params.effLumin
		this.effTemp = params.effTemp
		this.albedo = params.albedo
		this.epsilon = params.epsilon
		this.radEfficRatio = params.radEfficRatio
		this.retrograde = params.retrograde
		//** ASSIGN/CALC OPTIONAL PARAM PROPERTIES **//
		this.atmosphere = new Atmosphere()
		this.orbitalDistance = params.position.r	
		// ** CALCULATE PROPERTIES **//
		this.orbitalPeriod = this.calcOrbitalPeriod(this.orbitalDistance, this.parentBody.mass)/UNI.SECONDS_PER_DAY //in days
		this.vEscape = Math.pow(2*UNI.UNIVERSAL_GRAVITATIONAL_CONSTANT*this.mass/this.radius, 0.5)
	}

	
	protected static genRandomMass(){
		return randomInteger(this.massRange[0]*1e5, this.massRange[1]*1e5)/1e5
	}
	/**
	 * Estimate the Radius if a Planet based on Mass
	 * largely based on this paper (formula fit to real data): https://www.aanda.org/articles/aa/full_html/2024/06/aa48690-23/aa48690-23.html
	 * @param {number} mass in Earth Mass
	 * @returns Radius in Earth Radius 
	 */
	protected static estRadiusFromMass(mass: number): number{
		const lowBound = 4.37;
		const highBound = 127;

		if (mass < lowBound) {
			// Lower boundary case
			return getRandomNumberInErrRange(1.02, 0.03) * Math.pow(mass, getRandomNumberInErrRange(0.27, 0.04));
		} else if (mass >= lowBound && mass <= highBound) {
			// Middle range case
			return getRandomNumberInErrRange(0.56, 0.03) * Math.pow(mass, getRandomNumberInErrRange(0.67, 0.05));
		} else {
			// Upper boundary case
			return getRandomNumberInErrRange(18.6, 6.7) * Math.pow(mass, getRandomNumberInErrRange(-0.06, 0.07));
		}
	}
	
	protected static generatePlanetName(type: string): string {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const randomLetters = Array(3).fill("").map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
		const randomDigits = randomInteger(1e3,1e4 ) // Generates a 4-digit number
		return `${type} - ${randomLetters}${randomDigits}` ;
	}

	public setCrustMaterial(cMat: BaseMaterial[]){
		this.crustMaterial = cMat
	}

	/**
	 * Calculate the effective Temp of a planet as approximated by a black body (using albedo and emmisivity)
	 * @param areaRatio Radiative Efficiency Ratio [Aabs/Arad]: [0,1].  1/4 for fast rotators (jupiter?), 1/2 for slower rotators (ex: earth) | 1 for the subsolar point, the point on the planet directly below the sun and gives the maximum temperature of the planet 
	 * @param effLumin - effective lumination recieved [L/D^2] -> ratio must be in REAL UNITS
	 * @param albedo -  ratio of solar energy reflected by the planet surface [0,1] -->Make inate parameter of Planet
	 * @param epsilon - emmisivity: ratio of thermal radiation emitted [0,1]		-->Make inate parameter of Planet
	 * @returns 
	 * https://en.wikipedia.org/wiki/Effective_temperature#Surface_temperature_of_a_planet
	 * https://astronomy.stackexchange.com/questions/29293/how-to-calculate-planetary-equilibrium-temperature-in-binary-systems
	 */
	protected static estSurfaceTempFromSolar(effLumin: number,radEfficRatio: number, albedo: number, epsilon: number): number{
		return Math.pow(radEfficRatio*(effLumin/(4*Math.PI))*(1-albedo)/(UNI.STEFAN_BOLTZMANN_CONSTANT*epsilon),(1/4))
	}

	public setTempFromSolarLumin(stellarLumin: number){
		this.effTemp = Planet.estSurfaceTempFromSolar(stellarLumin, this.radEfficRatio, this.albedo, this.epsilon)
	}

	public getEffLumin(){

	}

	/**
	 * Calc Orbital Period
	 * @param orbDist in AU
	 * @param massParentBody in Kg
	 * @returns the orbital period in seconds
	 * https://en.wikipedia.org/wiki/Orbital_period
	 */
	protected calcOrbitalPeriod(orbDist: number, massParentBody: number): number {
		let orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(orbDist*UNI.ASTRO_UNIT, 3) / (UNI.UNIVERSAL_GRAVITATIONAL_CONSTANT*(this.mass + massParentBody)))
		return  orbitalPeriod;
	}

	/**
	 * use Escape Velocity > 6 x Thermal Velocity -> atmosphere can hold if thermal escape velocity of gas molecules is 6x lower than Escape Velocity
	 * Vthermal​<1/6​Vescape
	 * 
	 */

	protected estimateAvgGasMassForAtmRetention(): number{
			return 48*UNI.BOLTZMANN_CONSTANT*this.effTemp/(Math.PI*(this.vEscape**2))
	}

	getParentBody(): AstronomicalBody{
		return this.parentBody
	}
}

