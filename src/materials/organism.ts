import { getRandomElements } from "../global/globalFuncts";
import {  BIOCHEMICAL_FRAMEWORKS, BiochemicalFramework } from "./organismBiochemicalFramework";
import { STRUCTURAL_FRAMEWORKS, StructuralFramework, StructuralFrameworkProperties } from "./organicStructuralFramework";
import { TROPHIC_MODES, TrophicMode } from "./organismEnergetics";



interface OrganismParams {
    biochemicalStructure: BiochemicalFramework
    structure: StructuralFramework<StructuralFrameworkProperties> 
    energySource: TrophicMode
}

/**
 * Possibly This is an abstract class and we can build out? ei Humanoid, Insectoid, ...this either instanciations of organisms or 
 * seperate sub classes perhaps for broad sections we can narrow down 
 * for example Silicious lifeforms have [X,Y, Z] cellular structures 
 * or A Phototroph has [x,y,z] biochemical frameworks
 * 
 * 
 */
export class Organism {
    biochemicalStructure: BiochemicalFramework
    structure: StructuralFramework<StructuralFrameworkProperties>
    energySource: TrophicMode

    constructor(params: OrganismParams){
        this.biochemicalStructure = params.biochemicalStructure
        this.structure = params.structure
        this.energySource = params.energySource
    }

    describe(): string{
        return `A ${this.biochemicalStructure.name} ${this.energySource.mode} constituded from a ${this.structure.name} framework`
    }

    static genRandom(): Organism{
        const bioStructure =  getRandomElements(BIOCHEMICAL_FRAMEWORKS,1)[0]
        const cellStructure = getRandomElements(STRUCTURAL_FRAMEWORKS, 1)[0]
        const energySource = getRandomElements(TROPHIC_MODES, 1)[0]

        return new Organism({
            biochemicalStructure: bioStructure,
            structure: cellStructure,
            energySource: energySource
        })
    }
}