import { WebGLRenderer } from "three";
import * as THREE from "three";
import { BaseScene } from "../scene/baseScene";
import { BasicGameDrawer } from "../gameDrawers/basicDrawer";

interface AnimationMNGParams {
	currentScene: BaseScene<BasicGameDrawer>
	targetFPS: number
}
export class AnimationManager {
	currScene: BaseScene<BasicGameDrawer>;	
	private animationID: number = 0

	private targetFPS: number	// Target 60 frames per second unless passed different argument
	private frameTime: number // Time per frame in seconds (e.g., 1/30 = ~0.033s)
	private updateInterval: number = 2	// Perform incremental updates every 1 second

	private lastTime = performance.now() //Track when last frame was rendered
	private lastUpdate = performance.now()

	private elapsedTime = 0

	constructor(params: AnimationMNGParams){
		this.currScene = params.currentScene

		this.targetFPS = params.targetFPS ?? 60
		this.frameTime = 1/this.targetFPS
	}

	public updateTargetFPS(target: number){
		this.targetFPS = target
	}

	public getAnimationID(): number{
		return this.animationID
	}

	public cleanup(){
		cancelAnimationFrame(this.animationID)
		this.animationID = 0; 
	}

	public initLoop(renderer: THREE.WebGLRenderer){
		this.animate(renderer)
	}

	// loop
	private animate(renderer: THREE.WebGLRenderer){
		const currentTime = performance.now();
		let deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
		this.lastTime = currentTime;
		
		// ** GAME LOOP **
		// calculates the time since last drawn animation if that is larger continue updating the 
		// game state until the time is less than delta time
		while (deltaTime >= this.frameTime) {
			//** ANIMATE THE SCENE **/
			this.currScene.updateScene(deltaTime, this.frameTime)
			//** UPDATE GAME LOOP **/
			if (currentTime - this.lastUpdate >= this.updateInterval * 1000) { // Check if it's time to update the game state
				//CALL UPDATE GAMESTATES FUNCTION
				console.log("the state of the scene at ", this.elapsedTime, ": ", this.currScene)
				this.elapsedTime += this.updateInterval
				this.lastUpdate = currentTime; // Reset last update time
			}
			deltaTime -= this.frameTime; // Subtract the frame time until deltaTime is less than frameTime
		}

		this.lastTime = currentTime;

		// Render the scene with the camera
		renderer.render(this.currScene.getScene(), this.currScene.getCamera());

		// Request the next animation frame
		this.animationID = requestAnimationFrame(()=> this.animate(renderer)); //arrow functions automatically bind 'this.' calls to the context (animationManager)
	};

}