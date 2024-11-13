import { WebGLRenderer, Vector3, Camera } from "three";
import { PlanetSceneDrawer } from "../gameDrawers/PlanetSceneDrawer";
import { BaseScene, BaseSceneParams } from "./baseScene";
import * as THREE from "three";


interface PlanetSceneParams extends BaseSceneParams<PlanetSceneDrawer>{

}

export class PlanetScene extends BaseScene<PlanetSceneDrawer>{
    constructor(params: PlanetSceneParams){
        super(params)
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000)

    }

    initCamera(renderer: WebGLRenderer, pos?: Vector3): void {
        
    }
    protected camera: Camera;

    handleMouseClick(event: MouseEvent, renderer: WebGLRenderer): void {
        
    }

    handleMouseMove(event: MouseEvent, renderer: WebGLRenderer): void {
        

    }

    updateScene(deltaTime: number, frameTime: number): void {
        
    }
}