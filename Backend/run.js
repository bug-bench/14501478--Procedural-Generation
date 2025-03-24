// run.js
/* 
 * Main execution file that initializes the scene, generates the city,
 * and starts the animation loops for rendering and window/light effects.
 */
/* global setScene, generateCity, animate, animateWindowsAndLights */
setScene();       // Initialize Three.js scene, camera, renderer, and controls
generateCity();   // Create the initial city layout
animate();        // Start the continuous rendering loop
animateWindowsAndLights(); // Start the window and light animation loop