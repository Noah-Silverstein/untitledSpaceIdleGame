import { AstronomicalBody, AstronomicalObject, AstronomicalObjectParams } from "./baseAstronomicalClasses";
import * as UNI from './globalVars'
import { Planet } from "./planet";
import { KVStar, Star } from "./stars";
import { GasGiant } from "./gasGiant";
import { getRandomNumberInRange, randomInteger, randomNormal, randomSkewedNormal } from "./globalFuncts";
import { IceGiant } from "./iceGiant";
import { MiniNeptunian } from "./miniNeptunian";
import { PolarCoordinate } from "./polarCoordinate";
import { SuperTerran } from "./superTerran";
import { Terran } from "./terran";


interface PlanetarySystemParams extends AstronomicalObjectParams {
    rootBody: AstronomicalBody
    titiusBode: (plnumber: number) => number
    astronomicalBodies?: Record<string, AstronomicalBody> 
}

export class PlanetarySystem extends AstronomicalObject {
    public systemAstronomicalBodies: Record<string, AstronomicalBody> 
    public rootBody: AstronomicalBody 
    public titiusBode: (plnumber: number) => number //formula governing the spacing of the planets


    constructor(params: PlanetarySystemParams){
        super(params)
        this.rootBody = params.rootBody
        this.titiusBode = params.titiusBode
        this.systemAstronomicalBodies = params.astronomicalBodies ?? {}
        
    }

    protected static genRandomSysName(): string{
        return 'randomsys' + randomInteger(1,1000)
    }
    
    

    //mass period ratio from -> https://academic.oup.com/mnrasl/article/449/1/L65/1027741#431665833
    //ADJACENT PLANET MASS PERIOD RATIO
    //alpha is probably 0.5
    //C can vary from 0.5-1.5 or larger, I believe closer to 1 for planets of similar size 0.5-0.7 for terran-jovian, 
    // for 2 larger planets C may be larger than 1 but mostle hover around 1
    /*
    function calculatePeriodRatio(P1: number, M1: number, M2: number, C: number = 1, alpha: number = 1): number {
    return P1 * C * Math.pow(M2 / M1, alpha);
}   
    MOONS are about max 1/25 -> 0.04 ParentMass

    */
    protected static PLANET_TYPES = [Terran, SuperTerran , MiniNeptunian, IceGiant, GasGiant ]

    protected static getNextOrbitDistance(prevPlanet: Planet, C: number = 0.5, K: number = 1.5): number {
        const hillRad = prevPlanet.hillRadius ? prevPlanet.hillRadius : 0
        const logarithmicDistance = prevPlanet.orbitalDistance + C * Math.log(K * prevPlanet.orbitalDistance + 1);
    
        // Ensure the next distance is at least the Hill Sphere distance apart
        return Math.max(logarithmicDistance, prevPlanet.orbitalDistance + hillRad);
    }
    /**
     * 
     * @param planet 
     * 
     * moons are more likely as you get further from earth 
     * larger planets have more moons
     */

    // scaling formula visualizer: https://www.desmos.com/calculator/auubsajefh
    
    protected static chanceForMoonBasedOnDistanceFromStar(distanceAU: number): number {
            // Rough ranges for moon formation:
        if (distanceAU <= 0.1) {
            return  0; // Within Roche limit or very close to star
        } else if (distanceAU > 0.1 && distanceAU <= 0.5) {
            return 0.1; // Very low chance due to strong star gravity and tidal forces
        } else if (distanceAU > 0.5 && distanceAU <= 2) {
            // Gradually increase from 0.2 to 0.8
            return 0.2 + (0.6 * (distanceAU - 0.5) / 1.5);
        } else if (distanceAU > 2 && distanceAU <= 5) {
            // High chance region, linearly increasing from 0.7 to 0.9
            return 0.7 + (0.2 * (distanceAU - 2) / 3);
        } else if (distanceAU > 5) {
            // Beyond 5 AU, the chance is essentially tied to planet mass
            return 0.9
        } else {
            throw new Error("I don't know how but chance for moon on distance, distance is out of bounds")
        }
    }

    protected static estHillRadius(mass: number, estimatedDistance: number ,parentBody: Planet){
        return estimatedDistance * Math.pow(mass / (3 * parentBody.mass), (1/3))
    }
    
