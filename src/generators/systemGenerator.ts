import { KVStar, Star } from "../astronomicalClasses/Stars";
import { randomInteger } from "../astronomicalClasses/globalFuncts";
import { AstronomicalBody, AstronomicalObject, AstronomicalObjectParams } from "../astronomicalClasses/planetarySystemUtils";
import { MiniTerran, Planet, Terran } from "../astronomicalClasses/plannetClasses";
import { PolarCoordinate } from "../astronomicalClasses/polarCoordinate";


interface PlanetarySystemParams extends AstronomicalObjectParams {
    astronomicalBodies?: Record<string, AstronomicalBody> 
}

export class PlanetarySystem extends AstronomicalObject {
    public systemAstronomicalObjects: Record<string, AstronomicalBody> 
    public rootBody: AstronomicalBody | undefined = undefined

    constructor(params: PlanetarySystemParams){
        super(params)
        this.systemAstronomicalObjects = params.astronomicalBodies ?? {}
        this.genPlanetarySystem()
    }

    genPlanetarySystem(){
        //make star
        let star = KVStar.genRandom()
        console.log('kvstar', star)
        this.rootBody = star
        //add star to system bodies
        this.systemAstronomicalObjects[star.name] = star
        //gen planets and add to record
        for (let i = 0; i < randomInteger(1, 5); i++) {
            //create position for new planet
            let pos = new PolarCoordinate((randomInteger(10,20)*i/10) + 0.5, 0, randomInteger(0,6))
            //create planet
            const pl = Terran.genRandom(star, pos)
            //make planet satellite of star
            star.addNaturalSatellites(pl)
            //add planet to system bodies
            this.systemAstronomicalObjects[pl.name] = pl
            //create a moon?
            if (randomInteger(0,10) < 3){
                let moonPos = new PolarCoordinate(0.5,0,0)
                let moon = MiniTerran.genRandom(pl, moonPos, 'MOON' + i)
                pl.addNaturalSatellites(moon)
                this.systemAstronomicalObjects[moon.name] = moon
                moon.orbitalPeriod = randomInteger(100, 500)
            }

            
          }

    }

    public getBody(name:string){
        return this.systemAstronomicalObjects[name]
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
        return Object.values(this.systemAstronomicalObjects)
    }

}
