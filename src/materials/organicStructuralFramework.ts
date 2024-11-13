
//------------------------STRUCTRAL FRAMEWORK-----------------------------
/**
 * The properties ALL Structural Frameworks have
 */
export interface StructuralFrameworkProperties {
    description: string     //description of the cell type
    size?: number
}

/**
 * The parameters necessary for creating ANY Structural Framework
 */
interface StructuralFrameworkParams<T> {
    name:string,
    properties: T
}

/**
 * defines the ABSTRACT Class for an organisms Structural Framework
 * This is essentially the base building blocks of an organism, currently
 * either CELLULAR or NON-CELLULAR 
 */
export abstract class StructuralFramework<T extends StructuralFrameworkProperties> {
    name: string
    properties: T
    constructor(params: StructuralFrameworkParams<T>){
        this.name = params.name
        this.properties = params.properties
    }

    describe(): string {
        return `The ${this.name} is described as: ${this.properties.description}.`;
    }

}

//-----------------------------------------CELLULAR----------------------------------
/**
 * properties governing Cellular Lifeforms
 */
interface CellularProperties extends StructuralFrameworkProperties{
}
/**
 * parameters necessary for creating Cellular Lifeforms
 */
interface CellularParams extends StructuralFrameworkParams<CellularProperties> {
}

/**
 * Defines the CELLULAR class of the STRUCTURAL FRAMEWORK of Lifeforms
 * encompasses anything that is cell-like or quasi-cell-like
 * 
 */
export class CellularFramework extends StructuralFramework<CellularProperties>{
    constructor(params:CellularParams){
        super(params)
        this.properties = params.properties
    }
}

//------------------------------------------- PROKARYOID -------------------------------------
/**
 * Prokaryoid Properties
 */
const PROKARYOID_PROPERTIES: CellularProperties = {
    description: "simple, single celled"

}
/**
 * The Prokaryoid Framework for an organism
 */
const PROKARYOID: CellularFramework = new CellularFramework({
    name: "Prokaryoid",
    properties: PROKARYOID_PROPERTIES
})

//---------------------------------------- EUKARYOID ----------------------------------

/**
 * Eukaryoid Properties
 */
const EUKARYOID_PROPERTIES: CellularProperties = {
    description: "Complex, multicellular organism with membrane-bound organelles"
}

/**
 * The Eukaryoid Framework for an organism
 */
const EUKARYOID: CellularFramework = new CellularFramework({
    name: "Eukaryoid",
    properties: EUKARYOID_PROPERTIES
})

//------------------------------ Archaeoid ------------------------------
/**
 * Archaeoid Properties
 */
const ARCHAEOID_PROPERTIES: CellularProperties = {
    description: "simple cellular organisms, often extremophiles, resembling the earliest forms of life.",
};

/**
 * The Archaeoid Framework for an organism
 */
const ARCHAEOID: CellularFramework = new CellularFramework({
    name: "Archaeoid",
    properties: ARCHAEOID_PROPERTIES
});

//------------------------------ Syncytial ------------------------------
/**
 * Syncytial Properties
 */
const SYNCYTIAL_PROPERTIES: CellularProperties = {
    description: "Multinucleated cell structure formed by the fusion of multiple cells",
};

/**
 * The Syncytial Framework for an organism
 */
const SYNCYTIAL: CellularFramework = new CellularFramework({
    name: "Syncytial",
    properties: SYNCYTIAL_PROPERTIES
});

//------------------------------ Polycytial ------------------------------
/**
 * Polycytial Properties
 */
const POLYCYTIAL_PROPERTIES: CellularProperties = {
    description: "Complex cellular structure with multiple distinct nuclei and compartmentalized functions",
};

/**
 * The Polycytial Framework for an organism
 */
const POLYCYTIAL: CellularFramework = new CellularFramework({
    name: "Polycytial",
    properties: POLYCYTIAL_PROPERTIES
});

//------------------------------ Pseudocellular ------------------------------
/**
 * Pseudocellular Properties
 */
const PSEUDOCELLULAR_PROPERTIES: CellularProperties = {
    description: "Structures that mimic cellular organization but lack true cellular components, often seen in certain molds and aggregates."
};

/**
 * The Pseudocellular Framework for an organism
 */
