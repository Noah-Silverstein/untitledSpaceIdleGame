
/**
 *    GLOBAL VARIABLES / CONSTANTS / STRINGS
 * 
 *    
 * 
 * 
 */


export const STEFAN_BOLTZMANN_CONSTANT = 5.670374419e-8; // in W/m^2K^4	from the eponym law, relates luminosity, radius and temp in stars
export const UNIVERSAL_GRAVITATIONAL_CONSTANT = 6.67e-11	// in Nm2/kg2		relates thermal energy of particles in gas with temp of gas

export const BOLTZMANN_CONSTANT = 1.38e-23	// J/K
export const SOLAR_LUMINOSITY = 3.828e26;  // Solar luminosity in watts
export const SOLAR_RADIUS = 6.96e8;        // Solar radius in meters
export const SOLAR_MASS = 1.9889e30;      //in kg

export const EARTH_MASS = 5.9722e24				// in kg
export const EARTH_RADIUS = 6.3781e6				// in m
export const ASTRO_UNIT = 149597870.7e3;		// m

export const AVG_TERRAN_DENSITY = 5500;  //kg/m³
export const MAX_ORBITAL_RADIUS = 500; //in AU

export const K_TYPE_MAIN_SEQUENCE_MASS_LOWERBOUND = 0.5  //solarmass
export const K_TYPE_MAIN_SEQUENCE_MASS_UPPERBOUND = 0.9  //solarmass


export const PLANET_LIKELYHOOD_ODDS = [0.7, 0.35, 0.1, 0.025] //high, average, unlikely
export const MAIN_SEQUENCE_PLANET_LIKELIHOOD: Record<string,  number[] > = {  //VALS IN AU
  oType: [0.1, 1, 5, 10],  // Impossible?, High, Average,Unlikely, +Unlikely?
  bType: [0.1, 5, 15, 30], 
  aType: [0.5, 10, 25, 50], 
  fType: [1, 15, 30, 50],  
  gType: [1, 20, 50, 100], 
  kType: [0.5, 30, 50, 100], 
  mType: [0.1, 2, 5, 10],  
};

export const PLANET_OFFSET_SAFETY = 0.5 //in AU used to place planets in solarsystems add to Hill Radius to get minimum distance

export type Element = 'H' | 'O' | 'C' | 'Fe'
export type AtmosphericGas = 'CO2' | 'N2' | 'SO2' | 'O2' | 'H2O' | 'NH3' | 'CH4' | 'O';
//NH3 = Ammonia, CH4 = Methane, 
export const AtmosphericGasWeights: Record<AtmosphericGas, number> = {
		CO2: 44.01,
    N2: 28.02,
    SO2: 64.07,
    O2: 32.00,
    H2O: 18.02,
    NH3: 17.03,
    CH4: 16.04,
    O: 16.00
}

