import * as THREE from "three";
import { Planet } from "../astronomicalClasses/planets/planet";
import { BasicGameDrawer, BasicGamerDrawerParams, MeshContainer } from "./basicDrawer";
import { Star } from "../astronomicalClasses/stars/stars";
import { Scaler } from "../scaler/scaler";


export interface PSDrawerParams extends BasicGamerDrawerParams{}

export class PlanetarySystemDrawer extends BasicGameDrawer {
	
	constructor(){
		super()
	}

	protected genPlanetColor(pl: Planet): THREE.Color{
		let baseColor: THREE.RGB = {r:128, g:128, b:128}
		//change the basecolor depending on atmospheric (gasses) and mantle (rock/bio) conditions
		return new THREE.Color(baseColor.r/255, baseColor.g/255, baseColor.b/255);
	}

	/**
	 * Given a peakWavelength convert it to a THREE.Color
	 * @param wavelength peakWavelength 
	 * @returns THREE.Color
	 * from https://stackoverflow.com/questions/1472514/convert-light-frequency-to-rgb
	 */
	protected wavelengthToTHREERGBColor(wavelength: number): THREE.Color {
    let r = 0, g = 0, b = 0;
    let factor = 1;
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
    } else if (wavelength >= 645 && wavelength <= 781) {
        r = 1;
        g = 0;
        b = 0;
    }

    if((wavelength >= 380) && (wavelength < 420)) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if((wavelength >= 420) && (wavelength < 701)) {
        factor = 1.0;
    } else if((wavelength >= 701) && (wavelength < 781)) {
        factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
    } else {
        factor = 0.0;
    }

    // Adjust the intensity based on the factor
    r = this.adjustIntensity(r, factor);
    g = this.adjustIntensity(g, factor);
    b = this.adjustIntensity(b, factor);
    console.log("Converted wavelength ", wavelength, "to rgb: ", r, g, b)
    return new THREE.Color(r/255, g/255, b/255);
	}

	
	public drawPlanet(planet: Planet, scaler: Scaler): MeshContainer{

    //** CREATE PLANET MESH **
		//gen color
		const planetColor = this.genPlanetColor(planet)
		//Scale Correctly
		let scaledDistance: number = 0.5;
		let scaledRadius: number = 0.5;
		//if planet
		if(planet.parentBody && (planet.parentBody instanceof Star)) {
			 scaledDistance = scaler.scalePlanetaryOrbit(planet.orbitalDistance)
			 console.log("Scaled :", planet.name, "orbit from", planet.orbitalDistance, "to ", scaledDistance)

			 scaledRadius = scaler.scaleSysPlanetRadius(planet.earthRadius)
		//if moon
		} else if (planet.parentBody && (planet.parentBody instanceof Planet)) {
			scaledDistance = scaler.scaleMoonOrbit(planet.orbitalDistance)
			scaledRadius = scaler.scaleSysMoonRadius(planet.earthRadius)
		//what the hell is this body error
		} else {
			console.error("parentBody isn't STAR or PLANET cannot scale orbital distance:", planet.orbitalDistance)
		}
		
		
		// CREATE MESH
    	const planetMesh = this.drawSphere(planet.name, scaledRadius, planetColor)
		//position mesh
		planetMesh.position.set(scaledDistance, 0, 0)
		// put in MeshContainer
		const planetMeshContainer = new MeshContainer(planetMesh, planetColor,scaledDistance, this.onHoverColorShift(planetColor, -0.5))
    
		//return the container for scene mgmt
    	return planetMeshContainer
	}

	public drawStar(star: Star, scaler: Scaler): MeshContainer {
    	//** CREATE STAR MESH **
		const scaledRadius = scaler.scaleSysStarRadius(star.solarRadius)
		const starColor = this.wavelengthToTHREERGBColor(star.wavelengthPeak)
		const starMesh = this.drawSphere(star.name, scaledRadius, starColor)
		// put in MeshContainer
		const starMechContainer = new MeshContainer(starMesh, starColor,scaler.scalePlanetaryOrbit(star.position.r) ,this.onHoverColorShift(starColor, -0.5)) //<----SCALED ORBITAL DISTANCE
   	
		//return
		return starMechContainer

	}

	public drawScalePlanetaryGridLine(scaledDistance: number): THREE.LineLoop {
		const lineLoop = this.drawCircleOutline(scaledDistance, 3 + 2*scaledDistance, '#474646' )	//opacity is set seperately
		return lineLoop
	}

	public drawLabels(string: string){
		return this.drawString(string, -25,5,-5)
	}

}