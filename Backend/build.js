// build.js
/* global THREE, scene, cityParams */
var city = new THREE.Group();

function createBuilding(x, z) {
    var height = Math.floor(Math.random() * 8 + 2); // Number of stacked cubes
    var building = new THREE.Group();
    
    for (let i = 0; i < height; i++) {
        var color = new THREE.Color(0x333333);
        var geometry = new THREE.BoxGeometry(cityParams.buildingSize, cityParams.buildingSize, cityParams.buildingSize);
        var material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, i * cityParams.buildingSize, 0);
        building.add(cube);
        
        if (Math.random() > 0.6) {
            var windowGeometry = new THREE.BoxGeometry(cityParams.windowSize, cityParams.windowSize, cityParams.windowSize);
            var windowMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb }); // Light blue windows
            var windowCube = new THREE.Mesh(windowGeometry, windowMaterial);
            windowCube.position.set(0, i * cityParams.buildingSize, cityParams.buildingSize / 2 + 0.1);
            building.add(windowCube);
        }
        
        if (Math.random() > 0.7) {
            var lightGeometry = new THREE.BoxGeometry(cityParams.lightSize, cityParams.lightSize, cityParams.lightSize);
            var lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Initial red light
            var lightCube = new THREE.Mesh(lightGeometry, lightMaterial);
            lightCube.position.set(0, i * cityParams.buildingSize, -cityParams.buildingSize / 2 - 0.1);
            building.add(lightCube);
        }
    }
    
    building.position.set(x, 0, z);
    return building;
}

function createBlock(x, z) {
    var block = new THREE.Group();
    var numBuildings = Math.floor(Math.random() * 3) + cityParams.blockSize; // 4-6 buildings per block
    
    for (let i = 0; i < numBuildings; i++) {
        var bx = x + (i % 2) * (cityParams.buildingSize + cityParams.streetSize);
        var bz = z + Math.floor(i / 2) * (cityParams.buildingSize + cityParams.streetSize);
        var building = createBuilding(bx, bz);
        block.add(building);
    }
    
    // Create a raised platform for the block
    var platformGeometry = new THREE.BoxGeometry((cityParams.buildingSize + cityParams.streetSize) * 2, 1, (cityParams.buildingSize + cityParams.streetSize) * 2);
    var platformMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 }); // Light grey
    var platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(x + (cityParams.buildingSize + cityParams.streetSize) / 2, -0.5, z + (cityParams.buildingSize + cityParams.streetSize) / 2);
    block.add(platform);
    
    block.position.set(x, 0, z);
    return block;
}

function createStreetTile(x, z) {
    var geometry = new THREE.BoxGeometry(cityParams.buildingSize + cityParams.streetSize, 1, cityParams.buildingSize + cityParams.streetSize);
    var material = new THREE.MeshBasicMaterial({ color: 0x222222 }); // Dark grey
    var streetTile = new THREE.Mesh(geometry, material);
    streetTile.position.set(x, -0.5, z);
    scene.add(streetTile);
}

function generateCity() {
    for (let x = -cityParams.gridSize * (cityParams.buildingSize + cityParams.streetSize + cityParams.blockSpacing) / 2; x < cityParams.gridSize * (cityParams.buildingSize + cityParams.streetSize + cityParams.blockSpacing) / 2; x += (cityParams.buildingSize + cityParams.streetSize) * 2 + cityParams.blockSpacing) {
        for (let z = -cityParams.gridSize * (cityParams.buildingSize + cityParams.streetSize + cityParams.blockSpacing) / 2; z < cityParams.gridSize * (cityParams.buildingSize + cityParams.streetSize + cityParams.blockSpacing) / 2; z += (cityParams.buildingSize + cityParams.streetSize) * 2 + cityParams.blockSpacing) {
            createStreetTile(x, z);
            var block = createBlock(x, z);
            city.add(block);
        }
    }
    scene.add(city);
}