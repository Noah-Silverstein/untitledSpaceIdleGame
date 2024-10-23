import { extractElements } from "./globalFuncts";

class Material {
    elementalElements: string[];
    chemicalName: string;
    name: string;
    constructor(chemicalName: string, name: string){
        this.chemicalName = chemicalName
        this.name = name
        this.elementalElements = extractElements(chemicalName)
    }

    
}