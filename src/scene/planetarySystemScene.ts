import * as THREE from "three";
import * as UNI from "../astronomicalClasses/globalVars";

import { PlanetarySystem } from "../astronomicalClasses/planetarySystem"
import { BaseScene, BaseSceneParams } from "./baseScene"
import { MeshContainer } from "../gameDrawers/basicDrawer";
import { Star } from "../astronomicalClasses/stars";
import { Planet } from "../astronomicalClasses/planet";
import { PlanetarySystemDrawer } from "../gameDrawers/planetarySystemDrawer";
import { Scaler } from "../scaler/scaler";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { AstronomicalBody } from "../astronomicalClasses/baseAstronomicalClasses";



interface PSSceneParams extends BaseSceneParams<PlanetarySystemDrawer> {
	system: PlanetarySystem
	scaler: Scaler
}


export class PlanetarySystemScene extends BaseScene<PlanetarySystemDrawer>{
	protected previouslyHoveredMesh: THREE.Mesh | null = null
	protected prevClickedMesh: THREE.Mesh | null = null
	protected system: PlanetarySystem
	protected scaler: Scaler
	protected camera: THREE.PerspectiveCamera;
	protected speedUpFactor: number = 1e6

	constructor(params: PSSceneParams){
		super(params)
		//** INIT SYSTEM**//
		this.system = params.system
		this.scaler = params.scaler
		this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000)
	}

	initPSScene(renderer: THREE.WebGLRenderer){
		//** SETUP BACKGROUND COLOR */
		const rootStyle = getComputedStyle(document.documentElement);
		const bgColor: string = rootStyle.getPropertyValue('--background-color').trim();	//get the --backgroundcolor css var from .root
		this.scene.background = new THREE.Color(bgColor);	//set background color
		//** DRAW THE SYSTEM */
		this.drawPlanetarySystem()
		this.initCamera(renderer)
		//this.drawGridLines()
		this.initDEVMODE()	//needs to be called after the camera is created
	}

	 initCamera(renderer: THREE.WebGLRenderer, startPos: THREE.Vector3 = new THREE.Vector3(10,6,2)): void {
		Object.values(this.layers).forEach(layerNum => this.camera.layers.enable(layerNum))
		// set init camera position
		this.camera.position.set(startPos.x,startPos.y,startPos.z)
		this.camera.lookAt(this.meshContainers[this.system.getRootBody().name].mesh.position)
		// Specify Camera Controls
		const controls = new OrbitControls(this.camera, renderer.domElement);
		// Optionally, customize the controls
		controls.enableZoom = true;  // Keep zoom functionality
		controls.enablePan = false;  // Disable panning (if you want to restrict it)
	}

	public handleMouseMove(event: MouseEvent, renderer: THREE.WebGLRenderer): void {
			// Calculate mouse position in normalized device coordinates
			const rect = renderer.domElement.getBoundingClientRect();
			this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			// Update the picking ray with the camera and mouse position
			this.raycaster.setFromCamera(this.mouse, this.camera);

			// Calculate objects intersecting the picking ray
			const intersects = this.raycaster.intersectObjects(this.scene.children);

			// Check if there's an intersected mesh
			let intersectedMesh: THREE.Mesh | null = null;

			if (intersects.length > 0) {
					intersectedMesh = intersects[0].object as THREE.Mesh; // Cast to THREE.Mesh
					//console.log(intersectedMesh.material)
			}

			// ** Change cursor style based on hover state **
			if (intersectedMesh) {
			// Set cursor to pointer when hovering over a mesh
					renderer.domElement.style.cursor = 'pointer';
			} else {
			// Reset cursor when not hovering over a mesh
					renderer.domElement.style.cursor = 'default';
			}
			//revert color back when previous mesh != to currentmesh AND the prevMesh wasn't selected
			if (this.previouslyHoveredMesh && this.previouslyHoveredMesh !== intersectedMesh && this.prevClickedMesh !== this.previouslyHoveredMesh) {
					// check if material (probably overerly carefull but whatever)
					if (this.previouslyHoveredMesh.material instanceof THREE.MeshBasicMaterial) {
							//check if prevClicked is not the same as previouslyHovered
							this.previouslyHoveredMesh.material.color.set(this.meshContainers[this.previouslyHoveredMesh.name].originalColor); // Reset to original color
					}
			 
			}
		 
			//when mouse hovers over(intersects) mesh AND the mesh is NOT the same as the previous mesh (when entering the material)
			//-> change the color 
			if (intersectedMesh && intersectedMesh !== this.previouslyHoveredMesh) {
					// Set the new hovered mesh color
					if(intersectedMesh.material instanceof THREE.MeshBasicMaterial){

							intersectedMesh.material.color.set(this.meshContainers[intersectedMesh.name].onHoverColor)

					}
			
					this.previouslyHoveredMesh = intersectedMesh; // Update the previously hovered mesh
			//if there is no intersecting mesh
			} else if (!intersectedMesh) {
					this.previouslyHoveredMesh = null; // Reset if no mesh is hovered
			}
	};
	
	public handleMouseClick(event: MouseEvent, renderer: THREE.WebGLRenderer): void {
		if (this.isDragging) return	//Do nothing if dragging

		const rect = renderer.domElement.getBoundingClientRect();
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(this.meshes);

		let clickedMesh: THREE.Mesh | null = null;

		//if you clicked on a mesh
		if (intersects.length > 0) {
				clickedMesh = intersects[0].object as THREE.Mesh;
				//if you clicked on a new mesh
				if(this.prevClickedMesh !== clickedMesh ){
						console.log("Clicked on new mesh:", clickedMesh, this.system.getBody(clickedMesh.name));
						//set the old mesh color back 
						if (this.prevClickedMesh && this.prevClickedMesh.material instanceof THREE.MeshBasicMaterial) 
								this.prevClickedMesh.material.color.set(this.meshContainers[this.prevClickedMesh.name].originalColor) 
						
						//set the clicked mesh color to the "selected color" AND set prevSelectedMesh to the currently Selected Mesh
						if (clickedMesh.material instanceof THREE.MeshBasicMaterial){
								clickedMesh.material.color.set(this.meshContainers[clickedMesh.name].onHoverColor)
								this.prevClickedMesh = clickedMesh
								this.onMeshSelect(this.system.getBody(clickedMesh.name))
						}
						
				}
		// if you did not click on a mesh -> clicked on background
		} else {
				console.log('clicked on background')
				//if there was a clicked mesh: Revert Mesh Color and set prevClickedMesh to null
				if (this.prevClickedMesh && this.prevClickedMesh.material instanceof THREE.MeshBasicMaterial) {
						this.prevClickedMesh.material.color.set(this.meshContainers[this.prevClickedMesh.name].originalColor)
						this.prevClickedMesh = null
						// Notify the parent 
						this.onMeshSelect(null);
						this.onBackgroundSelect();
				}
		}
		
	}

	/**
	 * Analyzes the distances generated by Titius-Bode to find a suitable base for the logarithmic scale.
	 * @param distances - Array of distances generated by Titius-Bode.
	 * @returns The most suitable base for generating a clean logarithmic grid.
	 */
	private determineOptimalBase(distances: number[]): number {
		const ratios: number[] = [];

		// Calculate ratios between successive distances
		for (let i = 1; i < distances.length; i++) {
				const ratio = distances[i] / distances[i - 1];
				ratios.push(ratio);
		}

		// Find the most common ratio (or average if no clear winner)
		const avgRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
		return Math.round(avgRatio * 10) / 10; // Rounded to 1 decimal
	}


	/**
	 * Generates a logarithmic scale grid for planetary distances based on the Titius-Bode law.
	 * @param base - The base that defines the interval (e.g., 2, 2.5, 3)..
	 * @param scaleFactor - The factor determining the space between each logarithmic step.
	 * @param offset - Offset for starting position.
	 */
	private generateLogarithmicGrid(startd: number, base: number, scaleFactor: number, offset: number) {
			const positions: number[] = [];
		let distance = 0.05; // Start from a small distance for the log scale

		// Generate positions at each step until a maximum distance
		for (let i = 0; i < 20; i++) {
			const logPosition = Math.log(distance) / Math.log(base) * scaleFactor + offset;
			positions.push(logPosition);
			distance *= base; // Move to the next step in the log scale
		}
		return positions;
	}

	/**
	* Generate positions for grid rings at regular intervals using the scaling function.
	* @param interval - The base interval to draw the rings (e.g., every 2 AU, 5 AU, 10 AU).
	* @param count - The number of grid rings to generate.
	* @param base - The base for the logarithmic-like scaling.
	* @param scaleFactor - Scaling factor for spacing on the screen.
	* @param offset - Offset to adjust the start position of the grid.
	* @returns An array of positions where grid rings should be drawn.
	*/
	private generateGridRingPositions(interval: number, count: number, base: number, scaleFactor: number, offset: number): number[] {
		const positions: number[] = [];
		for (let i = 1; i <= count; i++) {
				const distance = interval * i;
				const scaledPosition = this.scaler.scaleDistance(distance, base, scaleFactor, offset);
				positions.push(scaledPosition);
		}
		return positions;
	}

	private drawGridLines(){
		let TBDistances: number[] = Array.from({length:20}, (_, idx) => this.system.titiusBode(idx)
		)
		const gridRadii = this.generateLogarithmicGrid(TBDistances[0],this.determineOptimalBase(TBDistances),4,0)
		TBDistances.forEach(radius => {
			console.log("draw radius at: ", radius, " scaled to: ", this.scaler.scaleSysPlanetaryDistances(radius) )
			let ringMesh = this.drawer.drawScaleGridLines(this.scaler, radius)
			this.scene.add(ringMesh)
		})
	}

	private drawPlanetarySystem(){
		const bodies = this.system.getBodies()
		//create and place meshes
		bodies.forEach(body => {
			if(body instanceof Star){
				const starMeshContainer = this.drawer.drawStar(body, this.scaler)
				this.meshContainers[body.name] = starMeshContainer
				this.scene.add(starMeshContainer.mesh)
				this.meshes.push(starMeshContainer.mesh)

			} else if (body instanceof Planet){
				const plMeshContainer = this.drawer.drawPlanet(body, this.scaler)
				this.meshContainers[body.name] = plMeshContainer
				this.scene.add(plMeshContainer.mesh)
				this.meshes.push(plMeshContainer.mesh)

			}
		})
	}

	/**
	 *  Update positions of all meshes recursively going from parent to satellite
	 * @param body should be the ROOTBODY of the system 
	 *
	 * @param meshes Record of all meshes in the scene
	 * @param parentPosition position of the parent body on the scene (cart coordinates)
	 */
	private updatePositionRecursively (body: AstronomicalBody, meshes: Record<string, MeshContainer>, parentPosition: THREE.Vector3, deltaTime: number) {
		
		const mesh = meshes[body.name].mesh;
		if (mesh) {
			// Check if the body has a position (assuming planets/moons have polar coordinates)
			if (body instanceof Planet ) {
				const direction = body.retrograde ? -1 : 1
				const updatedTheta = direction * this.speedUpFactor * Math.PI*2*(deltaTime/UNI.SECONDS_PER_DAY)/body.orbitalPeriod //Adjust speed as needed orbitalPeriod is now in days(24h)
				// Update the angular position for the orbit
				body.position.t = (body.position.t + updatedTheta ) % (Math.PI * 2); //  clamp between [0,2*PI]

				// Get the orbital radius (relative distance to the parent)
				let r;
				if(body.parentBody instanceof Star){
					r = meshes[body.name].drawnOrbitalDistance
				} else {
					r = meshes[body.name].drawnOrbitalDistance
				}
				const theta = body.position.t; // Current angle in radians

				// Convert polar coordinates to Cartesian
				const x = r * Math.cos(theta);
				const z = r * Math.sin(theta);

				// Set the mesh position relative to the parent's position
				mesh.position.set(parentPosition.x + x, parentPosition.y, parentPosition.z + z);
			}

			// Recursively update all natural satellites (children)
			if (body.naturalSatellites && body.naturalSatellites.length > 0) {
				body.naturalSatellites.forEach((satellite) => {
					// Recursively update each satellite, using the current body's new position as the parent position
					this.updatePositionRecursively(satellite, meshes, mesh.position, deltaTime);
				});
			}
		}
	};

	public updateScene(deltaTime: number, frameTime: number){
		//rotate all bodies
		this.meshes.forEach(meshBody => {
			meshBody.rotation.y += 0.001 * frameTime * 60;
		})
		//update all positions
		this.updatePositionRecursively(this.system.rootBody, this.meshContainers, this.meshContainers[this.system.rootBody.name].mesh.position, deltaTime )
	}



}