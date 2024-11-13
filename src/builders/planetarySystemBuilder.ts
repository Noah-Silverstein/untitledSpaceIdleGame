import { PlanetarySystem } from "../astronomicalClasses/planetarySystem"
import { PolarCoordinate } from "../astronomicalClasses/polarCoordinate"
import { GVStar, KVStar } from "../astronomicalClasses/stars/mainSequence"
import { clamp, getRandomAngle, getRandomElements, getRandomNumberInErrRange, pickWithProbability, randomInteger, randomNormal } from "../global/globalFuncts"
import { BaseMaterial } from "../materials/materials"
import * as UNI from '../global/globalVars'
import { Planet } from "../astronomicalClasses/planets/planet"
import { Terran } from "../astronomicalClasses/planets/terran"
import { StellarNursery } from "../astronomicalClasses/stellarNursery"
import { SuperTerran } from "../astronomicalClasses/planets/superTerran"
import { SubTerran } from "../astronomicalClasses/planets/subTerran"
import { MiniNeptunian } from "../astronomicalClasses/planets/miniNeptunian"
import { IceGiant } from "../astronomicalClasses/planets/iceGiant"
import { GasGiant } from "../astronomicalClasses/planets/gasGiant"
import {  PlanetType } from "../astronomicalClasses/planets/plannetClasses"

//things to think about
// planet habitability/ life sustainability and interlligence -> https://pmc.ncbi.nlm.nih.gov/articles/PMC5278800/
//sootline and frostline
//magma/lava Planet
// planets travel-> lava world, hot jupiter

export class PlanetarySystemBuilder{
    universeMaterials: BaseMaterial[]
    galaxyName: string
    PLANET_TYPES: PlanetType[] = [SubTerran, Terran, SuperTerran, MiniNeptunian, IceGiant, GasGiant]
    MOON_TYPES: PlanetType[] = [SubTerran, Terran, SuperTerran]

    constructor(universeMaterials: BaseMaterial[], galaxyName: string){
        this.universeMaterials = universeMaterials
        this.galaxyName = galaxyName
    }

    protected genRandomStarPosition(){
        return new PolarCoordinate(randomInteger(1,1e5), getRandomAngle(Math.PI/6, Math.PI*5/6), getRandomAngle(0, Math.PI*2))
    }

    protected genRandomSysName(pos: PolarCoordinate): string{
        return this.galaxyName + "System-R" + pos.r + "T" + pos.t + "P" + pos.p
    }

    //called if you know you want to generate a planet
    protected getRandPlanetType(distance: number, frostLine: number): PlanetType | null{
        
        if (distance < frostLine){
            //we can only generating a rocky planet 
            //1st check mass available 
            const planetTypesAvailable = [SubTerran, Terran, SuperTerran]
            const planetFormationOdds = [0.25, 0.6, 0.15]

            return pickWithProbability(planetTypesAvailable, planetFormationOdds)

        } else {
            //after frostline favour the gasgiants
            const planetTypesAvailable = [SubTerran, Terran, SuperTerran, MiniNeptunian, IceGiant, GasGiant]
            const planetFormationOdds = [0.01, 0.05, 0.04, 0.16, 0.33, 0.41 ] 
            return pickWithProbability(planetTypesAvailable,planetFormationOdds)
        }

    }


    //Rocky inner Gaseous Outer
    /**
     * 
     * @param name name of the planetary system
     * @param plOddsFunction - A function that calculates the odds of Any planet forming at a given distance
     * @param position 
     */
    public genRandSimplePlanetarySystem(name: string, position?: PolarCoordinate, ): PlanetarySystem {
        const protoPlanetaryDisk = new StellarNursery({name: name + "ProtoDisk" })
        const protoData = protoPlanetaryDisk.getRandProtoPlanetaryData()
        const pos = position ?? this.genRandomStarPosition()
        const star = GVStar.genSol() //<------------- rework to gen random star from mass
        const titBode = this.genRandStellarTitiusBode()
        const PLANET_FORM_ODDS = 0.5

        const system = new PlanetarySystem({
            name: name,
            rootBody: star,
            position: pos,
            titiusBode: titBode
        })

        var MAX_PLANETS = randomNormal(6,1)
        var maxPlMass = protoData.totalPlanetMass
        var titBodeCtr = 1
        do {
            
            let plOrbDist = titBode(titBodeCtr)
            //check if out of bounds
            if(plOrbDist>UNI.MAX_PLANETARY_ORBITAL_DISTANCE){break;}
            //check if making planet
            if(PLANET_FORM_ODDS >= Math.random()){ 
                const planetType = this.getRandPlanetType(plOrbDist, star.frostLine)
                --MAX_PLANETS
                if(planetType){
                    const pos = new PolarCoordinate(plOrbDist, getRandomAngle(0,2*Math.PI), 0)
                    const pl = planetType.genRandom({
                        parentBody: star,
                        position: pos,
                        effLumin: star.luminosity*UNI.SOLAR_LUMINOSITY/(plOrbDist*UNI.ASTRO_UNIT**2)
                    })
                    pl.setCrustMaterial(getRandomElements(this.universeMaterials, 6))
                    let moons: Planet[] = []
                    if (pl.earthMass > 0.1){    //create a lower bound for moon formation
                        moons = this.genMoons(pl)
                        pl.addNaturalSatellites(moons)
                    }
                    system.addAndUpdateBody(pl, star, moons)
                }
            }
            ++titBodeCtr
        } while(MAX_PLANETS > 0 && maxPlMass > UNI.MINIMUM_PLANET_MASS)
        
        return system
    }


