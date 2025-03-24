/* global THREE, scene, camera, renderer, controls, cityParams, clock */

function animateLights() {
    if (!city) return; // Exit if city not loaded
    
    var time = clock.getElapsedTime() * cityParams.lightSpeed;
    
    city.children.forEach(block => {
        block.children.forEach(building => {
            if (building.isBuilding) {
                building.children.forEach(child => {
                    // Only process light strips (identified by userData)
                    if (child.userData?.floor !== undefined) {
                        // 1. Animate opacity pulsing
                        var pulse = Math.sin(time + child.userData.timeOffset) * 0.5 + 0.5;
                        child.material.opacity = 0.3 + pulse * 0.7 * cityParams.lightIntensity;
                        
                        // 2. Handle color cycling or static color
                        if (cityParams.colorCycleEnabled) {
                            // RGB color cycling based on time and position
                            var hue = (time * 0.2 + child.userData.timeOffset) % 1;
                            child.material.color.setHSL(hue, 1.0, 0.5);
                        } else {
                            // Use static color from GUI
                            child.material.color.set(cityParams.lightColor);
                        }
                    }
                });
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls if they exist
    if (controls) {
        controls.update();
    }
    
    // Animate lights
    animateLights();
    
    // Render scene
    renderer.render(scene, camera);
}