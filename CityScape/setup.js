// Global variables for Three.js scene
var scene, camera, renderer, controls, gui, city;
var clock = new THREE.Clock(); // Clock for animations

// City configuration parameters with default values
var cityParams = {
    regenerateCity: function() {
        scene.remove(city);
        city = new THREE.Group();
        generateCity();
    },
    buildingHeight: { min: 2, max: 8 },
    canvasSize: { width: 8, height: 16 },
    lightSpeed: 1.0,
    lightIntensity: 1.0,
    streetWidth: 1.2,
    blockSpacing: 1.5,
    buildingColor: '#97a4a6',
    windowColor: '#87ceeb',
    lightColor: '#ff0000',
    topLightEnabled: true,
    topLightColor: '#00ffcc',
    colorCycleEnabled: false,

    // NEW procedural generation settings
    proceduralMode: false,
    perlinThreshold: 0.3,
    perlinSeed: Math.random() * 1000
};

function setScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(150, 200, 150);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    gui = new dat.GUI({ width: 300 });

    var buildingFolder = gui.addFolder('Building Settings');
    buildingFolder.add(cityParams.buildingHeight, 'min', 1, 5).name('Min Height');
    buildingFolder.add(cityParams.buildingHeight, 'max', 3, 10).name('Max Height');
    buildingFolder.add(cityParams.canvasSize, 'width', 4, 32, 1).name('Canvas Width');
    buildingFolder.add(cityParams.canvasSize, 'height', 4, 64, 1).name('Canvas Height');
    buildingFolder.addColor(cityParams, 'buildingColor').name('Color');
    buildingFolder.addColor(cityParams, 'windowColor').name('Window Color');
    buildingFolder.open();

    var layoutFolder = gui.addFolder('City Layout');
    layoutFolder.add(cityParams, 'streetWidth', 1.0, 2.0).name('Street Width');
    layoutFolder.add(cityParams, 'blockSpacing', 1.0, 2.5).name('Block Spacing');
    layoutFolder.open();

    var lightFolder = gui.addFolder('Light Effects');
    lightFolder.add(cityParams, 'lightSpeed', 0.1, 3.0).name('Animation Speed');
    lightFolder.add(cityParams, 'lightIntensity', 0.1, 2.0).name('Light Intensity');
    lightFolder.addColor(cityParams, 'lightColor').name('Light Color');
    lightFolder.addColor(cityParams, 'topLightColor').name('Top Light Color');
    lightFolder.add(cityParams, 'topLightEnabled').name('Top Light Enabled');
    lightFolder.add(cityParams, 'colorCycleEnabled').name('RGB Cycle');
    lightFolder.open();

    var procFolder = gui.addFolder('Procedural Settings');
    procFolder.add(cityParams, 'proceduralMode').name('Use Perlin Noise');
    procFolder.add(cityParams, 'perlinThreshold', 0.1, 1.0).name('Threshold');
    procFolder.open();

    gui.add(cityParams, 'regenerateCity').name('Generate New City');
}

function resizeScene() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeScene);