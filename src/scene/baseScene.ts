import * as THREE from "three";
import { AstronomicalBody } from "../astronomicalClasses/baseAstronomicalClasses";
import { BasicGameDrawer, MeshContainer } from "../gameDrawers/basicDrawer";
import { Renderer } from "three/webgpu";
import { GameDataLoader } from "../gameDataLoader";

export interface BaseSceneParams<TDrawer extends BasicGameDrawer> {

	drawer: TDrawer
	DEVMODE: Boolean
	gameData: GameDataLoader
	onMeshSelect: (body: AstronomicalBody | null) => void;
	onBackgroundSelect: () => void;

}

/**
 * TDrawer: Type Drawer (is a Generic)
 * 
 */
export abstract class BaseScene<TDrawer extends BasicGameDrawer>  {
	protected scene: THREE.Scene
	protected mouse: THREE.Vector2
	protected drawer: TDrawer
	protected gameData: GameDataLoader
	protected abstract camera: THREE.Camera; 

	protected meshContainers:Record<string, MeshContainer>  = {}
	//meshes are only for meshes that are in the astroBodyLayer
	protected meshes: THREE.Mesh[] = []
	//for the grid lines
	protected scaleGridMeshes: THREE.LineLoop[] = []


	protected raycaster: THREE.Raycaster = new THREE.Raycaster()
	protected DEVMODE: Boolean
	protected layers: {[key: string]: number} = {
		'astroBodyLayer': 0,
		'informationLayer': 1,
	}

	protected mouseDownPosition = { x: 0, y: 0 };	// Track where the mouse was when pressed
	protected isDragging:Boolean = false	// Flag to track if the user is dragging

	protected onMeshSelect: (body: AstronomicalBody | null) => void;
  	protected onBackgroundSelect: () => void;

	/**
	 * BaseScene Class Constructor
	 * @param params 
	 */
	constructor(params: BaseSceneParams<TDrawer>){
		this.scene = new THREE.Scene()
		this.mouse = new THREE.Vector2()
		this.drawer = params.drawer
		this.DEVMODE = params.DEVMODE
		this.gameData = params.gameData
		

		this.onMeshSelect = params.onMeshSelect
		this.onBackgroundSelect = params.onBackgroundSelect

		//** INIT RAYCASTER **// ----> maybe move to extended classes?
		this.raycaster.layers.set(this.layers['astroBodyLayer'])
	}
	
	//TEMP FOR DEBUGGING
	public __getMeshContainers(){
		return this.meshContainers
	}

	public getCamera(){
		return this.camera
	}

	public getScene(){
		return this.scene
	}

	public disposeScene(){
		this.meshes.forEach(mesh => {
			this.disposeMesh(mesh)
		})
		this.scaleGridMeshes.forEach(mesh => {
			this.disposeLineLoop(mesh)
		})
	}

	//** TO DISTINGUISH DRAGS FROM CLICKS **/
	public onMouseDown (event: MouseEvent) {
			// Record the initial mouse down position
			this.mouseDownPosition.x = event.clientX;
			this.mouseDownPosition.y = event.clientY;
			
			// Reset dragging flag
			this.isDragging = false;
	};

	public onMouseUp (event: MouseEvent, renderer: THREE.WebGLRenderer)  {
			// Calculate the distance the mouse moved between down and up events
			const dx = event.clientX - this.mouseDownPosition.x;
			const dy = event.clientY - this.mouseDownPosition.y;
			
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			// Define a threshold for what is considered a drag vs a click
			const dragThreshold = 5; // Pixels

			// If the mouse moved more than the threshold, it's a drag, not a click
			if (distance > dragThreshold) {
					this.isDragging = true;
			} else {
					// If it wasn't a drag, handle it as a click
					this.handleMouseClick(event, renderer);
			}
	};

	
	protected addLayer(name: string){
		//add key:[name] to layers with value the max value of layers + 1
		this.layers[name] = Math.max(...Object.values(this.layers)) + 1
	}
	// DEVMODE IS IGNORED BY RAYCASTER
	protected initDEVMODE(){
		// add a devmode layer and allow the camera to see it
		this.addLayer('DEVMODE')
		if (this.camera) this.camera.layers.enable(this.layers['DEVMODE'])
		//** AXIS HELPER **//  
		const axesHelper = new THREE.AxesHelper(5); // x = red, y = green, z = blue
		axesHelper.layers.set(this.layers['DEVMODE']); // This will only be rendered, not checked by the raycaster
		this.scene.add(axesHelper);        
		
	}


	//** ABSTRACT METHODS MUST BE IMPLEMENTED BY CHILD CLASSES**/
	abstract handleMouseMove(event:MouseEvent, renderer: THREE.WebGLRenderer): void

	abstract handleMouseClick(event: MouseEvent, renderer: THREE.WebGLRenderer): void

	abstract initCamera(renderer: THREE.WebGLRenderer, pos?: THREE.Vector3): void

	abstract updateScene(deltaTime: number, frameTime: number): void

	/**
	 * Removes a mesh from the scene
	 * @param mesh 
	 */
	protected disposeMesh(mesh: THREE.Mesh) {
		// Remove the mesh from the scene
		this.scene.remove(mesh);
		console.log("disposed mesh)")
		// Dispose of geometry
		if (mesh.geometry) {
			mesh.geometry.dispose();
		}

		// Dispose of material (handling both single and multi-material cases)
		if (mesh.material) {
			if (Array.isArray(mesh.material)) {
				// Loop through each material if it's an array
				mesh.material.forEach(material => {
					if (material) { //&& typeof material.dispose === 'function' REMOVED this because it seems unnecessary
							material.dispose();
					}
				});
			} else {	//removed the same typeof function check
				mesh.material.dispose();
			}
		}
	}

	protected disposeLineLoop(lineLoop: THREE.LineLoop) {
		// Remove from the scene or parent object
		if (lineLoop.parent) {
			lineLoop.parent.remove(lineLoop);
		}
	
		// Dispose of the geometry
		if (lineLoop.geometry) {
			lineLoop.geometry.dispose();
		}
	
		// Dispose of the material
		if (lineLoop.material) {
			// Check if material is an array (multiple materials)
			if (Array.isArray(lineLoop.material)) {
				lineLoop.material.forEach(material => material.dispose());
			} else {
				lineLoop.material.dispose();
			}
		}
	
	}


}
