import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './ThreeJSCanvas.module.css'
import { PlanetarySystem } from "./astronomicalClasses/planetarySystem";
import { AstronomicalBody } from "./astronomicalClasses/baseAstronomicalClasses";
import { PlanetarySystemScene } from "./scene/planetarySystemScene";
import { Scaler } from "./scaler/scaler";
import { PlanetarySystemDrawer } from "./gameDrawers/planetarySystemDrawer";
import { AnimationManager } from "./gameManagers/animationManager";
import { BaseScene } from "./scene/baseScene";
import { useGameData } from "./GameDataContext";
import { PlanetarySystemBuilder } from "./builders/planetarySystemBuilder";
import { GameDataLoader } from "./gameDataLoader";
import { PolarCoordinate } from "./astronomicalClasses/polarCoordinate";

interface ThreeJSCanvasProps {
    DEVMODE?: boolean;
    onMeshSelect: (meshName: AstronomicalBody | null) => void; // function to pass info to App
    onBackgroundSelect: () => void;
  }

/**
 * TO/SHOULD DO:
 *  INITIALIZE RENDERER
 *  ATTACH RENDERER TO CANVASREF
 *  MANAGE RESIZING
 *  HANDLE SCENE SWITCHING
 */
const ThreeJSCanvasNew: React.FC<ThreeJSCanvasProps> = ({ DEVMODE = true, onMeshSelect, onBackgroundSelect }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const data = useGameData();
    const dataLoader = new GameDataLoader()
    const sysBuilder = new PlanetarySystemBuilder(dataLoader.GAME_MINERALS, "Milky-Way")


    useEffect(() => {
        const renderer = new THREE.WebGLRenderer();
        console.log("my data from storage:", data.GAME_MINERALS);
        //const rootStyle = getComputedStyle(document.documentElement);
        let my3DScenes = {}
        let currScene = undefined
        const sys = sysBuilder.genRandSimplePlanetarySystem("Icarus", new PolarCoordinate(17,Math.PI, 0))
        console.log("___SYS___", sys)
        let myPLSScene = new PlanetarySystemScene({
            gameData: data,
            system: sys,
            scaler: new Scaler(),
            drawer: new PlanetarySystemDrawer(),
            DEVMODE: DEVMODE,
            onMeshSelect: onMeshSelect,
            onBackgroundSelect: onBackgroundSelect
        })

        currScene = myPLSScene
        //** DRAW THE PLANETARY SYSTEM **//
        myPLSScene.initPSScene(renderer)
        
        //** EVENT METHODS**/
        const handleResize = () => setRendererSize(renderer, currScene);
        const handleMouseClick = (event: MouseEvent) => currScene.handleMouseClick(event, renderer);
        const handleMouseMove = (event: MouseEvent) => currScene.handleMouseMove(event, renderer);
        const handleMouseDown = (event: MouseEvent) => currScene.onMouseDown(event);
        const handleMouseUp = (event: MouseEvent) => currScene.onMouseUp(event, renderer);
        
        

        function setRendererSize(renderer: THREE.WebGLRenderer, currScene: BaseScene<any>){
            if (canvasRef.current) {
                const { clientWidth, clientHeight } = canvasRef.current;
                renderer.setSize(clientWidth, clientHeight);
                // Adjust the aspect ratio
                const updateSceneCamera = currScene.getCamera();
                if(updateSceneCamera instanceof THREE.PerspectiveCamera){
                    updateSceneCamera.aspect = clientWidth / clientHeight;
                    updateSceneCamera.updateProjectionMatrix();
                }
            }
        };

        // ** Attach Renderer to Canvas **
        if (canvasRef.current) {
            setRendererSize(renderer, currScene); // Use the helper function
            canvasRef.current.appendChild(renderer.domElement);
        }
        
        let animManager = new AnimationManager({
            currentScene: currScene,
            targetFPS: 60})

        /*------------------------
                INIT LOOP
        --------------------------*/
        animManager.initLoop(renderer);

        


       /**
        *  EVENT LISTENERS
        */
        if (renderer.domElement) {
            renderer.domElement.addEventListener('click', handleMouseClick);
            renderer.domElement.addEventListener('mousedown', handleMouseDown);
            renderer.domElement.addEventListener('mouseup', handleMouseUp);
        }
        // Add event listener for mousemove 
        window.addEventListener('mousemove', handleMouseMove);
        // ** Attach event listener to window for resize
        //checks if window has been resized
        window.addEventListener('resize', handleResize);
        
        /**
         *  ON UNMOUNT RETURN IS CALLED
         *  clean up the scenes and eventlisteners
         */
        return () => {
            //--------------
            //   CANCEL ANIMATIONS
            //----------
            animManager.cleanup();

            //-----------------------------------
            //   DISPOSE GEOMETRIES, MATERIALS AND TEXTURES
            //-------------------------------
            currScene.disposeScene()

            //  DISPOSE OF RENDERER
            renderer.dispose();

            // ** REMOVE THE EVENT LISTENERS **
            //remove window resize
            window.removeEventListener('resize', handleResize);
            //remove mousemove handler
            window.removeEventListener('mousemove', handleMouseMove);
            //remove click handler
            if (renderer.domElement) {
                renderer.domElement.removeEventListener('click', handleMouseClick);
                renderer.domElement.removeEventListener('mousedown', handleMouseDown);
                renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            }

            // Cleanup appended canvas from DOM 
            /*since react Strict mode renders everything twice (to find bugs) you need to remove the renderer from the DOM element or it will create 2 renderers*/ 
            if (canvasRef.current && renderer.domElement) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);
    
    /*
    return <div ref={canvasRef} style={{width:'100%', height:'100%', display:'flex'}}  />;
    */
   return <div ref={canvasRef} className={styles.canvasContainer} />
};

export default ThreeJSCanvasNew;