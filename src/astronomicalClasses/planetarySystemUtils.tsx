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
import { MAX_ORBITAL_RADIUS } from "./globalVars.ts";
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
    name?: string;
    position?: PolarCoordinate //radius, theta: angle from the Z-axis (0° to 180°), phi: angle in the X-Y plane ( 0° to 360°).

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
    public name: string
    public position?: PolarCoordinate

    constructor(params: AstronomicalObjectParams = {}){
        this.name = params.name ?? "Celestial Object"
        this.position = params.position ?? {r:0, t:0, p:0}
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
    mass?: number;
    radius?: number;
    naturalSatellites?: AstronomicalBody[];
    parentBody?: AstronomicalBody;
}

/**
 * Represents an astronomical body such as a planet, moon, star, blackhole
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
    public mass: number | undefined = undefined;
    public radius: number | undefined = undefined;
	public naturalSatellites: AstronomicalBody[] = []; //redundant declaration but kept for readability 
	public parentBody: AstronomicalBody | undefined = undefined

    constructor(params: AstronomicalBodyParams){
        super(params)
        this.mass = params.mass      
        this.radius = params.radius
		this.naturalSatellites = params.naturalSatellites ?? [];
		this.parentBody = params.parentBody 
    }
	/**
     * Adds one or more natural satellites (e.g., moons, or planet) to this astronomical body.
     * 
     * @param {AstronomicalBody[] | AstronomicalBody} satelliteBodies - A single satellite or an array of satellites to be added to this body.
     */
	public addNaturalSatellites(satelliteBodies:AstronomicalBody[] | AstronomicalBody){
		if(Array.isArray(satelliteBodies)){
			for (const satellite of satelliteBodies) {
                satellite.parentBody = this; // Set the parent
                this.naturalSatellites.push(satellite);
			}
		} else {
			satelliteBodies.parentBody = this; // Set the parent
            this.naturalSatellites.push(satelliteBodies);
		}
	}

	/**
     * Sets the parent body that this astronomical body orbits.
     * 
     * @param {AstronomicalBody} body - The parent body (e.g., a star or planet) that this body will orbit.
     */
	public setParentBody(body:AstronomicalBody){
		if (this.parentBody){
			console.log(`___WARNING: OVERWRITING PARENTBODY! CURRENT PARENTBODY: ${this.parentBody} WILL GET OVERWRITTEN`)
		}
		this.parentBody = body
	}

    /**
     * Calculates the hill radius of the Body with respect to the parentBody
     * @returns The Hill radius in AU
     */
    protected calculateHillRadius(): number {
        // Hill radius formula
        if (this.parentBody){
            if(this.parentBody.mass && this.parentBody.mass> 1 && this.mass && this.mass > 1){
                if(this.position && this.position.r > 0){
                    return this.position.r * Math.pow(this.mass / (3 * this.parentBody.mass), (1/3))
                } else {
                    console.log(`${this.name} does not have a position OR it's orbital radius = 0. HillRadius is set to MAX_ORBITAL_RADIUS`)
                    return MAX_ORBITAL_RADIUS
                }
            } else {
                throw new Error("ParentBody or This Body has no mass")
            }
        } else {
            throw new Error("Can't calculate hillRadius if no ParentBody");
        }   
    }
    /**
     * Given A satellite body with mass and radius check what the minimum distance that body has to be in
     * order not to not get destroyed by tidal forces
     * @param {AstronomicalBody} satellite 
     * @returns The Roche Limit for the given satellite for THIS body
     */
    protected calculatedRocheLimit(satellite: AstronomicalBody):number{
        if(this.mass && this.mass > 1 && satellite.mass && satellite.mass > 1 && satellite.radius){
            return satellite.radius*Math.pow(2*this.mass/satellite.mass, 1/3)
        } else {
            throw new Error("Mass for primary or satellite doesn't exist OR satellite has no radius")
        }
    }
}

/* [α-A-1] ----------------------
        PLANETARY MASS OBJECT 
KEY: 1. Never generated nuclear fusion chain reaction
     2. shape determined by gravity (idk?)
purpose is to group all planet 'types' together ( planets, planetary-scale Satellites, unbound planets )
MOONS, PLANETS, ASTEROIDS, ...
-----------------------*/
export class PlanetaryMassObject extends AstronomicalBody{
    //what methods and variables make sense here?
    constructor(params: PlanetaryMassParams){
        super(params);
    }

}

export class PlanetaryScaleSatellite extends AstronomicalBody{
    constructor(params: PlanetaryMassParams){
        super(params)
    }
}


