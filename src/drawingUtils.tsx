//all drawing functions in this file

import * as THREE from "three";
import {Star} from './astronomicalClasses/Stars.tsx'
import { Planet, Terran } from "./astronomicalClasses/plannetClasses.ts";


export class MeshContainer{
    mesh: THREE.Mesh;
    originalColor: THREE.Color;
    onHoverColor: THREE.Color;
    selected: boolean 
    constructor(mesh: THREE.Mesh, originalColor: THREE.Color, onHoverColor: THREE.Color = rgbStringToTHREEColor('rgb(0, 0, 0)')){
        this.mesh = mesh
        this.originalColor = originalColor
        this.onHoverColor = onHoverColor ?? originalColor
        this.selected = false
    }
}


/**
 * Draws a circle outline in the specified scene on the XZ plane.
 * 
 * @param scene - The Three.js scene to which the circle will be added.
 * @param radius - The radius of the circle.
 * @param segments - The number of segments used to approximate the circle.
 * @param color - The color of the circle outline.
 */
export function drawCircle(scene: THREE.Scene, radius: number, segments: number, color: string): THREE.LineLoop {
    const points: THREE.Vector3[] = [];
  
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
  
    // Add the circle outline to the scene
    scene.add(circleOutline);

    return circleOutline
  }

export function drawSphere(scene: THREE.Scene, radius: number, widthSegments: number, heightSegments: number, color: THREE.Color): THREE.Mesh{
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments); // Create a sphere
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,    // Enable wireframe mode
        transparent: true,  // Enable transparency
        opacity: 1        // Set opacity (0 to 1)
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    scene.add(sphere);
    return sphere
}

/**
 * Function to lighten or darken a THREE.Color.
 * 
 * @param color - The original color in THREE.Color format 
 * @param modifier - A number that determines how much to lighten/darken the color.
 *                negative darkens, positive lightens
 * @returns The a modified THREE.Color instance (the original remains unchanged).
 */
function modifyColor(color: THREE.Color, modifier: number): THREE.Color {
    // Create a new color based on the original
    const modifiedColor = new THREE.Color(color); // Clone the original color

    // Modify the RGB components
    modifiedColor.r = Math.min(1, Math.max(0, modifiedColor.r + modifier / 255));
    modifiedColor.g = Math.min(1, Math.max(0, modifiedColor.g + modifier / 255));
    modifiedColor.b = Math.min(1, Math.max(0, modifiedColor.b + modifier / 255));

    return modifiedColor; // Return the modified color
}

function getPlanetColor(planet: Planet){
    console.log(planet.name, "colored this planet")
    return rgbStringToTHREEColor('rgb(43, 230, 14)');
}

export function rgbStringToTHREEColor(rgbString: string) {
    // Use a regular expression to extract the numbers from the 'rgb(r, g, b)' format
    const match = rgbString.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    
    if (!match) {
        throw new Error('Invalid RGB string format');
    }

    // Extract the RGB values from the match
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    
    // Create and return a new THREE.Color instance
    return new THREE.Color(r/255, g/255, b/255);
} 

// Function to adjust intensity based on wavelength
function adjustIntensity(color: number, factor: number): number {
    if (color === 0) return 0;
    return Math.round(255 * Math.pow(color * factor, 0.8)); // Apply gamma correction
}
/**
 * Estimate Color(RGB) based on WaveLength
 * 
 * @param wavelength - wavelength in nm
 * '#rgb255,0,0'
 */