const PSEUDOCELLULAR: CellularFramework = new CellularFramework({
    name: "Pseudocellular",
    properties: PSEUDOCELLULAR_PROPERTIES
});

//------------------------------ Biofilm Aggregate ------------------------------
/**
 * Biofilm Aggregate Properties
 */
const BIOFILM_AGGREGATE_PROPERTIES: CellularProperties = {
    description: "Complex communities of microorganisms that adhere to surfaces and form a protective extracellular matrix, functioning collectively."
};

/**
 * The Biofilm Aggregate Framework for an organism
 */
const BIOFILM_AGGREGATE: CellularFramework = new CellularFramework({
    name: "BiofilmAggregate",
    properties: BIOFILM_AGGREGATE_PROPERTIES
});

//------------------------------ Chemocytes ------------------------------
/**
 * Chemocyte Properties
 */
const CHEMOCYTE_PROPERTIES: CellularProperties = {
    description: "Specialized cells or aggregates that are capable of synthesizing chemical compounds or conducting chemical reactions, often involved in biogeochemical cycles."
};

/**
 * The Chemocyte Framework for an organism
 */
const CHEMOCYTE: CellularFramework = new CellularFramework({
    name: "Chemocyte",
    properties: CHEMOCYTE_PROPERTIES
});


//------------------------------------------------ NON CELLULAR -----------------------------------------
//Lifeforms where the underlining structure is NOT based on Cells or cell-like structures
/**
 * Properties governing Non-Cellular Lifeforms
 */
interface NonCellularProperties extends StructuralFrameworkProperties {

}
/**
 * Parameters necessary for creating Non-Cellular Lifeforms */
interface NonCellularParams extends StructuralFrameworkParams<NonCellularProperties> {

}

/**
 * Defines the NON-CELLULAR class of the STRUCTURAL FRAMEWORK of Lifeforms
 * encompasses anything that is not cell-like or quasi-cell-like
 */
export class NonCellular extends StructuralFramework<CellularProperties> {

    constructor(params:NonCellularParams){
        super(params)
        this.properties = params.properties
    }

}

//------------------------------ Crystalline ------------------------------
/**
 * Crystalline Properties
 */
const CRYSTALLINE_PROPERTIES: NonCellularProperties = {
    description: "Rigid structures with a defined geometric shape, often formed through crystallization processes."
};

/**
 * The Crystalline Framework for an organism
 */
const CRYSTALLINE: NonCellular = new NonCellular({
    name: "Crystalline",
    properties: CRYSTALLINE_PROPERTIES
});

//------------------------------ Amorphous ------------------------------
/**
 * Amorphous Properties
 */
const AMORPHOUS_PROPERTIES: NonCellularProperties = {
    description: "Structures that lack a defined shape or form, often capable of flowing and adapting to their environment."
};

/**
 * The Amorphous Framework for an organism
 */
const AMORPHOUS: NonCellular = new NonCellular({
    name: "Amorphous",
    properties: AMORPHOUS_PROPERTIES
});

const CELLULAR_STRUCTURES = [
    EUKARYOID, 
    PROKARYOID, 
    ARCHAEOID, 
    SYNCYTIAL, 
    POLYCYTIAL, 
    PSEUDOCELLULAR, 
    BIOFILM_AGGREGATE, 
    CHEMOCYTE 
]

const NON_CELLULAR_STRUCTURES = [
    CRYSTALLINE, 
    AMORPHOUS]

export const STRUCTURAL_FRAMEWORKS = CELLULAR_STRUCTURES.concat(NON_CELLULAR_STRUCTURES)

/**
 *  ADDITIONAL LIFEFORMS 
 * 
 *  Plasma-Based or Electromagnetic Life
        ->possibly not part of biotic but rather energetic? maybe not even organic?
    Description: Hypothetical life that exists without traditional cellular structures, but instead uses patterns of plasma or electromagnetic fields to maintain form and function.
 * 
 *  Symbiotic Composite Entities
        -> seperate class or possibly combining 2 or more of the above classes to create a custom new class?
    Description: Life forms made up of two or more symbiotic species that have merged to function as a single organism. The components may be inseparable, yet retain distinct identities.
 * 
 * 
 * 
 * 
 */