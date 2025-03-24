/* global THREE, scene, camera, renderer, controls, cityParams, animateLights */

function animateLights() {
    var time = clock.getElapsedTime() * cityParams.lightSpeed;
    var lightColor = new THREE.Color(cityParams.lightColor);
    
    if (!city) return;
    
    city.children.forEach(block => {
        block.children.forEach(building => {
            if (building.isBuilding) {
                building.children.forEach(child => {
                    if (child.userData?.floor !== undefined) {
                        // Animate opacity
                        var pulse = Math.sin(time + child.userData.timeOffset) * 0.5 + 0.5;
                        child.material.opacity = 0.3 + pulse * 0.7 * cityParams.lightIntensity;
                        
                        // Update color from GUI
                        child.material.color.copy(lightColor);
                    }
                });
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    animateLights();
    renderer.render(scene, camera);
}