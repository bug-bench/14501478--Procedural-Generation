// animate.js
/*
 * Handles animation loops for continuous rendering and
 * window/light effects.
 */
/* global THREE, city, renderer, camera, scene */
function animateWindowsAndLights() {
    // Animate the building lights with color changes
    city.children.forEach(block => {
        block.children.forEach(building => {
            building.children.forEach(element => {
                // Skip if it's not a light (we check material properties)
                if (element.material && 
                    element.material.color && 
                    element.geometry.parameters.width === cityParams.buildingSize * 0.4) {
                    
                    // Create RGB wave effect for lights
                    var time = Date.now() * 0.002;
                    var r = Math.sin(time) * 127 + 128;
                    var g = Math.sin(time + 2) * 127 + 128;
                    var b = Math.sin(time + 4) * 127 + 128;
                    element.material.color.setRGB(r / 255, g / 255, b / 255);
                }
            });
        });
    });
    
    // Continue animation loop with slight delay for performance
    setTimeout(() => requestAnimationFrame(animateWindowsAndLights), 500);
}

function animate() {
    // Continuous rendering loop
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}