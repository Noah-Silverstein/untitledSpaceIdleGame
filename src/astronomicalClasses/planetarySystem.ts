import { AstronomicalBody, AstronomicalObject, AstronomicalObjectParams, PlanetaryMassObject } from "./baseAstronomicalClasses";
import * as UNI from '../global/globalVars'
import { Planet } from "./planets/planet";
import { Star } from "./stars/stars";
import { GasGiant } from "./planets/gasGiant";
import { getRandomNumberInErrRange, randomInteger, randomNormal, randomSkewedNormal } from "../global/globalFuncts";
import { IceGiant } from "./planets/iceGiant";
import { MiniNeptunian } from "./planets/miniNeptunian";
import { PolarCoordinate } from "./polarCoordinate";
import { SuperTerran } from "./planets/superTerran";
import { Terran } from "./planets/terran";
import { KVStar } from "./stars/mainSequence";
import { Material } from "three";
import { Mineral } from "../materials/materialsMinerals";
/**
 * 
 * STELLAR EVOLUTION IS WHERE 
 * METALLICITY FOR STAR AND PLANET FORMATION: https://en.wikipedia.org/wiki/Metallicity
 *      influences the prevelance of gas/ice giants
 *              https://en.wikipedia.org/wiki/Stellar_evolution#/media/File:Star_Life_Cycle_Chart.jpg
 * 
 * 
 */

/**
 * @param rootBody - The body around which all Bodies orbit in the PlanetarySystem
 * @param titiusBode = the function that governs the planetary spacing (orbital distance)
 * @param astronomicalBodies - (optional) The bodies in the system 
 */
interface PlanetarySystemParams extends AstronomicalObjectParams {
    rootBody: AstronomicalBody
    titiusBode: (plnumber: number) => number
    astronomicalBodies?: Record<string, AstronomicalBody> 
}

export class PlanetarySystem extends AstronomicalObject {
    public systemAstronomicalBodies: Record<string, AstronomicalBody> = {}
    public rootBody: AstronomicalBody 
    public titiusBode: (plnumber: number) => number //formula governing the spacing of the planets
    //minimum from MIMAS <--------- figure a better way out later?

    constructor(params: PlanetarySystemParams){
        super(params)
        this.rootBody = params.rootBody //set rootBody
        this.addBodyToSystemBodies(this.rootBody)   //add rootBody to the list of systemBodies
        this.titiusBode = params.titiusBode
        if(params.astronomicalBodies){
            this.systemAstronomicalBodies = params.astronomicalBodies
            this.checkBodiesParentage()
        }
        
    }

    protected static genRandomSysName(): string{
        return 'randomsys' + randomInteger(1,1000)
    }
    
    /**
     * Check that all bodies have a parent and that all parent bodies are in the system
     */
    protected checkBodiesParentage(){
        const systemBodies = Object.values(this.systemAstronomicalBodies)
        systemBodies.forEach(body => {
            const parentName = body.getParentBodyName()
            if (parentName){    //check if parentbody exists
                if(!(parentName in this.systemAstronomicalBodies)){ //check parentBody is in list
                    console.warn("parentBody: ", parentName, " not added to System")
                }
            } else {
                console.warn("Body: ", body, " has no ParentBody")
            }
        })
    }


    protected static estHillRadius(mass: number, estimatedDistance: number ,parentBody: Planet){
        return estimatedDistance * Math.pow(mass / (3 * parentBody.mass), (1/3))
    }
    
    
   
    /**
     * Adds an astronomical body to the system if it doesn't already exist.
     * @param body - The astronomical body to add.
     * @returns true if the body was added, false if it already exists.
     */
    private addBodyToSystemBodies(body: AstronomicalBody){
        if (!this.systemAstronomicalBodies[body.name]){
            this.systemAstronomicalBodies[body.name] = body
        }
        console.log(`Body with name ${body.name} already exists.`); 
    }
    /**
     * Adds all passed body and satellites to the System and makes sure all parentBodies & Satellites have their info updated.
     * won't add if the body already exists
     * @param body 
     * @param parentBody 
     * @param satellites 
     */
    public addAndUpdateBody(body: AstronomicalBody, parentBody: AstronomicalBody, satellites: AstronomicalBody[]){
        //first make sure everything is set Correctly
        !body.getParentBodyName() ? body.setParentBody(parentBody) : 'dummy'    
        body.addNaturalSatellites(satellites)
        satellites.forEach(sat => sat.setParentBody(body))  
        parentBody.addNaturalSatellites(body)
        this.addBodyToSystemBodies(body)
        satellites.forEach(sat => this.addBodyToSystemBodies(sat))
    }

    public addPlanet(planet: PlanetaryMassObject, parentBody: AstronomicalBody){
        parentBody.addNaturalSatellites(planet)     //add planet to parentBody Satellites
        planet.setParentBody(parentBody)            //set the parent body of the planet to the passed parentBody
        this.systemAstronomicalBodies[planet.name] = planet //add the planet to the Record
    }

    public getBody(name:string){
        return this.systemAstronomicalBodies[name]
    }

    public getRootBody(): AstronomicalBody {
        if (!this.rootBody) {
            throw new Error("Root body has not been initialized.");
        }
        return this.rootBody;
    }
    

    public getStars(): Star[] {
        return this.getBodies().filter(body => body instanceof Star) as Star[];
    }

    public getPlanets(): Planet[] {
        return this.getBodies().filter(body => body instanceof Planet) as Planet[];
    }

    public getBodies(){
        return Object.values(this.systemAstronomicalBodies)
    }

}
