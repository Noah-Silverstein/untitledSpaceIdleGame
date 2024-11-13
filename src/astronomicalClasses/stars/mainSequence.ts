import * as UNI from '../../global/globalVars'
import { generateStarName, Star, StarParams } from './stars';
import { getRandomInRange, randomInteger } from "../../global/globalFuncts";
import { PolarCoordinate } from '../polarCoordinate';


//---------------------------------------------- MAIN SEQUENCE STARS -----------------------------------------------

interface MainSequenceParams extends StarParams{
	spectralType: string
}

class MainSequenceStar extends Star {
	public spectralType: string;
	public luminosityClass: string = 'V';

	constructor(params: MainSequenceParams){
		super(params)
		this.spectralType = params.spectralType
		this.planetLikelyhoodRange = UNI.MAIN_SEQUENCE_PLANET_LIKELIHOOD[this.spectralType];
		this.planetOdds = UNI.ODDS_FOR_PLANET_MSQ
	}
	//-------------------just random shit------------------
	public static genRandom(): MainSequenceStar {
		const spectralType = 'K-type'
		const mss = randomInteger(1,10);
		const lumin = this.estLuminosityFromMass(mss)
		const rdius = Math.pow(mss,0.8)
		const srfaceTemp = this.calcSurfaceTemp(lumin, rdius)
		const nme = 'V' + generateStarName()

		return new MainSequenceStar({
			
			name:nme,
			spectralType: spectralType,
			position: new PolarCoordinate(0,0,0),
			solarMass:mss,
			solarRadius:rdius,
			luminosity: lumin,
			surfaceTemp:srfaceTemp,

		})
	}
	
}


//-------------------------------------- A-TYPE -------------------------------------

interface AVStarParams extends Omit<MainSequenceParams, 'spectralType'>{
}

export class AVStar extends MainSequenceStar {
    public massRange:[number, number] = [1.4, 2.1]

	constructor(params:AVStarParams){
		super({
			spectralType: 'aType',
			...(params.name ? {name: params.name}: {name: ('A-type' + 'MSQ' + generateStarName())}),
			...params
		})
	}
}

//--------------------------------------------------- G-TYPE -------------------------------------

interface GVStarParams extends Omit<MainSequenceParams, 'spectralType'>{
	
}
/**
 * Represents a G-type main-sequence star (G-V), a specific type of star in the Hertzsprung-Russell diagram.
 * Extends the MainSequenceStar class.
 *
 * @class GVStar
 * @extends MainSequenceStar
 * @param {MainSequenceStar} params - Parameters for configuring the G-V star.
 * @param {number} [params.mass] - The mass of the G-V star, in solar masses (L☉), which is constrained between 0.6 and 0.9. If no value is provided, a random value in this range is selected.
 * @param {number} [params.luminosity] - The luminosity of the star, relative to the Sun's luminosity (L☉). Optional, as it is derived from mass.
 * @param {number} [params.surfaceTemp] - The surface temperature of the star, in Kelvin. Optional, as it is derived from mass.
 * @param {AstronomicalBody[]} [params.naturalSatellites] - An array of natural satellites (e.g., planets) orbiting the star. Optional.
 * @param {string} [params.name] - The name of the star. If no name is provided, a name is generated based on its type.
 */

export class GVStar extends MainSequenceStar {
	 protected static massRange: [number, number] = [0.9, 1.1]

	constructor(params: GVStarParams){
		//pass spectral Type and naming through to parent class
		super({
			spectralType: 'gType',
			...params	
			//params required: solarmass, solarradius, position, luminosity, surfaceTemp
		})
	}
	/**
	 * 	Generate G-type Main Sequence Star
	 * @param genName Name of the star. Optional
	 * @returns G-Type V Star mass in Solar Mass, Radius in Solar Radius , 
	 * Luminosity in Solar Luminosity Surface Temp in Kelvin
	 * 
	 */
	static genRandom(genName?:string): GVStar {
		const mss = getRandomInRange(this.massRange[0], this.massRange[1]) //sizes hard coded from source https://en.wikipedia.org/wiki/Stellar_classification#Harvard_spectral_classification
		const lumin = this.estLuminosityFromMass(mss) //in solar lumin
		const rdius = Math.pow(mss,0.8)
		const srfaceTemp = this.calcSurfaceTemp(lumin, rdius)
		const nme = genName ?? ('G-type_' + '_MSQ_' + generateStarName())

		return new GVStar({
			solarMass:mss,
			luminosity: lumin,
			solarRadius:rdius,
			surfaceTemp:srfaceTemp,
			name:nme,
			position: new PolarCoordinate(0,0,0)

		})
	}

    static genSol(): GVStar{
        return new GVStar({
			solarMass: 1,
			luminosity: 1,
			solarRadius: 1,
			surfaceTemp: this.calcSurfaceTemp(1, 1),
			name:'Sol',
			position: new PolarCoordinate(0,0,0)

		})
    }

	
}
//--------------------------------------------------- K-TYPE -------------------------------------

interface KVStarParams extends Omit<MainSequenceParams, 'spectralType'>{
	
}
/**
 * Represents a K-type main-sequence star (K-V), a specific type of star in the Hertzsprung-Russell diagram.
 * Extends the MainSequenceStar class.
 *
 * @class KVStar
 * @extends MainSequenceStar
 * @param {MainSequenceStar} params - Parameters for configuring the K-V star.
 * @param {number} [params.mass] - The mass of the K-V star, in solar masses (L☉), which is constrained between 0.6 and 0.9. If no value is provided, a random value in this range is selected.
 * @param {number} [params.luminosity] - The luminosity of the star, relative to the Sun's luminosity (L☉). Optional, as it is derived from mass.
 * @param {number} [params.surfaceTemp] - The surface temperature of the star, in Kelvin. Optional, as it is derived from mass.
 * @param {AstronomicalBody[]} [params.naturalSatellites] - An array of natural satellites (e.g., planets) orbiting the star. Optional.
 * @param {string} [params.name] - The name of the star. If no name is provided, a name is generated based on its type.
 */

export class KVStar extends MainSequenceStar {
	public massRange: [number, number] = [0.6, 0.9]

	constructor(params:KVStarParams){
		//pass spectral Type and naming through to parent class
		super({
			spectralType: 'kType',
			...params	
			//params required: solarmass, solarradius, position, luminosity, surfaceTemp
		})
	}
	/**
	 * 	Generate K-type Main Sequence Star
	 * @param genName Name of the star. Optional
	 * @returns K-Type V Star mass in Solar Mass, Radius in Solar Radius , 
	 * Luminosity in Solar Luminosity Surface Temp in Kelvin
	 * 
	 */
	static genRandom(genName?:string): KVStar {
		const mss = randomInteger(100*UNI.K_TYPE_MAIN_SEQUENCE_MASS_LOWERBOUND, 100*UNI.K_TYPE_MAIN_SEQUENCE_MASS_UPPERBOUND)/100 //sizes hard coded from source https://en.wikipedia.org/wiki/Stellar_classification#Harvard_spectral_classification
		const lumin = this.estLuminosityFromMass(mss) //in solar lumin
		const rdius = Math.pow(mss,0.8)
		const srfaceTemp = this.calcSurfaceTemp(lumin, rdius)
		const nme = genName ?? ('K-type_' + '_MSQ_' + generateStarName())

		return new KVStar({
			solarMass:mss,
			luminosity: lumin,
			solarRadius:rdius,
			surfaceTemp:srfaceTemp,
			name:nme,
			position: new PolarCoordinate(0,0,0)

		})
	}

	
}