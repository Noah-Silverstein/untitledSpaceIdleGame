import { EL, ELEMENT, InorganicMaterialProperties, InorganicParams, Inorganics } from "./materials";




//--------------------------------------- MINERALS -------------------------------------
// SILICATES, OXIDES, NATIVEELEMENTS, CARBONATES, PHOSPHATES, SULFATES, HALIDES

export interface MineralProperties extends InorganicMaterialProperties {
    hardness?: number;          // Mohs scale value
    color?: string;             // Primary color or colors
    density?: number;           // Density in g/cm³
    uses?: string[];            // List of uses
    meltingPoint?: number;      // Melting point in degrees Celsius
    toughness?: number;         // Toughness scale
    elProportions?: Record<string, number> 
    radioActivity?: number
    toxicity?: number
}

export interface MineralParams extends InorganicParams {
    properties: MineralProperties

}

// solid, naturally occurring substances 
export class Mineral extends Inorganics {
    properties: MineralProperties
    constructor(params: MineralParams){
        super(params)
        this.properties = params.properties
    }



    /**
     * Creates a new instance of a subclass of Mineral.
     *
     * @param MineralClass - The constructor of the mineral subclass to instantiate. It should be a class that extends the Mineral class.
     *                       It should accept a single parameter of type MineralParams in its constructor.
     * @param params - An object containing the parameters required to create the mineral. Should conform to MineralParams INterface
     * @returns An instance of the specified mineral subclass, with properties initialized based on the provided parameters.
     */
    static createMineral<T extends Mineral>(MineralClass: new (params: MineralParams) => T, params: MineralParams): T {
        return new MineralClass(params);
    }
}




//**---------------- SILICATE MINERAL ---------------------**/


//Composed of Silicate groups
export class Silicate extends Mineral {}



//**---------------------- OXIDE MINERAL ------------------------**/


//Minerals composed of oxygen and one or more metal elements.
export class Oxide extends Mineral {}


//------------------------------------- NATIVE ELEMENTS ----------------------------------


//elements that occur naturally in uncombined form
export class NativeElement extends Mineral {}

//------------------------------------- CARBONATE MINERALS -------------------------------------

//Minerals containing carbonate ions (CO₃²⁻).
export class Carbonate extends Mineral {}

//------------------------------- PHOSPHATE MINERALS --------------------------------------------

//vital for agriculture and biological processes.
export class Phosphate extends Mineral {}

//----------------------------------------- SULFATE MINERALS ------------------------------------

//vital for agriculture and biological processes.
export class Sulfate extends Mineral {}

//--------------------------------------------- HALIDE MINERALS ----------------------------------------

//vital for agriculture and biological processes.
export class Halide extends Mineral {}