// Function to convert wavelength to RGB
// https://stackoverflow.com/questions/1472514/convert-light-frequency-to-rgb
export function wavelengthToRGB(wavelength: number): { r: number, g: number, b: number } {
    let r = 0, g = 0, b = 0;
    let factor = 1;
    console.log(wavelength)
    if (wavelength >= 380 && wavelength <= 440) {
        r = -(wavelength - 440) / (440 - 380);
        g = 0;
        b = 1;
    } else if (wavelength >= 440 && wavelength <= 490) {
        r = 0;
        g = (wavelength - 440) / (490 - 440);
        b = 1;
    } else if (wavelength >= 490 && wavelength <= 510) {
        r = 0;
        g = 1;
        b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength <= 580) {
        r = (wavelength - 510) / (580 - 510);
        g = 1;
        b = 0;
    } else if (wavelength >= 580 && wavelength <= 645) {
        r = 1;
        g = -(wavelength - 645) / (645 - 580);
        b = 0;
    } else if (wavelength >= 645 && wavelength <= 750) {
        r = 1;
        g = 0;
        b = 0;
    }
    console.log(r, g, b)

    if((wavelength >= 380) && (wavelength < 420)) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if((wavelength >= 420) && (wavelength < 701)) {
        factor = 1.0;
    } else if((wavelength >= 701) && (wavelength < 781)) {
        factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
    } else {
        factor = 0.0;
    }
    console.log(r, g, b)

    // Adjust the intensity based on the factor
    r = adjustIntensity(r, factor);
    g = adjustIntensity(g, factor);
    b = adjustIntensity(b, factor);
    console.log(r, g, b)
    return { r, g, b };
}

function scaleStarSize(starRadius: number): number{
    const drawnRadius = 0*starRadius + 0.1
    return drawnRadius
}

function scalePlanetSize(planetRadius: number): number {
    const drawnRadius = 0*planetRadius + 0.3
    return drawnRadius
}

export function scalePlanetOrbitalDistance(realOrbitalDistance: number): number {
    const minDrawDistance = 1;
    const maxDrawDistance = 15;

    // Prevent realOrbitalDistance from being less than 1 (to avoid issues with log(0) or negative scaling)
    const clampedDistance = Math.max(realOrbitalDistance, 1);
    
    const logMin = Math.log(1); // log(1) = 0
    const logMax = Math.log(maxDrawDistance + 1);
    const logDistance = Math.log(clampedDistance + 1);

    return minDrawDistance + (logDistance - logMin) / (logMax - logMin) * (maxDrawDistance - minDrawDistance);
}

export function drawStar(scene: THREE.Scene, star: Star): MeshContainer {
    console.log('drawing star')
    console.log(star)
    console.log(star.wavelengthPeak)
    const starRGBColor = wavelengthToRGB(star.wavelengthPeak)
    const starColor = new THREE.Color( starRGBColor.r/255, starRGBColor.g/255, starRGBColor.b/255)
    const starMesh = drawSphere(scene, scaleStarSize(star.radius ? star.radius : 1), 16, 16, starColor )
    // ** NAMING THE MESH IS IMPORTANT **
    starMesh.name = star.name
    return new MeshContainer(starMesh, starColor, modifyColor(starColor, -100 ))
}

export function drawPlanet(scene:THREE.Scene, planet: Planet): MeshContainer {
    const planetColor = getPlanetColor(planet)
    //if planet terran
    if (planet instanceof Terran){
        var planetMesh = drawSphere(scene, scalePlanetSize(planet.radius), 8, 8, new THREE.Color(planetColor))
    } else { //for now all non terran planets are moons
        var planetMesh = drawSphere(scene, 0.1, 8, 8, new THREE.Color(planetColor))
    }
    // ** NAMING THE MESH IS IMPORTANT **
    planetMesh.name = planet.name
    return new MeshContainer(planetMesh, planetColor, modifyColor(planetColor, -100))

}

export function disposeMesh(mesh: THREE.Mesh, scene: THREE.Scene) {
    // Remove the mesh from the scene
    scene.remove(mesh);

    // Dispose of geometry
    if (mesh.geometry) {
        mesh.geometry.dispose();
    }

    // Dispose of material (handling both single and multi-material cases)
    if (mesh.material) {
        if (Array.isArray(mesh.material)) {
            // Loop through each material if it's an array
            mesh.material.forEach(material => {
                if (material && typeof material.dispose === 'function') {
                    material.dispose();
                }
            });
        } else {
            // Dispose single material
            if (typeof mesh.material.dispose === 'function') {
                mesh.material.dispose();
            }
        }
    }

    // Nullify the mesh to free memory (garbage collector will do this automatically but this helps with performance (probably not much though))
    mesh.geometry = null as unknown as THREE.BufferGeometry;
    mesh.material = null as unknown as THREE.Material | THREE.Material[];
}