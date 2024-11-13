
//This would describe the fundamental chemical basis of the organism. 
//Essentially, it tells you what the organism is made of at the most basic chemical level.


/**
 * Interface to describe the sensitivities of a BiochemicalFramework to an Environment
 * necessary for creating a BiochemicalFramework
 */
export interface Sensitivity {
    temp?: {mean: number, stdDevLeft: number, stdDevRight: number}
    pH?: {mean: number, stdDevLeft: number, stdDevRight: number}
    radiation?: {mean: number, stdDevLeft: number, stdDevRight: number}
}


/**
 * Interface to describe the properties of a BiochemicalFramework regardless of Environment
 * necessary for creating a BiochemicalFramework
 */
interface BiochemFrameworkProperties {
    composition: string     //string that describes the composition of the Structure  
}


/**
 * Interface to describe the necessary parameters needed to create a BiochemicalFramework
 */
interface BiochemFrameworkParams {
    name: string
    sensitivities: Sensitivity
    properties: BiochemFrameworkProperties
}

/**
 * Class that describes the structure/Framework of an organism. Meaning what elements it's made of and how they're kept together
 * Think of CarbonBased, SilicaBased, AmonniaBased, ...
 * 
 */
export class BiochemicalFramework  {
    name: string
    sensitivities: Sensitivity
    properties: BiochemFrameworkProperties
    effectiveness: number = 0 //DUMMY VAL 

    constructor(params: BiochemFrameworkParams){
        this.name = params.name
        this.sensitivities = params.sensitivities
        this.properties = params.properties
    }

    /**
     * 
     * @returns Description of the Biochemical Composition
     */
    public compDescription(): string{
        return this.properties.composition
    }

    public estEffectiveness(){
        // TO BE IMPLEMENTED should get environmental factors and calculate bonuses and malusses (and wrap all into 1 number= effectiveness)
    }


    
}
//-------------------------------CARBOGENIC--------------------------
/**
 * the sensitivities and Properties of Cabon-based Lifeforms
 */
const CARBOGENIC_SENSITIVITIES: Sensitivity = {
    temp: {mean: 20, stdDevLeft: 10, stdDevRight: 5}
}
const CARBOGENIC_PROPERTIES: BiochemFrameworkProperties = {
    composition: "Biochemical Composition made up of Mostly Carbon"
}
/**
 * the Carbogenic Biochemical Framework
 */
const CARBOGENIC:BiochemicalFramework = new BiochemicalFramework({
    name: "Carbogenic",
    sensitivities: CARBOGENIC_SENSITIVITIES,
    properties: CARBOGENIC_PROPERTIES
})
//-------------------------------SILICEOUS--------------------------
/**
 * the sensitivities and Properties of Silica-based Lifeforms
 */
const SILICEOUS_SENSITIVITIES: Sensitivity = {
    temp: {mean: 100, stdDevLeft: 50, stdDevRight: 50}
}
const SILICEOUS_PROPERTIES: BiochemFrameworkProperties = {
    composition: "Biochemical Composition made up of Mostly Silica"
}
/**
 * the Siliceous Biochemical Framework
 */
const SILICEOUS:BiochemicalFramework = new BiochemicalFramework({
    name: "Siliceous",
    sensitivities: SILICEOUS_SENSITIVITIES,
    properties: SILICEOUS_PROPERTIES
})


//Provide all Frameworks for creating organisms
export const BIOCHEMICAL_FRAMEWORKS = [CARBOGENIC, SILICEOUS]
