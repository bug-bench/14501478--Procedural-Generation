// setup.js
/*
 * Sets up the Three.js environment including scene, camera, renderer,
 * and GUI controls for city parameters.
 */
/* global THREE, setScene, generateCity, animate, animateWindowsAndLights, dat */
var scene;
var camera;
var renderer;
var controls;
var gui;

// Parameters for city generation with simplified GUI controls
var cityParams = {
    buildingSize: 5,      // Size of individual buildings
    blockSize: 4,         // Number of buildings per block
    regenerateCity: function() {
        // Remove old city and regenerate with current parameters
        scene.remove(city);
        city = new THREE.Group();
        generateCity();
    }
};

function setScene() {
    // Initialize Three.js scene
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);
    
    // Set up renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Add orbit controls for camera movement
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Initialize simplified GUI
    gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.createElement('div');
    customContainer.style.position = 'absolute';
    customContainer.style.top = '10px';
    customContainer.style.right = '10px';
    document.body.appendChild(customContainer);
    gui.domElement.style.position = 'relative';
    customContainer.appendChild(gui.domElement);

    // Add GUI controls (simplified version)
    gui.add(cityParams, 'buildingSize', 1, 10).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'blockSize', 2, 6).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'regenerateCity').name('Regenerate City');
}

// Handle window resize events
function resizeScene() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

window.addEventListener('resize', resizeScene);