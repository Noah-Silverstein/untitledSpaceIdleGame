
/**
 * The ELEMENTS that make up the Universe 
 * used for identifying composition rather than generating materials
 * !!!!!! In the future I can imagine making materials that include elements such that finding these elements become 
 * part of the game
 */
export class ELEMENT {
    name: string
    symbol: string
    atomicNum: number
    atomicMass: number
    constructor(name: string, symbol: string, atomicNum: number, atomicMass: number){
        this.name = name
        this.symbol = symbol
        this.atomicNum = atomicNum
        this.atomicMass = atomicMass
    }
}

//ores? what is the purpose of this going to be in game?
export const EL = new Map<string, ELEMENT>([
    ['H', new ELEMENT('Hydrogen', 'H', 1, 1.008)],
    ['He', new ELEMENT('Helium', 'He', 2, 4.0026)],
    ['Li', new ELEMENT('Lithium', 'Li', 3, 6.94)],
    ['Be', new ELEMENT('Beryllium', 'Be', 4, 9.0122)],
    ['B', new ELEMENT('Boron', 'B', 5, 10.81)],
    ['C', new ELEMENT('Carbon', 'C', 6, 12.011)],
    ['N', new ELEMENT('Nitrogen', 'N', 7, 14.007)],
    ['O', new ELEMENT('Oxygen', 'O', 8, 15.999)],
    ['F', new ELEMENT('Fluorine', 'F', 9, 18.998)],
    ['Ne', new ELEMENT('Neon', 'Ne', 10, 20.180)],
    ['Na', new ELEMENT('Sodium', 'Na', 11, 22.990)],
    ['Mg', new ELEMENT('Magnesium', 'Mg', 12, 24.305)],
    ['Al', new ELEMENT('Aluminum', 'Al', 13, 26.982)],
    ['Si', new ELEMENT('Silicon', 'Si', 14, 28.085)],
    ['P', new ELEMENT('Phosphorus', 'P', 15, 30.974)],
    ['S', new ELEMENT('Sulfur', 'S', 16, 32.06)],
    ['Cl', new ELEMENT('Chlorine', 'Cl', 17, 35.45)],
    ['Ar', new ELEMENT('Argon', 'Ar', 18, 39.948)],
    ['K', new ELEMENT('Potassium', 'K', 19, 39.098)],
    ['Ca', new ELEMENT('Calcium', 'Ca', 20, 40.078)],
    ['Sc', new ELEMENT('Scandium', 'Sc', 21, 44.956)],
    ['Ti', new ELEMENT('Titanium', 'Ti', 22, 47.867)],
    ['V', new ELEMENT('Vanadium', 'V', 23, 50.941)],
    ['Cr', new ELEMENT('Chromium', 'Cr', 24, 51.996)],
    ['Mn', new ELEMENT('Manganese', 'Mn', 25, 54.938)],
    ['Fe', new ELEMENT('Iron', 'Fe', 26, 55.845)],
    ['Co', new ELEMENT('Cobalt', 'Co', 27, 58.933)],
    ['Ni', new ELEMENT('Nickel', 'Ni', 28, 58.693)],
    ['Cu', new ELEMENT('Copper', 'Cu', 29, 63.546)],
    ['Zn', new ELEMENT('Zinc', 'Zn', 30, 65.38)],
    ['Ga', new ELEMENT('Gallium', 'Ga', 31, 69.723)],
    ['Ge', new ELEMENT('Germanium', 'Ge', 32, 72.63)],
    ['As', new ELEMENT('Arsenic', 'As', 33, 74.922)],
    ['Se', new ELEMENT('Selenium', 'Se', 34, 78.971)],
    ['Br', new ELEMENT('Bromine', 'Br', 35, 79.904)],
    ['Kr', new ELEMENT('Krypton', 'Kr', 36, 83.798)],
    ['Rb', new ELEMENT('Rubidium', 'Rb', 37, 85.467)],
    ['Sr', new ELEMENT('Strontium', 'Sr', 38, 87.62)],
    ['Y', new ELEMENT('Yttrium', 'Y', 39, 88.906)],
    ['Zr', new ELEMENT('Zirconium', 'Zr', 40, 91.224)],
    ['Nb', new ELEMENT('Niobium', 'Nb', 41, 92.906)],
    ['Mo', new ELEMENT('Molybdenum', 'Mo', 42, 95.95)],
    ['Tc', new ELEMENT('Technetium', 'Tc', 43, 98)],
    ['Ru', new ELEMENT('Ruthenium', 'Ru', 44, 101.07)],
    ['Rh', new ELEMENT('Rhodium', 'Rh', 45, 102.905)],
    ['Pd', new ELEMENT('Palladium', 'Pd', 46, 106.42)],
    ['Ag', new ELEMENT('Silver', 'Ag', 47, 107.8682)],
    ['Cd', new ELEMENT('Cadmium', 'Cd', 48, 112.414)],
    ['In', new ELEMENT('Indium', 'In', 49, 114.818)],
    ['Sn', new ELEMENT('Tin', 'Sn', 50, 118.710)],
    ['Sb', new ELEMENT('Antimony', 'Sb', 51, 121.760)],
    ['Te', new ELEMENT('Tellurium', 'Te', 52, 127.60)],
    ['I', new ELEMENT('Iodine', 'I', 53, 126.904)],
    ['Xe', new ELEMENT('Xenon', 'Xe', 54, 131.293)],
    ['Cs', new ELEMENT('Cesium', 'Cs', 55, 132.905)],
    ['Ba', new ELEMENT('Barium', 'Ba', 56, 137.327)],
    ['La', new ELEMENT('Lanthanum', 'La', 57, 138.905)],
    ['Ce', new ELEMENT('Cerium', 'Ce', 58, 140.116)],
    ['Pr', new ELEMENT('Praseodymium', 'Pr', 59, 140.907)],
    ['Nd', new ELEMENT('Neodymium', 'Nd', 60, 144.242)],
    ['Pm', new ELEMENT('Promethium', 'Pm', 61, 145)],
    ['Sm', new ELEMENT('Samarium', 'Sm', 62, 150.36)],
    ['Eu', new ELEMENT('Europium', 'Eu', 63, 151.964)],
    ['Gd', new ELEMENT('Gadolinium', 'Gd', 64, 157.25)],
    ['Tb', new ELEMENT('Terbium', 'Tb', 65, 158.925)],
    ['Dy', new ELEMENT('Dysprosium', 'Dy', 66, 162.500)],
    ['Ho', new ELEMENT('Holmium', 'Ho', 67, 164.930)],
    ['Er', new ELEMENT('Erbium', 'Er', 68, 167.259)],
    ['Tm', new ELEMENT('Thulium', 'Tm', 69, 168.934)],
    ['Yb', new ELEMENT('Ytterbium', 'Yb', 70, 173.04)],
    ['Lu', new ELEMENT('Lutetium', 'Lu', 71, 174.966)],
    ['Hf', new ELEMENT('Hafnium', 'Hf', 72, 178.49)],
    ['Ta', new ELEMENT('Tantalum', 'Ta', 73, 180.948)],
    ['W', new ELEMENT('Tungsten', 'W', 74, 183.84)],
    ['Re', new ELEMENT('Rhenium', 'Re', 75, 186.207)],
    ['Os', new ELEMENT('Osmium', 'Os', 76, 190.23)],
    ['Ir', new ELEMENT('Iridium', 'Ir', 77, 192.217)],
    ['Pt', new ELEMENT('Platinum', 'Pt', 78, 195.084)],
    ['Au', new ELEMENT('Gold', 'Au', 79, 196.966)],
    ['Hg', new ELEMENT('Mercury', 'Hg', 80, 200.592)],
    ['Tl', new ELEMENT('Thallium', 'Tl', 81, 204.38)],
    ['Pb', new ELEMENT('Lead', 'Pb', 82, 207.2)],
    ['Bi', new ELEMENT('Bismuth', 'Bi', 83, 208.98)],
    ['Po', new ELEMENT('Polonium', 'Po', 84, 209)],
    ['At', new ELEMENT('Astatine', 'At', 85, 210)],
    ['Rn', new ELEMENT('Radon', 'Rn', 86, 222)],
    ['Fr', new ELEMENT('Francium', 'Fr', 87, 223)],
    ['Ra', new ELEMENT('Radium', 'Ra', 88, 226)],
    ['Ac', new ELEMENT('Actinium', 'Ac', 89, 227)],
    ['Th', new ELEMENT('Thorium', 'Th', 90, 232.04)],
    ['Pa', new ELEMENT('Protactinium', 'Pa', 91, 231.04)],
    ['U', new ELEMENT('Uranium', 'U', 92, 238.028)],
    ['Np', new ELEMENT('Neptunium', 'Np', 93, 237)],
    ['Pu', new ELEMENT('Plutonium', 'Pu', 94, 244)],
    ['Am', new ELEMENT('Americium', 'Am', 95, 243)],
    ['Cm', new ELEMENT('Curium', 'Cm', 96, 247)],
    ['Bk', new ELEMENT('Berkelium', 'Bk', 97, 247)],
    ['Cf', new ELEMENT('Californium', 'Cf', 98, 251)],
    ['Es', new ELEMENT('Einsteinium', 'Es', 99, 252)],
    ['Fm', new ELEMENT('Fermium', 'Fm', 100, 257)],
    ['Md', new ELEMENT('Mendelevium', 'Md', 101, 258)],
    ['No', new ELEMENT('Nobelium', 'No', 102, 259)],
    ['Lr', new ELEMENT('Lawrencium', 'Lr', 103, 262)],
    ['Rf', new ELEMENT('Rutherfordium', 'Rf', 104, 267)],
    ['Db', new ELEMENT('Dubnium', 'Db', 105, 268)],
    ['Sg', new ELEMENT('Seaborgium', 'Sg', 106, 271)],
    ['Bh', new ELEMENT('Bohrium', 'Bh', 107, 270)],
    ['Hs', new ELEMENT('Hassium', 'Hs', 108, 277)],
    ['Mt', new ELEMENT('Meitnerium', 'Mt', 109, 278)],
    ['Ds', new ELEMENT('Darmstadtium', 'Ds', 110, 281)],
    ['Rg', new ELEMENT('Roentgenium', 'Rg', 111, 282)],
    ['Cn', new ELEMENT('Copernicium', 'Cn', 112, 285)],
    ['Nh', new ELEMENT('Nihonium', 'Nh', 113, 286)],
    ['Fl', new ELEMENT('Flerovium', 'Fl', 114, 289)],
    ['Mc', new ELEMENT('Moscovium', 'Mc', 115, 288)],
    ['Lv', new ELEMENT('Livermorium', 'Lv', 116, 293)],
    ['Ts', new ELEMENT('Tennessine', 'Ts', 117, 294)],
    ['Og', new ELEMENT('Oganesson', 'Og', 118, 294)],
    //** EXOTIC ELEMENTS **//
    ['Uue', new ELEMENT('Ununennium', 'Uue', 119, 316)], //theoretical
]);

interface ORGANIC_BUILDING_BLOCK_PROPERTIES {
    state?: 'solid'| 'liquid' |'gas' | 'plasma'
    uses?: string
    tempRange?: [number, number]
}

export class ORGANIC_BUILDING_BLOCK_ELEMENT {
    name: string
    symbol: string
    properties: ORGANIC_BUILDING_BLOCK_PROPERTIES
    constructor(name: string, symbol: string, properties: ORGANIC_BUILDING_BLOCK_PROPERTIES){
        this.name = name
        this.symbol = symbol
        this.properties = properties
    }
}
export const ORGANIC_BASE_ELEMENTS = {
    CELLULOSE: new ORGANIC_BUILDING_BLOCK_ELEMENT('Cellulose', 'C6H10O5', {}),
    LIGNIN: new ORGANIC_BUILDING_BLOCK_ELEMENT('Lignin', 'LIGNIN', {}),
    CHLOROPHYLL: new ORGANIC_BUILDING_BLOCK_ELEMENT('Chlorophyll', 'C55H72MgN4O5', {}),
    XYLAN: new ORGANIC_BUILDING_BLOCK_ELEMENT('Xylan', 'C5H8O4', {}),
    STARCH: new ORGANIC_BUILDING_BLOCK_ELEMENT('Starch', '(C6H10O5)n', {}),
    GLUCOSE: new ORGANIC_BUILDING_BLOCK_ELEMENT('Glucose', 'C6H12O6', {}),
    FLAVONOIDS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Flavonoids', 'FLAV', {}),
    RESIN: new ORGANIC_BUILDING_BLOCK_ELEMENT('Pine Resin', 'RESIN', {}),
    RHIZOBIUM: new ORGANIC_BUILDING_BLOCK_ELEMENT('Rhizobium', 'RHIZ', {}),
    MYCORRHIZAE: new ORGANIC_BUILDING_BLOCK_ELEMENT('Mycorrhizae', 'MYCO', {}),
    PROTEINS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Proteins', 'PROT', {}),
    AMINO_ACIDS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Amino Acids', 'AA', {}),
    CELL_MEMBRANES: new ORGANIC_BUILDING_BLOCK_ELEMENT('Cell Membranes', 'CM', {}),
    DNA: new ORGANIC_BUILDING_BLOCK_ELEMENT('Deoxyribonucleic Acid', 'DNA', {}),
    RNA: new ORGANIC_BUILDING_BLOCK_ELEMENT('Ribonucleic Acid ', 'RNA', {}),
    CHITIN: new ORGANIC_BUILDING_BLOCK_ELEMENT('Chitin', 'C8H13O5N', {}),
    PECTIN: new ORGANIC_BUILDING_BLOCK_ELEMENT('Pectin', 'PECT', {}),
    LIPIDS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Lipids', 'LIP', {}),
    CAROTENOIDS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Carotenoids', 'CAROT', {}),
    ALKALOIDS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Alkaloids', 'ALK', {}),
    TANNINS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Tannins', 'TAN', {}),
    HEMICELLULOSE: new ORGANIC_BUILDING_BLOCK_ELEMENT('Hemicellulose', 'HEMI', {}),
    POLYSACCHARIDES: new ORGANIC_BUILDING_BLOCK_ELEMENT('Polysaccharides', 'POLY', {}),
    NUCLEOTIDES: new ORGANIC_BUILDING_BLOCK_ELEMENT('Nucleotides', 'NTD', {}),
    PHYTOCHEMICALS: new ORGANIC_BUILDING_BLOCK_ELEMENT('Phytochemicals', 'PHYTO', {})
};


export type UNI_BUILDING_BLOCK = ORGANIC_BUILDING_BLOCK_ELEMENT | ELEMENT

/**
 *  KEY PROPERTIES FOR NON ORGANIC MATERIALS
 *      - WEIGHT TO STRENGTH                -> look for Lightweight strong materials
 *      - THERMAL RESISTANCE/INSULATION     -> look for insulating materials against high heat(sun) or cold
 *      - RADIATION RESISTANCE              -> look for materials that can resist radiation of any type
 *      - THERMAL EXPANSION                 -> materials that don't deform under extreme temps
 *      - ELECTRICAL CONDUCTIVITY           -> allow electrons to flow freely (superconductors)
 *      - DURABILITY                        -> general resistance to wear and tear
 *      - ELASTICITY/FLEXIBILIY             -> how much bending force before break
 *      - TRANSPARENCY                      -> can you see through it? (windows? sensors?) [unnecessary?]
 *      - NUTRITIONAL PROPERTIES            -> how much nutrition does it provide for humans
 *      - ENERGY STORAGE                    -> how corrosive is it? will it burn through materials? solid acids are used in elctrolytes(batteries)
 *      - ENERGY/WEIGHT                     -> how much energy for how little weight
 */

interface BaseMaterialProperties {
    
}


interface BaseMaterialParams {
    name: string,
    formula: string,
    buildingBlocks: Record<string, { element: UNI_BUILDING_BLOCK; efficiency: number }> //{base element, the fraction this base element makes up of the total formula}
    properties: BaseMaterialProperties
}