    //problems with this algorithm is it doesn't create truly variable moon spacing 
    //maybe add a variable spacing factor somewhere
    //also doesn't account for mass. it kinda does through hill Sphere increasing as mass increases which creates more space for moons
    //but maybe at a chance bonus for larger planets (like halfway through minineptunes or from icegiants onwards)
    //maybe also allow more moons for larger planets and less for smaller
    // the Chance to make a moon is the chance based on distance AND then an increasing (10%) per added GEN_DISTANCE_STEP 
    protected static genMoons(pl:Planet){
        const moons = []
        const MOON_GEN_DISTANCE_STEP = 0.002
        //debugger
        if (pl.hillRadius){
            //from wiki hillsphere -> stable orbits from 0.33-0.5
            const moonPlacementRange = [pl.hillRadius/3, pl.hillRadius/2]

            let genNewMoon = true
            let distanceMoonChance = this.chanceForMoonBasedOnDistanceFromStar(pl.orbitalDistance)

            let availableMoons = 5 //<------------------------CHANGE TO DEPEND ON PARENT MASS
            let startOrbit = getRandomNumberInRange(moonPlacementRange[0], moonPlacementRange[0]*0.1) //randomize the start orbit a little

            //this can change based on available mass and total moons created
            let moonGenChance = 0.9 //initial moon gen chance is 50%
            let availableMass = pl.earthMass * UNI.AVAILABLE_MASS_FOR_MOONS_FRACTION //calc total mass remaining for moon creation
            //while genmoon is true and you still have more moons
            while (genNewMoon && availableMoons > 0){
                let moonProb = randomInteger(0,10)/10
                //if the odds are in your favor 
                if((distanceMoonChance> moonProb) && (moonGenChance > moonProb)){      
                    //gen a Mass for a moon
                    let posMoonMass = availableMass*Math.random()
                    let moonMass = Math.max(UNI.MINIMUM_MOON_MASS, posMoonMass)
                    //est the hill radius for spacing purposes
                    let estimatedHillRadius = this.estHillRadius(moonMass, startOrbit, pl) + UNI.MOON_SPACING_SAFETY_OFFSET
                    //use the estimated radius and add it to the start orbit
                    let pos = new PolarCoordinate(startOrbit + estimatedHillRadius, 0,0)
                    //create the moon
                    let moon = Planet.genRandomFromMass({
                                                    planetTypes: this.PLANET_TYPES, 
                                                    earthMass: moonMass, 
                                                    parentBody: pl, 
                                                    position:pos, 
                                                    name: pl.name+'-MOON-'+randomInteger(1e4,1e5)
                                                })
                    // add the moon to your list of moons
                    moons.push(moon)
                    //update your variables
                    availableMass -= moonMass   //remove mass from total mass
                    startOrbit = (moon.hillRadius + moon.position.r) // set up the next start orbit (this can be close since the GEN_DISTANCE_STEP is added after this)
                    moonGenChance = 0 //reduce the chance to create a moon to the chance based on distance
                    availableMoons -= 1 //remove total available moons
                }
                //if no more space or mass you can't make new moons
                if (startOrbit >= moonPlacementRange[1] || availableMass <= 0) {
                    genNewMoon = false
                } 
                // update your variables 
                moonGenChance += 0.1    //for every step through the moon range increase the chance of a moon by 10%
                startOrbit += MOON_GEN_DISTANCE_STEP
            }

        }  
        return moons
    }


    /**
     * 
     * 
     * FOR PLANET PLACEMENT IF YOU COULD FIGURE OUT THIS PAPER IT MIGHT HELP
     * https://academic.oup.com/mnras/article/435/2/1126/1034567?login=false#18477434
     * 
     * for a given distance return a mass 
     * the mass will depend on distance from the sun closer distances will return smaller masses more frequently
     * larger distances will return larger mass more frequently, until a point X where the relation switches back
     * NOTES ON REALSTIC DISTANCES;
     * this is underdetermined afai could find out, which means i've mostly chosen values that produce somewhat interesting outcomes
     * for larger masses i've set the minimum distance from star to around 0.02AU (hot jupiter) otherwise I use roche limits, hillsphers and 
     * a safety offset
     */

    //based on Two Factor Titus Boyd (factor C is my best guess); this paper holds the secret and if i understood it I would implement its methods
    //https://academic.oup.com/mnras/article/435/2/1126/1034567?login=false#sec5-4
    /**
     * 
     * 
     */

    //spacing does not determin chance for planet appearing (the spacing can be used to determine location of asteroid belts)
    protected static genTwoParamTitiusBode(firstPlanetDistance: number): (plnumber: number) => number{
        return (plnumber:number): number =>  {
            return firstPlanetDistance*Math.pow(randomNormal(UNI.TITUS_BOYD_MEAN_FACTOR,UNI.TITUS_BOYD_STD_DEV), plnumber)
        }
    }

    protected static massFromTitusBode(distance: number){
        const maximumPlMass = 0
        const minimumPlMass = 0
        const meanMass = 2*distance
        const lowerStdDev = 0.5*meanMass

        const upperStdDev = 0.25*meanMass*distance
    }

    
    //for now hard code planet masses 
    //closest to sun between 0.8-1-0.5 skewed

    public static genRandKtypeSys(name?:string): PlanetarySystem {
        const plSysName = name ?? this.genRandomSysName()
        const astronomBodies: Record<string, AstronomicalBody> = {}
        const star = KVStar.genRandom()
        //add the star
        
        astronomBodies[star.name] = star
        //calc the initial planet distance (this is )
        const randInitialDist = Math.max(randomSkewedNormal(UNI.INITIAL_PLANET_STAR_MEAN_OFFSET,UNI.INITIAL_PLANET_DIST_STD_DEV_LEFT,UNI.INITIAL_PLANET_DIST_STD_DEV_RIGHT), 0)
        //generate the TitiusBode for planet spacing using the initial position regardless of if the planet is going to be created or not
        const TB = this.genTwoParamTitiusBode(randInitialDist)
        //gen the appropriate planet based on calculated orbit
        let polarCoo = new PolarCoordinate(randInitialDist, Math.random()*Math.PI, 0)
        //CHANGE THE MASS GEN FOR CLOSE TO STAR<-------------TODO
        let initPlanet: Planet | null = Planet.genRandomFromMass({
                                                planetTypes: this.PLANET_TYPES,
                                                earthMass: Math.max(randomSkewedNormal(0.03,0.01,0.1), UNI.MINIMUM_PLANET_MASS), //<------MASSES ARE NOW HARDCODED!!!!!!
                                                position: polarCoo,
                                                parentBody: star
                                                })
        //planet only gets a chance if it doesn't violate the rochelimit
        if(randInitialDist > star.calcRigidRocheLimit(initPlanet)){
            //if the odds are in your favor
            if (star.getPlanetOdds(randInitialDist) >= Math.random()){
                //create the planet - no moons for the first planet
                star.addNaturalSatellites(initPlanet)
                astronomBodies[initPlanet.name] = initPlanet
            } else {
                //planet didn't survive the hardcoded odds
                initPlanet = null
            }
        } else {
            //planet is inside rochelimit RIP
            initPlanet = null
        }  
        
        //** SET UP PLANET GEN LOOP **/
        let maxPlanets = randomNormal(5,1)   //determin the maximum number of planets 
        console.log(maxPlanets)
        var counter = 1 //counting planets for TitiusBode spacing
        if(initPlanet){
            maxPlanets -= 1 //reduce max planets if one was created
        }

        while (maxPlanets > 0){
            //get next position
            
            let plOrbDist = TB(counter)
            //check if out of bounds
            if(plOrbDist>UNI.MAX_PLANETARY_ORBITAL_DISTANCE){
                break;
            }
            //created a planet
            if(star.getPlanetOdds(plOrbDist) >= Math.random()){ // calc chance of planet creation
                //---------------------!!!!!!!!! for now just create a random planet eventually change to estimate mass based on distance from star
                // check out ICE LINE for STARS
                
                let polCoo = new PolarCoordinate(plOrbDist,Math.random()*Math.PI,0)
                let pl = Planet.genRandom({ planetTypes: this.PLANET_TYPES,
                                            position: polCoo,
                                            parentBody: star
                                        })
                //update stars satellites
                star.addNaturalSatellites(pl)
                //add planet to system bodies
                astronomBodies[pl.name] = pl
                //** CREATE MOONS **//
                let moons = this.genMoons(pl)
                //add moons to planet
                pl.addNaturalSatellites(moons)
                //add every moon to systembodies
                moons.forEach(moon => {
                    astronomBodies[moon.name] = moon
                })

                 //otherwise reduce the counter 
                --maxPlanets
            }
            //after not creating or creating a planet increment the counter for TB
            ++counter
            //loop!
        }

        //make the planetarysystem
        const system = new PlanetarySystem({
            rootBody: star, 
            titiusBode: TB,
            astronomicalBodies: astronomBodies, 
            name: plSysName, 
            position: new PolarCoordinate(0,0,0)
        })
        //return to caller
        return system
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
