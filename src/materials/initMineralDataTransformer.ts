import * as EL from "./materials";
import { Carbonate, Halide, Mineral, MineralParams, MineralProperties, NativeElement, Oxide, Phosphate, Silicate, Sulfate } from "./materialsMinerals";


export interface InitialMineralData {
    name: string;
    formula: string;
    type: string;
    properties: MineralProperties;
}

export class MineralDataParser{
    constructor(){

    }
    private mineralClassMap: Record<string, new (params: MineralParams) => Mineral> = {
        "Silicate": Silicate,
        "Oxide": Oxide,
        "Carbonate": Carbonate,
        "Halide": Halide,
        "Phosphate": Phosphate,
        "Sulfate": Sulfate,
        "Native Element": NativeElement
    };
    /**
     * Transform the raw JSON file to Mineral Game Objects
     * @param mineralData Raw Mineral Object Array formatted as an array of {name: string, formula: string, type: string, properties: MineralProperties{}}
     * @returns transformed array of input minerals with Buildingblocks and efficiencies included.
     */
    public intialTransformFromRawJSON(initialMineralJSONData: InitialMineralData[]): Mineral[]{
        return initialMineralJSONData.map((initMineralData: InitialMineralData) => {
             // Parse the mineral formula and add building blocks and efficiency
            const parsedMineral = this.parseFormula(initMineralData.formula);
            const MineralClass = this.mineralClassMap[initMineralData.type]; // Get the class from the map
            // Create a new Mineral instance
            //console.log("creating", initMineralData.name, initMineralData.formula, initMineralData.properties, "with class", MineralClass, "and", parsedMineral.buildingBlocks)
            const compMin = Mineral.createMineral(MineralClass, {
                name: initMineralData.name,
                formula: initMineralData.formula,
                buildingBlocks: parsedMineral.buildingBlocks,
                properties: initMineralData.properties,
                    
                });
                //console.log(compMin.name, compMin)
            return compMin
        });
    }



    protected parseFormula (formula: string) {
        const hydrationRegex = /(.*?)(\.(\d+))?$/; // Matches hydration part

        const hydrationMatch = hydrationRegex.exec(formula);
        let baseFormula: string;
        let hydrationCount: number = 0; // Default to 0 if no hydration is found
    
        if (hydrationMatch) {
            baseFormula = hydrationMatch[1].trim(); // Base formula without hydration
            hydrationCount = hydrationMatch[3] ? parseInt(hydrationMatch[3]) : 0; // Use the third group for hydration count
        } else {
            baseFormula = formula; // If no match, use the original formula
        }
    
        
        const buildingBlocks: Record<string, { element: EL.ELEMENT; efficiency: number }> = {};
        let totalMass = 0;

        const parseElementGroup = (segment: string, multiplier = 1) => {
            const elementOrGroupRegex = /([A-Z][a-z]?)(\d*)|(\([A-Za-z0-9]*\))(\d*)/g;
            let match;

            while ((match = elementOrGroupRegex.exec(segment)) !== null) {
                if (match[1]) {
                    const elementSymbol = match[1];
                    const count = (match[2] ? parseInt(match[2]) : 1) * multiplier;

                    const element = EL.EL.get(elementSymbol);
                    if (element) {
                        const elementMass = element.atomicMass * count;

                        if (!buildingBlocks[elementSymbol]) {
                            buildingBlocks[elementSymbol] = { element, efficiency: 0 };
                        }
                        buildingBlocks[elementSymbol].efficiency += elementMass;

                        totalMass += elementMass;
                    }
                } else if (match[3]) {
                    const group = match[3].slice(1, -1);
                    const groupMultiplier = (match[4] ? parseInt(match[4]) : 1) * multiplier;
                    parseElementGroup(group, groupMultiplier);
                }
            }
        };

        // Parse the base formula
        parseElementGroup(baseFormula);

        if (hydrationCount > 0) {
            const HMass = EL.EL.get('H')?.atomicMass; // Get the atomic mass of Hydrogen
            const OMass = EL.EL.get('O')?.atomicMass // 
            const waterMass = (HMass && OMass) ? (HMass * 2 + OMass) : 0; // H2O is the hydration
            totalMass += waterMass * hydrationCount; // Add hydration mass to total
        }
    
         // Normalize efficiencies to represent the percentage of total mass each element contributes
         for (const elementSymbol in buildingBlocks) {
            buildingBlocks[elementSymbol].efficiency = parseFloat(
                (buildingBlocks[elementSymbol].efficiency / totalMass).toFixed(3)
            );
        }

        // Return the building blocks and hydration if applicable
        return {
            buildingBlocks,
        };
    };

}