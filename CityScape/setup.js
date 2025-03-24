/* global THREE, generateCity, animateLights */
var scene, camera, renderer, controls, gui, city;

var cityParams = {
    regenerateCity: function() {
        scene.remove(city);
        city = new THREE.Group();
        generateCity();
    },
    buildingHeight: { min: 2, max: 8 },
    lightSpeed: 1.0,
    lightIntensity: 1.0,
    streetWidth: 1.2,
    blockSpacing: 1.5,
    buildingColor: '#97a4a6',
    windowColor: '#87ceeb',
    lightColor: '#ff0000'
};

function setScene() {
    // Initialize scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    
    // Lighting
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(150, 200, 150);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // GUI
    gui = new dat.GUI({ width: 300 });
    
    var buildingFolder = gui.addFolder('Building Settings');
    buildingFolder.add(cityParams.buildingHeight, 'min', 1, 5).name('Min Height').onChange(cityParams.regenerateCity);
    buildingFolder.add(cityParams.buildingHeight, 'max', 3, 10).name('Max Height').onChange(cityParams.regenerateCity);
    buildingFolder.addColor(cityParams, 'buildingColor').name('Color').onChange(cityParams.regenerateCity);
    buildingFolder.addColor(cityParams, 'windowColor').name('Window Color').onChange(cityParams.regenerateCity);
    buildingFolder.open();

    var layoutFolder = gui.addFolder('City Layout');
    layoutFolder.add(cityParams, 'streetWidth', 1.0, 2.0).name('Street Width').onChange(cityParams.regenerateCity);
    layoutFolder.add(cityParams, 'blockSpacing', 1.0, 2.5).name('Block Spacing').onChange(cityParams.regenerateCity);
    layoutFolder.open();

    var lightFolder = gui.addFolder('Light Effects');
    lightFolder.add(cityParams, 'lightSpeed', 0.1, 3.0).name('Animation Speed');
    lightFolder.add(cityParams, 'lightIntensity', 0.1, 2.0).name('Light Intensity');
    lightFolder.addColor(cityParams, 'lightColor').name('Light Color');
    lightFolder.open();

    gui.add(cityParams, 'regenerateCity').name('Generate New City');
}

function resizeScene() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeScene);