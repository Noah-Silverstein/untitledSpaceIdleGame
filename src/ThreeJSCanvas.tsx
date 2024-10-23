import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { disposeMesh, drawPlanet, drawStar, MeshContainer, scalePlanetOrbitalDistance } from "./drawingUtils";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import styles from './ThreeJSCanvas.module.css'
import { Star } from "./astronomicalClasses/stars";
import { PlanetarySystem } from "./astronomicalClasses/planetarySystem";
import { AstronomicalBody } from "./astronomicalClasses/baseAstronomicalClasses";
import { Planet } from "./astronomicalClasses/planet";

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
const ThreeJSCanvas: React.FC<ThreeJSCanvasProps> = ({ DEVMODE = false, onMeshSelect, onBackgroundSelect }) => {
    let animationId: number;
    const canvasRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        // Step 1: Set up the scene, camera, and renderer

        const meshContainers:Record<string, MeshContainer>  = {}
        const meshes: THREE.Mesh[] = []


        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000); //camera will be updated later
        camera.layers.enable(0); // Enable layer 0
        camera.layers.enable(1); // Enable layer 1
        const renderer = new THREE.WebGLRenderer();
        //CONST FOR MOUSE CLICKS
        //you need to raycast to handle clicks in THREEJS
        const raycaster = new THREE.Raycaster();
        raycaster.layers.set(0); // Only check layer 0 for intersections
        const mouse = new THREE.Vector2();
        //----set scene background color-----
        //find root background color
        const rootStyle = getComputedStyle(document.documentElement);
        const bgColor = rootStyle.getPropertyValue('--background-color').trim(); 
        //set color
        scene.background = new THREE.Color(bgColor); // Set the background color from the CSS variable

        /**
         * 
         * TEST FUNCTIONS TO SETUP DEV PLANETARY SYSTEM
         * 
         * 
         */
        //--PLANETARY SYSTEM TEST--
        const system = PlanetarySystem.genRandKtypeSys("K_TYPE_SYSTEM")
        console.log(system)
        
       
        // ** CREATE ALL MESHES AND STORE IN MESHCONTAINERS 
        //get body array
        const bodies = system.getBodies()
        //create and place meshes
        bodies.forEach(body => {
            if(body instanceof Star){
                meshContainers[body.name] = drawStar(scene, body)
            } else if (body instanceof Planet){
                let plMeshContainer = drawPlanet(scene, body)
                meshContainers[body.name] = plMeshContainer
                console.log(`scaled body orbitalradius of ${body.name} is ${body.position.r}`)
                plMeshContainer.mesh.position.set(body.position.r, 0, 0)

            }
        })
        //fill the meshes array with all the created meshes ------------Maybe find a different way to do this?
        Object.values(meshContainers).forEach((meshContainer) => {
            meshes.push(meshContainer.mesh)
        })

        //look at rootBOdy
        camera.lookAt(meshContainers[system.getRootBody().name].mesh.position)


        /**
         * 
         * INIT CAMERA THINGS
         * 
         */
        //set init camera position
        camera.position.set(10,6,4)
        // Inside your Three.js setup code
        const controls = new OrbitControls(camera, renderer.domElement);
        // Optionally, customize the controls
        controls.enableZoom = true;  // Keep zoom functionality
        controls.enablePan = false;  // Disable panning if you want to restrict it
        
        /**
         *         DEVMODE HELPER
         * 
         * 
         */
        if (DEVMODE){
            //AXIS HELPER: x = red, y = green, z = blue
            const axesHelper = new THREE.AxesHelper( 5 ); 
            axesHelper.layers.set(1); // This will only be rendered, not checked by the raycaster
            scene.add( axesHelper );        
            console.log("AxesHelper added to scene on layer 1");
        }

        /**
         *  HELPER FUNCTION TO SET RENDERE SIZE AND UPDATE THE CAMERA
         *   
         */
        const setRendererSize = () => {
            if (canvasRef.current) {
                const { clientWidth, clientHeight } = canvasRef.current;
                renderer.setSize(clientWidth, clientHeight);
                camera.aspect = clientWidth / clientHeight;
                camera.updateProjectionMatrix();
            }
        };

        // ** Attach Renderer to Canvas **
        if (canvasRef.current) {
            setRendererSize(); // Use the helper function
            canvasRef.current.appendChild(renderer.domElement);
        }
        
        //----------------ANIMATION-------------------
        /**
         *  Update positions of all meshes recursively going from parent to satellite
         * @param body should be the ROOTBODY of the system 
         *
         * @param meshes Record of all meshes in the scene
         * @param parentPosition position of the parent body on the scene (cart coordinates)
         */
        const updatePositionRecursively = (body: AstronomicalBody, meshes: Record<string, MeshContainer>, parentPosition: THREE.Vector3, deltaTime: number) => {
            const mesh = meshes[body.name].mesh;
        
            if (mesh) {
                // Check if the body has a position (assuming planets/moons have polar coordinates)
                if (body instanceof Planet ) {
                    // Update the angular position for the orbit (assuming `t` is the angle in polar coordinates)
                    body.position.t += Math.PI*2*deltaTime/body.orbitalPeriod; // Adjust speed as needed orbitalPeriod is now in days
        
                    // Get the orbital radius (relative distance to the parent)
                    if(body.parentBody instanceof Star){
                        var r = scalePlanetOrbitalDistance(body.position.r);

                    } else {
                        var r = body.position.r
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
                        updatePositionRecursively(satellite, meshes, mesh.position, deltaTime);
                    });
                }
            }
        };

        // ** DELTA TIME CONST **
        let lastTime = performance.now() //Track when last frame was rendered
        let lastUpdate = performance.now()
        const targetFPS = 60; // Target 30 frames per second
        const frameTime = 1 / targetFPS; // Time per frame in seconds (e.g., 1/30 = ~0.033s)
        const updateInterval = 2; // Perform incremental updates every 1 second
        // loop
        const animate = () => {
            const currentTime = performance.now();
            let deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            lastTime = currentTime;
            
            
            // ** GAME LOOP **
            // calculates the time since last drawn animation if that is larger continue updating the 
            // game state until the time is less than delta time
            while (deltaTime >= frameTime) {
                const rootBody = system.getRootBody();
                const rootMesh = meshContainers[rootBody.name].mesh;

                //** ANIMATE THE SCENE **/
                // ANY ANIMATIONS HAPPEN HERE 
                // rotate every body 
                meshes.forEach(meshBody => {
                    meshBody.rotation.y += 0.001 * frameTime * 60;
                })
                // update all positions
                updatePositionRecursively(rootBody, meshContainers, rootMesh.position, frameTime);
                //** UPDATE GAME LOOP **/
                // 
                if (currentTime - lastUpdate >= updateInterval * 1000) { // Check if it's time to update the game state
                    console.log(updateInterval, 'sec has elpased'); // Function to update resources, stats, etc.
                    //CALL UPDATE GAMESTATES FUNCTION
                    lastUpdate = currentTime; // Reset last update time
                }
    
                deltaTime -= frameTime; // Subtract the frame time until deltaTime is less than frameTime
            }

            lastTime = currentTime;

            // Render the scene with the camera
            renderer.render(scene, camera);
        
            // Request the next animation frame
            animationId = requestAnimationFrame(animate);
        };
        /*------------------------
                INIT LOOP
        --------------------------*/
        animate();
        /**
         *     EVENT LISTENERS
         * 
         */

        // Handle resizing of the div
        const handleResize = () => {
            setRendererSize();
        };

        // ** Mouse Move Handler **
        //IMPORTANT to define this outside of the function so that it's state can remain the same
        //since onMouseMove is going to be called everytime the mouse moves (you could fancy wrap it but this works well enough)
        let previouslyHoveredMesh: THREE.Mesh | null = null; // Track the previously hovered mesh
        let prevClickedMesh: THREE.Mesh | null = null; //track the previously clicked mesh

        //the mouse move function
        const onMouseMove = (event: MouseEvent) => {
            // Calculate mouse position in normalized device coordinates
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(scene.children);

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
            if (previouslyHoveredMesh && previouslyHoveredMesh !== intersectedMesh && prevClickedMesh !== previouslyHoveredMesh) {
                // check if material (probably overerly carefull but whatever)
                if (previouslyHoveredMesh.material instanceof THREE.MeshBasicMaterial) {
                    //check if prevClicked is not the same as previouslyHovered
                    previouslyHoveredMesh.material.color.set(meshContainers[previouslyHoveredMesh.name].originalColor); // Reset to original color
                }
             
            }
           
            //when mouse hovers over(intersects) mesh AND the mesh is NOT the same as the previous mesh (when entering the material)
            //-> change the color 
            if (intersectedMesh && intersectedMesh !== previouslyHoveredMesh) {
                // Set the new hovered mesh color
                if(intersectedMesh.material instanceof THREE.MeshBasicMaterial){

                    intersectedMesh.material.color.set(meshContainers[intersectedMesh.name].onHoverColor)

                }
            
                previouslyHoveredMesh = intersectedMesh; // Update the previously hovered mesh
            //if there is no intersecting mesh
            } else if (!intersectedMesh) {
                previouslyHoveredMesh = null; // Reset if no mesh is hovered
            }
        };

        // ** Mouse Click Handlers **
        // ** Check if click or drag? **
        let mouseDownPosition = { x: 0, y: 0 }; // Track where the mouse was when pressed
        let isDragging = false; // Flag to track if the user is dragging

        const onMouseDown = (event: MouseEvent) => {
            // Record the initial mouse down position
            mouseDownPosition.x = event.clientX;
            mouseDownPosition.y = event.clientY;
            
            // Reset dragging flag
            isDragging = false;
        };

        const onMouseUp = (event: MouseEvent) => {
            // Calculate the distance the mouse moved between down and up events
            const dx = event.clientX - mouseDownPosition.x;
            const dy = event.clientY - mouseDownPosition.y;
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Define a threshold for what is considered a drag vs a click
            const dragThreshold = 5; // Pixels

            // If the mouse moved more than the threshold, it's a drag, not a click
            if (distance > dragThreshold) {
                isDragging = true;
            } else {
                // If it wasn't a drag, handle it as a click
                onMouseClick(event);
            }
        };
        
        const onMouseClick = (event: MouseEvent) => {
            if (isDragging) return
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(meshes);

            let clickedMesh: THREE.Mesh | null = null;

            //if you clicked on a mesh
            if (intersects.length > 0) {
                clickedMesh = intersects[0].object as THREE.Mesh;
                //if you clicked on a new mesh
                if(prevClickedMesh !== clickedMesh ){
                    console.log("Clicked on new mesh:", clickedMesh, system.getBody(clickedMesh.name));
                    //set the old mesh color back 
                    if (prevClickedMesh && prevClickedMesh.material instanceof THREE.MeshBasicMaterial) 
                        prevClickedMesh.material.color.set(meshContainers[prevClickedMesh.name].originalColor) 
                    
                    //set the clicked mesh color to the "selected color" AND set prevSelectedMesh to the currently Selected Mesh
                    if (clickedMesh.material instanceof THREE.MeshBasicMaterial){
                        clickedMesh.material.color.set(meshContainers[clickedMesh.name].onHoverColor)
                        prevClickedMesh = clickedMesh
                        onMeshSelect(system.getBody(clickedMesh.name))
                    }
                    
                }
            // if you did not click on a mesh -> clicked on background
            } else {
                console.log('clicked on background')
                //if there was a clicked mesh: Revert Mesh Color and set prevClickedMesh to null
                if (prevClickedMesh && prevClickedMesh.material instanceof THREE.MeshBasicMaterial) {
                    prevClickedMesh.material.color.set(meshContainers[prevClickedMesh.name].originalColor)
                    prevClickedMesh = null
                    // Notify the parent 
                    onMeshSelect(null);
                    onBackgroundSelect();
                }
            }
        };

        // ** Attach event listener to canvas for clicks **
        //check if mouse has 'clicked'
        if (renderer.domElement) {
            renderer.domElement.addEventListener('click', onMouseClick);
            renderer.domElement.addEventListener('mousedown', onMouseDown);
            renderer.domElement.addEventListener('mouseup', onMouseUp);
        }
        // ** Add event listener for mousemove **
        window.addEventListener('mousemove', onMouseMove);
        // ** Attach event listener to window for resize
        //checks if window has been resized
        window.addEventListener('resize', handleResize);
        
        

        // Clean up on component unmount
        return () => {
            //--------------
            //   CANCEL ANIMATIONS
            //----------
            cancelAnimationFrame(animationId);

            //-----------------------------------
            //   DISPOSE GEOMETRIES, MATERIALS AND TEXTURES
            //-------------------------------
            meshes.forEach(mesh => {
                disposeMesh(mesh, scene)
            })

            //  DISPOSE OF RENDERER
            renderer.dispose();

            // ** REMOVE THE EVENT LISTENERS **
            //remove window resize
            window.removeEventListener('resize', handleResize);
            //remove mousemove handler
            window.removeEventListener('mousemove', onMouseMove);
            //remove click handler
            if (renderer.domElement) {
                renderer.domElement.removeEventListener('click', onMouseClick);
                renderer.domElement.removeEventListener('mousedown', onMouseDown);
                renderer.domElement.removeEventListener('mouseup', onMouseUp);
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

export default ThreeJSCanvas;