    /**
     * @function 
     * @returns a random titiusBodeFunction for planet placement
     * values based on average distance of first planets (will change later to see effects)
     */
    protected genRandStellarTitiusBode():(plnumber: number) => number {  
        return this.genTwoParamTitiusBode(clamp(randomNormal(0.05, 0.02), 0.0001, 1000), randomNormal(UNI.TITUS_BODE_MEAN_FACTOR,UNI.TITUS_BODE_STD_DEV))
    }
    /**
     *  Generate a 2 Parameter Titius Bode Function for a given initial Planetary Distance 
     * @param firstPlanetDistance - Distance of the first planet from the Orbiting Body in AU
     * @returns - Function that predicts planetaryLocations based on planet in the series
     * 
     * based on Two Factor Titius bode from linked paper
     * https://academic.oup.com/mnras/article/435/2/1126/1034567?login=false#sec5-4
     */
    protected genTwoParamTitiusBode(firstPlanetDistance: number, constant: number): (plnumber: number) => number{
        return (plnumber:number): number =>  {
            return firstPlanetDistance*Math.pow(constant, plnumber)
        }
    }
    protected createDescOddsArr(length: number): number[] {
        const odds: number[] = [];
        let totalRemaining = 1;
        for (let i = 0; i < length; i++) {
          const probability = totalRemaining / (length - i);
          odds.push(probability);
          totalRemaining -= probability;
        }
        return odds;
    }

    protected getRandMoonType( availableMass: number){
        const moonTypes = this.PLANET_TYPES.filter((type => availableMass < type.massRange[1])).sort((a,b) => a.massRange[1] - b.massRange[1])
        if(moonTypes.length > 0){
            return pickWithProbability(moonTypes, this.createDescOddsArr(moonTypes.length))
        }
    }
    /**
     * Generate a spacing function 
     * @returns 
     */
    protected genRandPlanetTitiusBode():(plnumber: number) => number {  
        return this.genTwoParamTitiusBode(clamp(getRandomNumberInErrRange(0.0005, 0.0004), 0.0001, 1000), getRandomNumberInErrRange(1.75, 0.1))
    }
    /**
     * Generate random Moons for the given Planet
     * @param pl 
     * @returns 
     */
    protected genMoons(pl: Planet): Planet[]{
        const moons: Planet[] = []
        if (!pl.hillSphere){return moons}  //check if hillsphere
        const range = [pl.hillSphere/3, pl.hillSphere/2]    //stable area of hillsphere
        const titBode = this.genRandPlanetTitiusBode()
        const MOON_FORM_ODDS = 0.5
        
        var MAX_MOONS = 4
        var availableMass = pl.earthMass* getRandomNumberInErrRange(0.02, 0.01)
        var mTBCount = 1
        do{
            const moonOrbitDist = titBode(mTBCount)
            if(moonOrbitDist > range[1]){break} //if out of range break
            if(moonOrbitDist > range[0] && MOON_FORM_ODDS > Math.random()){   //if in range & makemoon?
                const moonType = this.getRandMoonType(availableMass)
                if(moonType){ 
                    let moon = moonType.genRandom({
                        parentBody: pl,
                        position: new PolarCoordinate(moonOrbitDist, Math.random()*2*Math.PI, 0),
                        effLumin: pl.effLumin,
                        name: 'Moon-' + pl.name
                    }) 
                    availableMass -= moon.earthMass
                    --MAX_MOONS
                    moons.push(moon)
                } else {console.warn("couldn't find moon type for planet: ", pl)}
                
            }
            ++mTBCount


        }while(MAX_MOONS > 0 && availableMass > 0)

        return moons
    }


}