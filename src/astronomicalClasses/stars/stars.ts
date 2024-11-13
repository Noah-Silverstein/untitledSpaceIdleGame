import { AstronomicalBody, AstronomicalBodyParams, WithoutRealValues } from "../baseAstronomicalClasses";
import { randomInteger } from "../../global/globalFuncts";
import * as UNI from '../../global/globalVars'
import { PolarCoordinate } from "../polarCoordinate";
/* [α-A-2] ----------------------
								STARS
		KEY: you know 'em, you love em, ya know...stars
	classifying based on luminosity classes

		LUMINOSITY CLASSES come from stellar evolution https://en.wikipedia.org/wiki/Stellar_evolution#/media/File:Starlifesimple.png
														https://en.wikipedia.org/wiki/Stellar_evolution#/media/File:Star_Life_Cycle_Chart.jpg
		mass luminosity relationship -> https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation#Distinguishing_between_small_and_large_stellar_masses
		mass radius relationship -> https://jila.colorado.edu/~ajsh/courses/astr1120_03/text/chapter5/l5S1.htm
		mass Temp relationship -> Stefan–Boltzmann_law  https://en.wikipedia.org/wiki/Stefan%E2%80%93Boltzmann_law
		temp Wavelength -> https://en.wikipedia.org/wiki/Wien%27s_displacement_law
		habitable zones -> https://www.planetarybiology.com/calculating_habitable_zone.html &	https://iopscience.iop.org/article/10.1088/0004-637X/765/2/131/meta
		Metallicity -> https://en.wikipedia.org/wiki/Metallicity
			influences planet formation and star type

		https://en.wikipedia.org/wiki/Initial_mass_function

		Therefore, we have derived relationships between HZ stellar fluxes (Seff) reaching the top of 
		the atmosphere of an Earth-like planet and stellar effective temperatures (Teff) applicable in the range 2600 K ⩽Teff ⩽ 7200 K: 
		can be used for G, F (maybe not early),K, EARLY TO MID M, red supergiants, red giants, some white dwarfs (tidally locked?)
		NOT A, O, or B
		TODO?? ADD EARLY/MID/LATE for stars based on temp? https://en.wikipedia.org/wiki/Stellar_classification spectral types
----------------------------*/
export function generateStarName(): string {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const randomLetters = Array(3).fill("").map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
	const randomDigits = randomInteger(1e7,1e8 ) // Generates a 7-digit number
	return `${randomLetters}${randomDigits}-Star`
}

//α-A-2
/**
 * Parameters for creating a Star object, extending AstronomicalBodyParams.
 * 
 * @interface StarParams
 * @extends AstronomicalBodyParams
 * @property {number} [luminosity] - The luminosity of the star relative to the Sun's luminosity (L☉). Optional.
 * @property {number} [surfaceTemp] - The surface temperature of the star in Kelvin. Optional.
 * @property {AstronomicalBody[]} [naturalSatellites] - An array of natural satellites (e.g., planets) orbiting the star. Optional.
 */
export interface StarParams extends WithoutRealValues<AstronomicalBodyParams> {
	solarRadius: number;
	solarMass: number;
	luminosity: number;
	surfaceTemp: number;
	naturalSatellites?: AstronomicalBody[];
}
/**
 * Represents a star, extending from the base AstronomicalBody class.
 *
 * @class Star
 * @extends AstronomicalBody
 * @param {StarParams} params - Parameters for configuring the star.
 * @param {number} [params.luminosity=0] - The star's luminosity relative to the Sun's luminosity (L☉). Default is 0.
 * @param {number} [params.surfaceTemp=0] - The star's surface temperature in Kelvin. Default is 0.
 * @param {AstronomicalBody[]} [params.naturalSatellites] - An array of natural satellites (e.g., planets) orbiting the star.
 * @param {string} [params.name] - The name of the star. If not provided, a name is generated using `generateStarName`.
 * @param {number} [params.mass=undefined] - The mass of the star in kilograms, inherited from AstronomicalBody.
 * @param {number} [params.radius=undefined] - The radius of the star in meters, inherited from AstronomicalBody.
 * @param {number} [params.orbitalPeriod=0] - The orbital period in seconds, inherited from AstronomicalBody.
 */
