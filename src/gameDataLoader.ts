import { InitialMineralData, MineralDataParser } from "./materials/initMineralDataTransformer";
import { Mineral } from "./materials/materialsMinerals";
import initRawMineralData from './materials/initRawMineralData.json'; // The initial Mineral data 
import { BaseMaterial } from "./materials/materials";
import { PlanetarySystem } from "./astronomicalClasses/planetarySystem";

export class GameStateContainer{
    INITIAL_UNIVERSE_MATERIALS: BaseMaterial[] = []
    INITIAL_GALAXY: number = 0
    FOUND_PLANETARY_SYSTEMS: PlanetarySystem[] = []
    CREATED_MATERIALS: BaseMaterial[] = []
    constructor(){
    }


    public importData(initMat: BaseMaterial[]){
        this.INITIAL_UNIVERSE_MATERIALS = initMat
    }

    
}

export class GameDataLoader {
    mineralParser = new MineralDataParser() //<----------the work done here could possibly be done once and then i could ship with the completed JSON file and add via the methods within
    public GAME_MINERALS: Mineral[] = []
  
    constructor() {
        this.loadAllData()    
    }

    protected loadAllData(){
        console.log("_______called load all data___")
        this.loadMaterialsFromLocalStorage()
    }

    private loadInitialMineralData(){
        //Specify Type data incoming JSON file type
        const initMinerals: InitialMineralData[] = initRawMineralData as InitialMineralData[];
        //transform the incoming initial data into an array of Mineral Classes
        const mineralObjectArray: Mineral[] = this.mineralParser.intialTransformFromRawJSON(initMinerals)
        //set GAME_MINERALS to the transformed initRawMineralData
        this.GAME_MINERALS = mineralObjectArray
        console.log("Transformed and set GAME_MINERALS from the INITIAL_MINERALS")
        //since no minerals were Loaded from local storage store the MineralClassesArray  
        localStorage.setItem('minerals', JSON.stringify(mineralObjectArray));
        console.log("stored MineralArray in local storage")
    }
    
    private loadMaterialsFromLocalStorage(){
        /**
         *  TEMP DEV FUNCTION
         *  clears storage so that mineral data is remade from the mineralJSON every time game is reloaded.
         * 
         */
        //localStorage.clear();   //<--------------------------REMOVE !!!!!!!!! This clears local storage for dev


        /**
         *      LOAD IN GLOBAL MINERAL DATA
         */
        const mineralData = localStorage.getItem('minerals'); // from local storage, Data from local storage is STRING
        if (!mineralData) { 
            this.loadInitialMineralData()
          } else {
            console.log("JSON PARSE ERROR?", mineralData)
            this.GAME_MINERALS = JSON.parse(mineralData)    //PARSE AND ASSIGN JSON MINERALARRAY STRING
            console.log("Mineral data loaded and assigned from local storage.");
          }
    }
  
    
    async loadOtherData() {
    }
  }
  