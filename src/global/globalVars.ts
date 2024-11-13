
/**
 *    GLOBAL VARIABLES / CONSTANTS / STRINGS
 * 
 *    
 * 
 * 
 */


export const GAMMA = 0.8

export const STEFAN_BOLTZMANN_CONSTANT = 5.670374419e-8; // in W/m^2K^4	from the eponym law, relates luminosity, radius and temp in stars
export const UNIVERSAL_GRAVITATIONAL_CONSTANT = 6.67e-11	// in Nm2/kg2		relates thermal energy of particles in gas with temp of gas

export const BOLTZMANN_CONSTANT = 1.38e-23	// J/K
export const SOLAR_LUMINOSITY = 3.828e26;  // Solar luminosity in watts
export const SOLAR_RADIUS = 6.96e8;        // Solar radius in meters
export const SOLAR_MASS = 1.9889e30;      //in kg

export const EARTH_MASS = 5.9722e24				// in kg
export const EARTH_RADIUS = 6.3781e6				// in m
export const ASTRO_UNIT = 1.495978707e11;		// m

export const SECONDS_PER_DAY = 86400

export const AVG_TERRAN_DENSITY = 5500;  //kg/m³

export const TITUS_BODE_MEAN_FACTOR = 2
export const TITUS_BODE_STD_DEV = 0.5
export const TITIUS_BODE_MINIMUM_OFFSET = 0.0001 //when calculating Titius Bode formula the initial distance cannot be 0


export const MAX_PLANETARY_ORBITAL_DISTANCE = 2500 //in AU ...known max is actually 12000! for 1.1Rj|10.5Mj exoplanet https://en.wikipedia.org/wiki/Gliese_900#Planetary_system
// export const MIN_PLANETARY_ORBITAL_DISTANCE = ?? //this you should calc i think
export const MIN_PLANETARY_RADIUS = 0.1
export const MAX_PLANETARY_RADIUS = 100 //actual is +- 330 https://en.wikipedia.org/wiki/List_of_largest_exoplanets



export const INITIAL_PLANET_STAR_MEAN_OFFSET = 0.1 //in AU (is the mean avg distance of the first possible planet (will still check rochelimits))
export const INITIAL_PLANET_DIST_STD_DEV_RIGHT = 0.5
export const INITIAL_PLANET_DIST_STD_DEV_LEFT = 0.05

export const AVAILABLE_MASS_FOR_MOONS_FRACTION = 0.015 //the fraction of mass available for moon creation of a planet: ei 0.015*pl.mass will be available for moon creation
export const MIN_MOON_SPACING = 0.002
export const MOON_SPACING_SAFETY_OFFSET = 0.0005

export const MINIMUM_MOON_MASS = 0.001//Temp for now until moon creation is an option in PLANET.genRandom
export const MINIMUM_PLANET_MASS = 0.001

export const HYDROSTATIC_EQUILIBRIUM_LIMIT = 1e-4 //Minimum mass necessary to be spherical under own mass

export const LOWER_TERRAN_MASS_BOUND = 0.001;
export const UPPER_TERRAN_MASS_BOUND = 2;

export const LOWER_SUPERTERRAN_MASS_BOUND = 2;
export const UPPER_SUPERTERRAN_MASS_BOUND = 10;

export const LOWER_MININEPTUNIAN_MASS_BOUND = 10
export const UPPER_MININEPTUNIAN_MASS_BOUND = 25

export const LOWER_ICE_GIANT_MASS_BOUND = 25
export const UPPER_ICE_GIANT_MASS_BOUND = 100

export const LOWER_GAS_GIANT_MASS_BOUND = 100
export const UPPER_GAS_GIANT_MASS_BOUND = 3000

export const K_TYPE_MAIN_SEQUENCE_MASS_LOWERBOUND = 0.5  //solarmass
export const K_TYPE_MAIN_SEQUENCE_MASS_UPPERBOUND = 0.9  //solarmass


export const ODDS_FOR_PLANET_MSQ = [0.05, 0.8, 0.4, 0.1, 0.025] //impossible,high, average, unlikely, incredibly unlikely(you'll get 1 or 2 chances at this distance)

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

export const ELEMENTS: Set<string> = new Set(['H', 'O', 'C', 'Fe', 'S', 'N']); // Add more elements as needed



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

