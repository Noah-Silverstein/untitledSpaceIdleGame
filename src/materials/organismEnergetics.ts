

interface TrophicModeProperties {
    description: string     //describes the method by which the organism gets energy
}


interface TrophicModeParams {
    mode: string
    properties: TrophicModeProperties
}

export class TrophicMode{
    mode: string 
    properties: TrophicModeProperties
    constructor(params: TrophicModeParams){
        this.mode = params.mode
        this.properties = params.properties
    }

}


//------------------------------ Phototroph ------------------------------
/**
 * Phototroph Properties
 */
const PHOTOTROPH_PROPERTIES: TrophicModeProperties = {
    description: "Organisms that obtain energy from sunlight through photosynthesis."
};

/**
 * The Phototroph Trophic Mode for an organism
 */
const PHOTOTROPH: TrophicMode = new TrophicMode({
    mode: "Phototroph",
    properties: PHOTOTROPH_PROPERTIES
});

//------------------------------ Chemotroph ------------------------------
/**
 * Chemotroph Properties
 */
const CHEMOTROPH_PROPERTIES: TrophicModeProperties = {
    description: "Organisms that obtain energy from chemical reactions, typically by oxidizing inorganic or organic substances."
};

/**
 * The Chemotroph Trophic Mode for an organism
 */
const CHEMOTROPH: TrophicMode = new TrophicMode({
    mode: "Chemotroph",
    properties: CHEMOTROPH_PROPERTIES
});

//------------------------------ Heterotroph ------------------------------
/**
 * Heterotroph Properties
 */
const HETEROTROPH_PROPERTIES: TrophicModeProperties = {
    description: "Organisms that obtain energy by consuming organic matter produced by other organisms."
};

/**
 * The Heterotroph Trophic Mode for an organism
 */
const HETEROTROPH: TrophicMode = new TrophicMode({
    mode: "Heterotroph",
    properties: HETEROTROPH_PROPERTIES
});

//------------------------------ Lithotroph ------------------------------
/**
 * Lithotroph Properties
 */
const LITHOTROPH_PROPERTIES: TrophicModeProperties = {
    description: "Organisms that obtain energy from inorganic compounds, particularly by oxidizing minerals."
};

/**
 * The Lithotroph Trophic Mode for an organism
 */
const LITHOTROPH: TrophicMode = new TrophicMode({
    mode: "Lithotroph",
    properties: LITHOTROPH_PROPERTIES
});

//------------------------------ Mixotroph ------------------------------
/**
 * Mixotroph Properties
 */
const MIXOTROPH_PROPERTIES: TrophicModeProperties = {
    description: "Organisms that can obtain energy from both autotrophic (e.g., photosynthesis) and heterotrophic (e.g., consuming other organisms) means."
};

/**
 * The Mixotroph Trophic Mode for an organism
 */
const MIXOTROPH: TrophicMode = new TrophicMode({
    mode: "Mixotroph",
    properties: MIXOTROPH_PROPERTIES
});

// Exporting the trophic modes
export const TROPHIC_MODES = [
    PHOTOTROPH, 
    CHEMOTROPH, 
    HETEROTROPH, 
    LITHOTROPH, 
    MIXOTROPH
];
