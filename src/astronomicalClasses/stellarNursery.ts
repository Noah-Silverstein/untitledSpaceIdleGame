//https://en.wikipedia.org/wiki/Metallicity
//https://en.wikipedia.org/wiki/Stellar_evolution#/media/File:Star_Life_Cycle_Chart.jpg
//https://en.wikipedia.org/wiki/Initial_mass_function
//https://www.oca.eu/images/LAGRANGE/EcolesThematiques/chronologiesolarsystem2013/cours/Dullemond_Houches2013.pdf

import { getRandomInRange, getRandomNumberInErrRange, randomInteger, randomNormal } from "../global/globalFuncts"


interface StellarFormationParams {
    name: string
    metallicity?: number
    cloudDensity?: number
    IMF_ALPHA?: number
    BASELINE_METALLICITY?: number
}

interface protoPlanetaryDiskAndStar {
    metallicity: number
    cloudDensity: number
    starMass: number
    protoPlanetaryDiskMass: number
    totalPlanetMass: number
}

/**
 * NOT A MODEL FOR A STELLAR NURSERY
 * approximates the relevant data for forming a star from a molecular cloud 
 * given the parameters the stellar 
 *     https://ui.adsabs.harvard.edu/abs/2013ApJ...771..129A/abstract
 * 
 * https://www.aanda.org/articles/aa/full_html/2018/10/aa34076-18/aa34076-18.html // assuming a constant gas-to-dust ratio of 100. 
 * this paper is kinda wild actually? they calculate that the median of disk masses is higher than the median of planet masses by a factor of LESS THAN 10????
 * 90th percentile within FACTOR of 3 !? that seems impossible-> planetary cores are formed very early in the protoplanetaryDisk < 0.1–1 Myr,
 */
export class StellarNursery{
    public name: string 

    protected IMF_ALPHA: number
    protected BASELINE_METALLICITY: number
    //PASSED OR RANDOMLY GENERATED
    public metallicity: number 
    public cloudDensity: number  
    

    constructor(params: StellarFormationParams){
        this.name = params.name
        this.metallicity = params.metallicity ?? randomNormal(1,0.5)
        this.cloudDensity = params.cloudDensity ?? randomInteger(1,10e5)*10e-22
        this.IMF_ALPHA = params.IMF_ALPHA ?? 2.35
        this.BASELINE_METALLICITY = params.BASELINE_METALLICITY ?? 0.02
    }   
    
    
    /**
     * Get the necessary data for creating a planetary system. 
     * @returns a protoPlanetaryDiskAndStar Interface which includes all the data for forming a star and orbiting mass
     */
    public getRandProtoPlanetaryData(): protoPlanetaryDiskAndStar{
        const starMass = this.randomStellarMass()
        const protoDiskMass = starMass * getRandomInRange(0.2,0.6) //from 0.2 - 0.6 from https://ui.adsabs.harvard.edu/abs/2013ApJ...771..129A/abstract
        const totalPlanetMass = protoDiskMass * randomNormal(0.2,0.05) //avg 30% effeciency for protoplanetaryDisk

        return { 
            starMass: starMass,
            metallicity: this.metallicity,
            cloudDensity: this.cloudDensity,
            protoPlanetaryDiskMass: protoDiskMass,
            totalPlanetMass: totalPlanetMass
        }
        
    }
//https://www.astro.utoronto.ca/~mhvk/AST221/L18/L18.pdf

    //estimate the mass fraction before the frostline of the protoplanetary disk
    protected calcMassDistribution(protoDiskMass:number){
        return getRandomNumberInErrRange(0.5,0.1)
    }

    /**
     *  Generate a Solar Mass folowing the IMF
     * @param cloudDensity  Density of the stellar cloud from where the star is formed (realistic between <10e-22 and 10e-17<)
     * @param metallicity   the Metallicity of the stellar cloud from which the star is formed (between <0.0001 and 0.03<)
     * @returns a random Stellar Mass in M☉
     * 
     * for now don't use brown dwarf (perhaps exlude very massives also), currently we want only stars where 
     * planetary formation and orbits are 'regular'. When the planetary system formation is more advanced and we can specify what type of system we want to generate
     * we can either change this (seperate functions for the extremes) or incorporate planetary extremes or reroll until requested mass is acceptable
     *  you could then store the rolled mass in a seperate array of available stars in the galaxy so the galaxy remains consistant 
     */
    private randomStellarMass(cloudDensity?: number, metallicity?: number): number {
        const cloudD = cloudDensity ?? this.cloudDensity
        const metallity = metallicity ?? this.metallicity

        const MASSIVE_STAR_MASS_THRESHOLD = 0.8
        const BROWN_DWARF_MASS_LIMIT = 0.08
        // Define the stellar mass ranges (in solar masses)
        const massRanges = [
           // { min: 0.01, max: BROWN_DWARF_MASS_LIMIT }, // Brown Dwarfs
            { min: 0.08, max: 0.6 },  // Low-mass stars
            { min: 0.6, max: 2.0 },   // Intermediate-mass stars
            { min: 2.0, max: MASSIVE_STAR_MASS_THRESHOLD },   // Massive stars
            { min: 8.0, max: 100.0 }  // Very massive stars
        ];
    
        // the IMF exponent (Salpeter IMF https://en.wikipedia.org/wiki/Initial_mass_function)
        const alpha = this.IMF_ALPHA;
    
        // Calculate weights dynamically based on the IMF
        const weights = massRanges.map(range => {
            // Compute the weight for the range using the power-law function
            const weightMin = Math.pow(range.min, -alpha);
            const weightMax = Math.pow(range.max, -alpha);
            return weightMax - weightMin; // Difference gives the range weight
        });
    
        // Adjust weights based on the stellar cloud density
        const densityAdjustment = Math.log10(cloudD); // Simple log scale adjustment
    
        // Adjust weights based on metallicity
        // Assume solar metallicity (Z = 0.02) is a baseline where no major adjustment happens
        const metallicityAdjustment = metallity / this.BASELINE_METALLICITY; // Relative to solar metallicity
    
        // Modify weights: denser clouds and metallicity could change star formation patterns
        for (let i = 0; i < weights.length; i++) {
            if (massRanges[i].min >= MASSIVE_STAR_MASS_THRESHOLD) { // For very massive stars
                weights[i] += densityAdjustment * 0.5; // Higher density increases chances
                weights[i] -= (metallicityAdjustment - 1) * 0.3; // Higher metallicity reduces chance
            } else if (massRanges[i].min >= 2) { // For massive stars
                weights[i] += densityAdjustment * 0.3; // Moderate increase with density
                weights[i] -= (metallicityAdjustment - 1) * 0.2; // Moderate reduction with higher metallicity
            } else if (massRanges[i].min < 2) { // For low-mass and brown dwarfs
                weights[i] -= densityAdjustment * 0.1; // Slight decrease with density
                weights[i] += (metallicityAdjustment - 1) * 0.2; // Higher metallicity increases chance
            }
        }
    
        // Normalize weights
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        const probabilities = weights.map(weight => weight / totalWeight);
    
        // Generate a random number to select a mass based on the adjusted probabilities
        const randomNum = Math.random();
        let cumulativeProbability = 0;
    
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomNum <= cumulativeProbability) {
                // Select a mass from the chosen range
                const selectedRange = massRanges[i];
                const stellarMass = Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min;
                return stellarMass; // Return mass rounded to 2 decimal places
            }
        }
    
        return 0; // Fallback in case of an error (shouldn't happen)
    }

    



}