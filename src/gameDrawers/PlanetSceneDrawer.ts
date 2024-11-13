import { Planet } from "../astronomicalClasses/planets/planet";
import { Star } from "../astronomicalClasses/stars/stars";
import { Scaler } from "../scaler/scaler";
import { BasicGameDrawer, BasicGamerDrawerParams, MeshContainer } from "./basicDrawer";

import * as THREE from "three";


interface PlanetSceneDrawerParams extends BasicGamerDrawerParams{}


export class PlanetSceneDrawer extends BasicGameDrawer{
    constructor(){
        super()
    }
    
	protected genPlanetColor(pl: Planet): THREE.Color{
		let baseColor: THREE.RGB = {r: 65, g: 105, b: 225}
		//change the basecolor depending on atmospheric (gasses) and mantle (rock/bio) conditions
		return new THREE.Color(baseColor.r/255, baseColor.g/255, baseColor.b/255);
	}


    public drawPlanet(planet: Planet, scaler: Scaler): MeshContainer{

        //** CREATE PLANET MESH **
        //gen color
        const planetColor = this.genPlanetColor(planet)
        //Scale Correctly
        let scaledDistance: number = 0;
        let scaledRadius: number = 0;
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
    public drawMoon(moon: Planet, scaler: Scaler): MeshContainer{

        //** CREATE PLANET MESH **
        //gen color
        const moonColor = new THREE.Color(128/255, 128/255, 128/255)
        //Scale Correctly
        let scaledDistance: number = 0;
        let scaledRadius: number = 0;
        

       
        
        
        // CREATE MESH
        const planetMesh = this.drawSphere(planet.name, scaledRadius, planetColor)
        //position mesh
        planetMesh.position.set(scaledDistance, 0, 0)
        // put in MeshContainer
        const planetMeshContainer = new MeshContainer(planetMesh, planetColor,scaledDistance, this.onHoverColorShift(planetColor, -0.5))
    
        //return the container for scene mgmt
        return planetMeshContainer
    }

        
}