export abstract class Star extends AstronomicalBody {
	public solarMass: number;
	public solarRadius: number;
    public luminosity: number;	//in L☉, ei in solar luminosity
    public surfaceTemp: number;	//Kelvin
    public wavelengthPeak: number;	//peak wavelength in nm
    public habitableZones: Record<string,  number >;
	public frostLine: number
	public silicateLine: number
	public spectralType?: string
	public hillSphere: number = 0	//-------------> change this or initialize stars to orbit around black hole center of galaxy
	//initialize for 0 planet likelyhood
	protected planetLikelyhoodRange: number[] = [Infinity]
	protected planetOdds: number[] = [0]

	constructor(params: StarParams){
		const realMass = params.solarMass*UNI.SOLAR_MASS
		const realRadius = params.solarRadius*UNI.SOLAR_RADIUS
		//** TRANSFORM MASS TO REAL MASS**/		
		super({
			realMass: realMass,
			realRadius: realRadius,
			...params
		})
		this.solarMass = params.solarMass
		this.solarRadius = params.solarRadius
		this.luminosity = params.luminosity
		this.surfaceTemp = params.surfaceTemp
		this.name = params.name ?? generateStarName()
		this.habitableZones = this.calcHabitableZoneBoundaries(this.surfaceTemp)
		this.wavelengthPeak = this.calcWaveLength(this.surfaceTemp)
		this.frostLine = this.estFrostLine(this.luminosity)
		this.silicateLine = this.estSilicateLine(this.luminosity)
	}

	/**
	 * returns the rough distance you'll find temps equal or lower than given temp for a given luminosity
	 * @param lumin - Solar Luminosity of the star
	 * @param temp - The target Temperature in Kelvin [K]
	 * @returns - the distance from the star to the target Temperature in AU
	 */
	protected estDistanceForTemp(lumin: number, temp: number){
		return Math.pow(lumin*UNI.SOLAR_LUMINOSITY/(16*Math.PI*UNI.STEFAN_BOLTZMANN_CONSTANT*(temp**4)), 0.5)/UNI.ASTRO_UNIT
	}

	protected estSilicateLine(lumin: number){
		return this.estDistanceForTemp(lumin, 1500)	//all silicates are molten at 1200
	}

	/**
	 * Estimates the FrostLine of a star: the distance at which volatiles start coalescing 
	 * @param lumin - Solar Luminosity of the Star
	 * @returns - the FrostLine distance in AU
	 */
	protected estFrostLine(lumin: number){
		return this.estDistanceForTemp(lumin, 150)	//at 150 (-125 c°) volatiles form solids
	}

	public getPlanetOdds(distance: number): number {
		// Check if the input arrays are of the same length + 1 for the added initial odds value
		if (this.planetLikelyhoodRange.length + 1 !== this.planetOdds.length) {
			throw new Error("kType length must be one less than odds length after adding initial odds." );
		}
	
		// Iterate through the kType array to find the appropriate range
		for (let i = 0; i < this.planetLikelyhoodRange.length; i++) {
			// Check if the distance is less than the current kType value
			if (distance < this.planetLikelyhoodRange[i]) {
				// Return the corresponding odds
				return this.planetOdds[i]; 
			}
		}
	
		// If the distance is greater than or equal to the last kType value, return the last odds
		return this.planetOdds[this.planetOdds.length - 1]; // Return the last value for distances greater than the last kType
	}
	
	/**
	 * Calculates 'Conservative Habitable Zone' of a star (Provided Temp 2600 K ⩽Teff ⩽ 7200 K) 
	 * 
	 * @returns {[number, number]} - An array with two values:
	 *  - The first value is the inner boundary of the habitable zone (in AU).
	 *  - The second value is the outer boundary of the habitable zone (in AU).
	 * 
	 */
	public getHabitableRange():[number, number]{
		if(this.habitableZones){
			return [Math.round(this.habitableZones['Moist Greenhouse']*1000)/1000, Math.round(this.habitableZones['Maximum Greenhouse']*1000)/1000]
		} else {
			throw new Error("Habitable Zones haven't been calculated")
		}
	}
	/**
	 * estimate the Luminosity based on the mass of the star
	 * @param mass in Solar Mass
	 * @returns luminosity in Solar Luminosity
	 * https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation
	 * https://sites.astro.caltech.edu/~george/ay20/eaa-stellarmasses.pdf
	 * https://books.google.be/books?id=-ljdYMmI0EIC&pg=PA19&redir_esc=y#v=onepage&q&f=false
	 */
	protected static estLuminosityFromMass(mass: number): number{
		let lumin: number
		if (mass < 0.43){
			lumin = (0.23*Math.pow(mass, 2.3))
		} else if (mass < 2) {
			lumin = (Math.pow(mass, 4))
		} else if (mass < 55){
			lumin = (1.4*Math.pow(mass, 3.5))
		} else {
			lumin = (32000*mass)
		}

		return lumin
	}

