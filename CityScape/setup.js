// Global variables for Three.js scene
var scene, camera, renderer, controls, gui, city;
var clock = new THREE.Clock(); // Clock for animations

// City configuration parameters with default values
var cityParams = {
    regenerateCity: function() {
        // Remove old city and generate new one with current parameters
        scene.remove(city);
        city = new THREE.Group();
        generateCity();
    },
    buildingHeight: { min: 2, max: 8 }, // Range for random building heights
    lightSpeed: 1.0, // Speed of light animations
    lightIntensity: 1.0, // Intensity of light effects
    streetWidth: 1.2, // Relative width of streets
    blockSpacing: 1.5, // Spacing between city blocks
    buildingColor: '#97a4a6', // Default building color
    windowColor: '#87ceeb', // Default window color
    lightColor: '#ff0000', // Default light color
    colorCycleEnabled: false // Toggle for RGB color cycling
};

function setScene() {
    // Initialise Three.js scene with dark background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    
    // Ambient light fills the entire scene evenly
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Directional light simulates sunlight
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Configure camera
    camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000 
    );
    camera.position.set(150, 200, 150); 
    camera.lookAt(0, 0, 0); 

    // 4. Set up renderer with antialiasing
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // 5. Add orbit controls for user interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;

    // 6. Initialise GUI controls
    gui = new dat.GUI({ width: 300 });
    
    // Building settings folder
    var buildingFolder = gui.addFolder('Building Settings');
    buildingFolder.add(cityParams.buildingHeight, 'min', 1, 5).name('Min Height').onChange(cityParams.regenerateCity);
    buildingFolder.add(cityParams.buildingHeight, 'max', 3, 10).name('Max Height').onChange(cityParams.regenerateCity);
    buildingFolder.addColor(cityParams, 'buildingColor').name('Color').onChange(cityParams.regenerateCity);
    buildingFolder.addColor(cityParams, 'windowColor').name('Window Color').onChange(cityParams.regenerateCity);
    buildingFolder.open();

    // Layout settings folder
    var layoutFolder = gui.addFolder('City Layout');
    layoutFolder.add(cityParams, 'streetWidth', 1.0, 2.0).name('Street Width').onChange(cityParams.regenerateCity);
    layoutFolder.add(cityParams, 'blockSpacing', 1.0, 2.5).name('Block Spacing').onChange(cityParams.regenerateCity);
    layoutFolder.open();

    // Light effects folder
    var lightFolder = gui.addFolder('Light Effects');
    lightFolder.add(cityParams, 'lightSpeed', 0.1, 3.0).name('Animation Speed');
    lightFolder.add(cityParams, 'lightIntensity', 0.1, 2.0).name('Light Intensity');
    lightFolder.addColor(cityParams, 'lightColor').name('Light Color');
    lightFolder.add(cityParams, 'colorCycleEnabled').name('RGB Cycle').onChange(function() {
    });
    lightFolder.open();

    // Main controls
    gui.add(cityParams, 'regenerateCity').name('Generate New City');
}

// Handle window resize events
function resizeScene() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeScene);