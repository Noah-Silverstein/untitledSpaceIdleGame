/*	NOTES ON CLASSIFICATIONS -------------------------------------


https://en.wikipedia.org/wiki/Planetary-mass_object
https://en.wikipedia.org/wiki/Star
https://en.wikipedia.org/wiki/Astronomical_object
https://en.wikipedia.org/wiki/Planet
https://www.astronomy.com/wp-content/uploads/sites/2/2024/03/DICK-Astronomys-82-Classes.pdf


--------PLANETS/MOONS AND SUCH-----------
suprisingly (or not?) there doesn't seem to be a universally agreed upon classification system for celestial bodies.
I've hacked together one here based on what I think makes the most sense for my project which might lead to some strange outcomes.
IAU has one for the solar system but I don't know if that will make sense in my project. I've mostly based this on this wiki
https://en.wikipedia.org/wiki/Geophysical_definition_of_planet based on this paper https://www.cambridge.org/core/journals/highlights-of-astronomy/article/regarding-the-criteria-for-planethood-and-proposed-planetary-classification-schemes/74EDC68601BE8BAA0C5D6EE89C869B4F
The paper ends on this quote which I think is fitting
    Just because your doctor has a name for your condition, doesn't mean he knows
    what it is. -Franz Kafka

Important to note that classification is based on geophysical properties of planetarybodies. (doesn't cover stars, galaxies, black holes, etc...)

------------STARS AND SUCH--------------------
https://en.wikipedia.org/wiki/Hertzsprung%E2%80%93Russell_diagram
Harvard spectral classification && Yerkes spectral classification   ->   https://en.wikipedia.org/wiki/Stellar_classification	
I haven't researched this too much but I'm just freeballing this based on MK (and spectral classes maybe?)
ranges are based on the diagram on this site http://www.atlasoftheuniverse.com/startype.html

*/
import { randomInteger } from "../global/globalFuncts.ts";
import * as UNI from "../global/globalVars.ts";
import { PolarCoordinate } from "./polarCoordinate.ts";


/**
 * 
 * BUILDING BLOCKS OF THE WORLD
 * 
 */


/*
        INTERFACES
  ? makes property optional to pass for creating object and allows for randomly generating bodies based on whatever values get passed
  
*/
//α  
export interface AstronomicalObjectParams {
    name: string;
    position: PolarCoordinate //radius, theta: angle from the Z-axis (0° to 180°), phi: angle in the X-Y plane ( 0° to 360°).

}
//α-A-1
export interface PlanetaryMassParams extends AstronomicalBodyParams {  

}


/* [α] --------------------------  
                ASTRONOMICAL OBJECT 
  KEY: Any object or group of objects in the universe
  (ex: planets, galaxies, nebulae, stars, blackholes, double planets, comets, ...)
-----------------------------------*/
export abstract class AstronomicalObject {
    //** REQUIRED **//
    name: string;
    position: PolarCoordinate;

    constructor(params: AstronomicalObjectParams){
        //** ASSIGN PROPERTIES **//
        this.name = params.name 
        this.position = params.position 
    }
}


/* [α-A] ----------------------------
        ASTRONOMICAL BODY
  KEY: single, tightly bound, somewhat? contiguous entity
no: galaxies, nebulae, clouds, rings, star clusters, planetary systems
yes: planets, stars, moons, black holes, yo mama
-> HAS TO HAVE MASS
-----------------------------*/
//α-A
export interface AstronomicalBodyParams extends AstronomicalObjectParams {
    realMass: number;
    realRadius: number;
    naturalSatellites?: AstronomicalBody[];
    parentBody?: AstronomicalBody;
}
export type WithoutRealValues<T> = Omit<T, 'realMass' | 'realRadius'>;

/**
 * Represents an astronomical body such as a planet, moon, star, blackhole, any discrete astronomical object
 *
 * @class AstronomicalBody
 * @extends AstronomicalObject
 * @param {AstronomicalBodyParams} params - Parameters for configuring the astronomical body.
 * @param {number} [params.mass=undefined] - The mass of the astronomical body in kilograms. Defaults to 0.
 * @param {number} [params.radius=0] - The radius of the astronomical body in meters. Defaults to 0.
 * @param {AstronomicalBody[]} [params.naturalSatellites=[]] - An array of natural satellites (e.g., moons) orbiting the astronomical body. Defaults to an empty array.
 * @param {AstronomicalBody} [params.parentBody] - The parent astronomical body that this body orbits (e.g., a planet orbits a star, a moon orbits a planet). Optional.
 */

export abstract class AstronomicalBody extends AstronomicalObject{
    //** REQUIRED INIT ARG **//
    public mass: number;
    public radius: number;
    //** OPTIONAL INIT ARG **//
	public parentBody: AstronomicalBody | undefined = undefined
	public naturalSatellites: AstronomicalBody[]; 
    //** REQUIRED ARGS **/
    public density: number = 0

    //** CALCULATED **//
    public hillSphere: number = 0

