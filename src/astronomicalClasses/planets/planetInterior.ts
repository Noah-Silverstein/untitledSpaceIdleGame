
import { Mineral } from "../../materials/materialsMinerals";



/**
 * https://ui.adsabs.harvard.edu/abs/2019AGUFM.P51G3437B/abstract
 * https://arxiv.org/pdf/1907.05506
 * 
 * -> stars set baseline for elements available
 * -> planet interior composition mostly determined by planetary formations independant of stars +-?
 * -> higher pressures drives heavier elements to the core
 * -> giant impacts mix mantle materials and can cause reaccreation of heavier core elements
 * 
 */
export class TerranPlanetInterior{
    crustComposition: Record<string, {mineral: Mineral; percentage: number}>
    constructor(materials: Record<string, {mineral: Mineral; percentage: number}> ){
        this.crustComposition = {}

    }

    protected genTerranCrustComposition(){

    }
}


/**
 * WHAT TO THINK ABOUT FOR CRUST, MANTLE AND CORE COMPOSITION
 *  CRUST   (IS WHAT IT'S ALL ABOUT)
 *      most if not all usable material will be on the crust, the amount of usuable material will depend on
 *      alot on volcanics/plate tectonics cycling the heavier elements up into the crust and weathering where the 
 *      crust minerals interact with the Atmosphere 
 * 
 *  For now I think having set crusts will work best 
 * 
 * 
 * 
 * 
 */


/*
(mantle-crust)/core migration ratios -> higher ratios mean more of that element remained in mantle|crust
alphaFe: number = 0 //iron retention ratio in mantle/core 
alphaMg: number = 0 //magnesium retention ratio in mantle/core
alphaSi: number = 0 //silicon retention ratio in mantle/core
alphaCa: number = 0 //calcium retention ratio
alphaAl: number = 0 //Aliminium retention ratio
//mantle-crust/Atmosphere retention ratio -> higher ratios mean more oxyen is retained in mantle|core -> more oxides and silicates
alphaO: number = 0  //Oxygen
*/