//all materials are part of this
export abstract class BaseMaterial {
    name: string
    formula: string
    buildingBlocks: Record<string, { element: UNI_BUILDING_BLOCK; efficiency: number }>         //ELEMENTS for INORGANIC, ORGANIC_BUILDING_BLOCKS for ORGANIC (for manufactured this  will be something? idk)
    constructor(params: BaseMaterialParams){
        this.name = params.name
        this.formula = params.formula
        this.buildingBlocks = params.buildingBlocks
    }
}
//**------------------------------- INORGANIC MATERIALS --------------------------- **//

//-------------- PROVISIONAL -------------------
export interface InorganicMaterialProperties extends BaseMaterialProperties {
    strengthWeightRatio?: number,
    thermalResistance?: number,
    radiationResistance?: number,
    thermalExpansion?: number,
    electricalConductivity?: number,
    durability?: number,
    elasticity?: number,
    transparency?: number,  //This might need a different type or not
    nutritionalDensity?: number ,
    energyStorageDensity?: number,
    energyDensity?: number
    
}


export interface InorganicParams extends BaseMaterialParams{
    properties: InorganicMaterialProperties
}

//all inorganics are nutritionally Empty
export class Inorganics extends BaseMaterial {
    constructor(params: InorganicParams){
        super(params)
    }

}

//-------------------> ALL MINERALS ARE IN SEPERATE FILE: materialMinerals.ts


//chemical elements/compounds that can be readily vaporized
export class Volatiles extends Inorganics {

}

//frozen forms of gases/volitiles/
export class Ices extends Inorganics {

}
//Fictional Materials  <------perhaps spread over the other classes? unless they have specific properties
export class Exotics extends Inorganics {

}

//for naturally formed compounds/composits/Alloys/...
export class Aggregates extends Inorganics {

}

//**------------------------------- ORGANIC MATERIALS --------------------------- **//
// Organic matter, matter that has come from a once-living organism, is capable of decay or is the product of decay, or is composed of organic compounds

interface OrganicMaterialProperties extends BaseMaterialProperties {
    
}

interface OrganicParams extends BaseMaterialParams{
    properties: OrganicMaterialProperties
}
export class Organic extends BaseMaterial{
    constructor(params: OrganicParams){
        super(params)
    }
}


//------------------------------------ LIFE ?---------------------------------------------



//
export interface BioticParams extends OrganicParams{
}

//produced by directly by Living Organisms (bone, amber, fur, adipose tissue, wood, bark, collagen, keratine,... )
export class Biotic extends Organic{
    constructor(params: BioticParams){
        super(params)
    }
}