    constructor(params: AstronomicalBodyParams){
        super(params)
        //** ASSIGN PROPERTIES **//
        this.mass = params.realMass      
        this.radius = params.realRadius
        //** ASSIGN OPTIONAL PARAM PROPERTIES **//
        this.parentBody = params.parentBody 
        params.naturalSatellites ? this.naturalSatellites = params.naturalSatellites : this.naturalSatellites = []
        //** CALCULATE PROPERTIES **//
         
    }
	/**
     * Adds one or more natural satellites (e.g., moons, or planet) to this astronomical body.
     * @param {AstronomicalBody[] | AstronomicalBody} satelliteBodies - A single satellite or an array of satellites to be added to this body.
     */
	public addNaturalSatellites(satelliteBodies:AstronomicalBody[] | AstronomicalBody){
		if(Array.isArray(satelliteBodies)){
			for (const satellite of satelliteBodies) {
                if(!this.naturalSatellites.includes(satellite)){    //only add if not already a satellite
                    this.naturalSatellites.push(satellite);
                }
			}
		} else if(!this.naturalSatellites.includes(satelliteBodies)){    //only add if not already a satellite
            this.naturalSatellites.push(satelliteBodies);
        
		}
	}

	/**
     * Sets the parent body that this astronomical body orbits.
     * @param {AstronomicalBody} body - The parent body (e.g., a star or planet) that this body will orbit.
     */
	public setParentBody(body: AstronomicalBody) {
        if (!this.parentBody) { // Check if parentBody is undefined
            this.parentBody = body;
            //console.log(`Parent body set to ${body.name} for ${this.name}.`);
        } else if (this.parentBody === body) { // Use strict equality
            console.log(`Parent body for ${this.name} is already set to ${body.name}.`);
        } else { // If parentBody is different, warn about overwriting
            console.warn(`___WARNING: OVERWRITING PARENT BODY FOR ${this.name}! CURRENT PARENT BODY: ${this.parentBody.name} WILL GET OVERWRITTEN___`);
            this.parentBody = body; // Update to new parent body
        }
    }

    /**
     * Gets the name of the parentBody or returns false
     * @returns the parent body name or null
     */
    public getParentBodyName(): string | undefined  {
            if (this.parentBody)
                return this.parentBody.name
    }

    /**
     * Calculates the hill radius of the Body with respect to the parentBody
     * @returns The Hill radius in AU
     * Hill radius stable orbits are within 0.33.. _ 0.5 https://en.wikipedia.org/wiki/Hill_sphere
     */
    protected calculateHillRadius(parentRealMass: number): number {
        if (this.position.r != 0){
           return this.position.r*(Math.pow(this.mass/(3*parentRealMass), 1/3))
        } else {
            console.log("__ERROR__in calculate hill radius for: ", this.name)
            return 0
        }
    }
    /**
     * Given A satellite body with real mass and real radius check what the minimum distance that body has to be, in
     * order not to get destroyed by tidal forces
     * @param {number} satelliteRealMass - The Real Mass (in Kg) of the satellite 
     * @param {number} satelliteRealRadius - The Real Radius (in Km) of the satellite
     * @returns The Roche Limit for the given satellite for THIS body in AU
     */
    public calcRigidRocheLimit(satelliteRealMass: number, satelliteRealRadius: number): number{
        if(this.mass && this.mass > 1 && satelliteRealMass > 1){
            let rochelimit = satelliteRealRadius*Math.pow(2*this.mass/satelliteRealMass, 1/3)
            return (rochelimit/UNI.ASTRO_UNIT)
        } else {
            throw new Error("Mass for primary or satellite doesn't exist OR satellite has no radius")
        }
    }


}

export class FreeFloatingDummy extends AstronomicalBody{
    constructor(params: AstronomicalBodyParams){
        super(params)
    }

    static genDummy(){
        return new FreeFloatingDummy({
            realMass: 0,
            realRadius: 0,
            name: "FreeFloatingDummy" + randomInteger(1,1000),
            position: new PolarCoordinate(Infinity, 0, 0)
        })
    }
}


/* [α-A-1] ----------------------
        PLANETARY MASS OBJECT 
KEY: 1. Never generated nuclear fusion chain reaction
     2. shape determined by gravity (idk?)
purpose is to group all planet 'types' together ( planets, planetary-scale Satellites, unbound planets )
MOONS, PLANETS, , ...
-----------------------*/
export class PlanetaryMassObject extends AstronomicalBody{
    //what methods and variables make sense here?
    public radius: number //REAL VALUE
    public volume: number
    public density: number
    
    constructor(params: PlanetaryMassParams){
        super(params);
        this.radius = params.realRadius
        this.volume = (4 / 3) * Math.PI * Math.pow(this.radius, 3);
        this.density = this.mass/this.volume
    }

    
    protected estFluidRocheLimit(satellite: AstronomicalBody): number{
        if(this.density && satellite.density){
            return 2.44*this.radius*Math.pow(2*this.density/satellite.density, 1/3)
        } else {
            console.warn("estimating Fluid Roche Limit Failed because undefined density: ", this.density, satellite.density )
            return 0
        }
    }

}


