// animate.js
/* global THREE, city, renderer, camera */
function animateWindowsAndLights() {
    city.children.forEach(building => {
        building.children.forEach(cube => {
            if (cube.material.color.getHex() === 0x87ceeb) {
                cube.material.color.setHex(0x87ceeb); // Windows stay light blue
            } else if (cube.material.color.getHex() !== 0x333333) {
                var time = Date.now() * 0.002;
                var r = Math.sin(time) * 127 + 128;
                var g = Math.sin(time + 2) * 127 + 128;
                var b = Math.sin(time + 4) * 127 + 128;
                cube.material.color.setRGB(r / 255, g / 255, b / 255); // RGB wave effect
            }
        });
    });
    renderer.render(scene, camera);
    setTimeout(() => requestAnimationFrame(animateWindowsAndLights), 500);
}

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}