import * as THREE from "three";
import * as UNI from "../astronomicalClasses/globalVars";


export class MeshContainer{
	mesh: THREE.Mesh;
	originalColor: THREE.Color;
	onHoverColor: THREE.Color;
	drawnOrbitalDistance: number
	selected: boolean 
	constructor(mesh: THREE.Mesh, originalColor: THREE.Color, drawnOrbitalDistance: number, onHoverColor?: THREE.Color){
			this.mesh = mesh
			this.originalColor = originalColor
			this.drawnOrbitalDistance = drawnOrbitalDistance
			this.onHoverColor = onHoverColor ?? originalColor
			this.selected = false
	}
}
export interface BasicGamerDrawerParams {
}

export class BasicGameDrawer {
	constructor(){
	}

	/**
	 * Color Shifts the given THREE.Color 
	 * @param color the original color from where you are color shifting
	 * @param modifier negative values darken, positive values lighten (val between 0 and 1)
	 * @returns A THREE.Color shifted by the modifier
	 */
	protected onHoverColorShift(color: THREE.Color, modifier: number): THREE.Color{

		const modifiedColor = new THREE.Color(color); // Clone the original color

    // Modify the RGB components ---> 
    modifiedColor.r = Math.min(1, Math.max(0, modifiedColor.r + modifier));
    modifiedColor.g = Math.min(1, Math.max(0, modifiedColor.g + modifier));
    modifiedColor.b = Math.min(1, Math.max(0, modifiedColor.b + modifier));

    return modifiedColor; // Return the modified color

	}

	/**
	 * Function to adjust intensity based on wavelength, factor and GAMMA
	 * @param color an r || g || b number between [0,255]
	 * @param factor between [??,??]
	 * @param [gamma=UNI.GAMMA] optional gamma for intensity adjustment, larger than 1 makes shadows darker, smaller than 1 lightens regions
	 * @returns the factored, gamma shifted color that was supplied
	 */
	protected adjustIntensity(color: number, factor: number, gamma: number = UNI.GAMMA): number {
    const maxIntensity = 255
    if (color === 0) {
        return 0;
    } else {
        return Math.round(maxIntensity * Math.pow(color * factor, gamma)); // Apply gamma correction
    }
	}

	protected drawSphere(name: string, radius: number, color: THREE.Color, widthSegments?: number, heightSegments?: number): THREE.Mesh{
		//** CREATE DEFAULT SEGMENTS **/
		const segmentScaleFactor = 12; // Adjust this factor to change detail level
    const defaultWidthSegments = widthSegments ?? Math.max(Math.floor(radius * segmentScaleFactor), 3);
    const defaultHeightSegments = heightSegments ?? Math.max(Math.floor(radius * segmentScaleFactor), 2);

    //** CREATE GEOMETRY **/ 
		const sphereGeometry = new THREE.SphereGeometry(radius, defaultWidthSegments, defaultHeightSegments); // Create a sphere
		const sphereMaterial = new THREE.MeshBasicMaterial({
			color: color,
			wireframe: true,    // Enable wireframe mode
			transparent: true,  // Enable transparency
			opacity: 1        // Set opacity (0 to 1)
		});
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.name = name
		// return Mesh
		return sphere
			
	}

	protected drawCircleOutline( radius: number, segments: number, color: string): THREE.LineLoop {
    const points: THREE.Vector3[] = [];
		debugger
    // Calculate points for the circle outline
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2; // Full circle
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x, 0, z));
    }
  
    // Create a geometry from the points
    const circleGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
    // Create a material for the circle outline
    const circleMaterial = new THREE.LineBasicMaterial({ color });
  
    // Create a line loop from the geometry
    const circleOutline = new THREE.LineLoop(circleGeometry, circleMaterial);

    return circleOutline
  }


}

