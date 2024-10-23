import { Atmosphere } from "./atmosphere";
import { AstronomicalBody, PlanetaryMassObject, PlanetaryMassParams, WithoutRealValues } from "./baseAstronomicalClasses";
import { PlanetConstructor } from "./plannetClasses";
import { PolarCoordinate } from "./polarCoordinate";

export interface PlanetParams extends WithoutRealValues<PlanetaryMassParams> {
  //** REQUIRED **//
  earthRadius: number;
  earthMass: number;
  /**
   * The astronomical body around which the planet orbits.
   * @type {AstronomicalBody}
   */
  parentBody: AstronomicalBody;
  //** OPTIONAL **//
  /**
  * Parameters to initialize Planet
  * @type {Atmosphere}
  * @optional
  */
  atmosphere?: Atmosphere;
  /**
    * The Temperature (black body approx) of the Body.
    * @type {number}
    */
  temperature?: number;
    
  }
  
  export interface genPlanetParams {
      parentBody: AstronomicalBody;
      position: PolarCoordinate;
      earthMass?: number
      name?:string
  }
  
  export interface genRandomPlanetParams extends genPlanetParams {
      planetTypes: PlanetConstructor[]
  }
  export interface genRandomFromMassPlanetParams extends genRandomPlanetParams {
      earthMass: number
  }
  