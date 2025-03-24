// setup.js
/* global THREE, setScene, generateCity, animate, animateWindowsAndLights, dat */
var scene;
var camera;
var renderer;
var controls;
var gui;

// Parameters for city generation
var cityParams = {
    gridSize: 10,
    buildingSize: 5,
    streetSize: 5,
    blockSpacing: 10,
    windowSize: 3,
    lightSize: 3,
    blockSize: 4,
    regenerateCity: function() {
        // Remove old city
        scene.remove(city);
        city = new THREE.Group();
        // Regenerate city with new parameters
        generateCity();
    }
};

function setScene() {
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Initialize GUI
    gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.createElement('div');
    customContainer.style.position = 'absolute';
    customContainer.style.top = '10px';
    customContainer.style.right = '10px';
    document.body.appendChild(customContainer);
    gui.domElement.style.position = 'relative';
    customContainer.appendChild(gui.domElement);

    // Add GUI controls
    gui.add(cityParams, 'gridSize', 1, 20).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'buildingSize', 1, 10).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'streetSize', 1, 10).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'blockSpacing', 1, 20).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'windowSize', 1, 5).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'lightSize', 1, 5).onChange(cityParams.regenerateCity);
    gui.add(cityParams, 'blockSize', 2, 6).onChange(cityParams.regenerateCity);
}

function resizeScene() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

window.addEventListener('resize', resizeScene);