	protected calcWaveLength(surfaceTemp: number): number{
			return (2.897/surfaceTemp)*10e5 //nm
	}

	/**
	 * 
	 * @param luminosity in Solar Lumin
	 * @param radius in Solar Radius
	 * 
	 * @returns Surface Temp of star in K
	 */
	protected static calcSurfaceTemp(luminosity: number, radius: number){
		const luminSI = luminosity * UNI.SOLAR_LUMINOSITY 
		const radSI = radius * UNI.SOLAR_RADIUS
		const temp = Math.round(Math.pow(luminSI / (4 * Math.PI * Math.pow(radSI, 2) * UNI.STEFAN_BOLTZMANN_CONSTANT), 0.25)*1000)/1000;
		console.log(`calculated surface temp as ${temp}, lumin and radsi ${luminSI}, ${radSI}`)
		return temp
	}
		
	protected calculateStellarFlux(S_effsun: number, surfaceTemp: number ,a: number, b: number, c: number, d: number): number {
			const deltaT = surfaceTemp - 5780;  // Difference from Sun's temperature (Kelvin)
			return S_effsun + 
										a * deltaT + 
										b * Math.pow(deltaT, 2) + 
										c * Math.pow(deltaT, 3) + 
										d * Math.pow(deltaT, 4);
	}

	protected calculateHZDistance(stellarFlux: number): number {
			return Math.sqrt(this.luminosity / stellarFlux);
	}

	// gonna be honest this seems like overkill -> although i like the idea of every star having a hot zone, habitable zone (hot, normal, cold), cold zone
	// relationships between HZ stellar fluxes (Seff) reaching the top of the atmosphere of an Earth-like planet and 
	// stellar effective temperatures (Teff) applicable in the range 2600 K ⩽Teff ⩽ 7200 K
	// CONSERVATIVE : moist-green house - maximum greenhouse
	// OPtimistic : recent Venus - Early Mars
	//https://iopscience.iop.org/article/10.1088/0004-637X/765/2/131/meta
	protected calcHabitableZoneBoundaries(surfaceTemp: number): Record<string,  number> {
			const boundaries = {
							"Recent Venus": {
											S_effsun: 1.7753,
											a: 1.4316e-4,
											b: 2.9875e-9,
											c: -7.5702e-12,
											d: -1.1635e-15
							},
							"Runaway Greenhouse": {
											S_effsun: 1.0512,
											a: 1.3242e-4,
											b: 1.5418e-8,
											c: -7.9895e-12,
											d: -1.8328e-15
							},
							"Moist Greenhouse": {
											S_effsun: 1.0140,
											a: 8.1774e-5,
											b: 1.7063e-9,
											c: -4.3241e-12,
											d: -6.6462e-16
							},
							"Maximum Greenhouse": {
											S_effsun: 0.3438,
											a: 5.8942e-5,
											b: 1.6558e-9,
											c: -3.0045e-12,
											d: -5.2983e-16
							},
							"Early Mars": {
											S_effsun: 0.3179,
											a: 5.4513e-5,
											b: 1.5313e-9,
											c: -2.7786e-12,
											d: -4.8997e-16
							}
			};
			const habitableZones: Record<string,number> = {};

	for (const [key, { S_effsun, a, b, c, d }] of Object.entries(boundaries)) {
			const stellarFluxInner = this.calculateStellarFlux(S_effsun, surfaceTemp,a, b, c, d);
			habitableZones[key] = this.calculateHZDistance(stellarFluxInner)
			
	}

	return habitableZones;
	}
}



/* [α-A-2.1] --------------------------
                        VII - WHITE DWARF
    KEY: It's a little complicated, just trust me bro
-------------------------------------------*/
export class WhiteDwarf extends Star {
	constructor(params: StarParams){
		super(params)
		this.solarMass = params.solarMass ?? randomInteger(1,10)
	}
}