// build.js
/* global THREE, scene */
var city = new THREE.Group();
var gridSize = 10;
var buildingSize = 5;
var streetSize = 5;
var blockSpacing = 10;
var windowSize = 3;
var lightSize = 3;

function createBuilding(x, z) {
    var height = Math.floor(Math.random() * 8 + 2); // Number of stacked cubes
    var building = new THREE.Group();
    
    for (let i = 0; i < height; i++) {
        var color = new THREE.Color(0x333333);
        var geometry = new THREE.BoxGeometry(buildingSize, buildingSize, buildingSize);
        var material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, i * buildingSize, 0);
        building.add(cube);
        
        if (Math.random() > 0.6) {
            var windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, windowSize);
            var windowMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb }); // Light blue windows
            var windowCube = new THREE.Mesh(windowGeometry, windowMaterial);
            windowCube.position.set(0, i * buildingSize, buildingSize / 2 + 0.1);
            building.add(windowCube);
        }
        
        if (Math.random() > 0.7) {
            var lightGeometry = new THREE.BoxGeometry(lightSize, lightSize, lightSize);
            var lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Initial red light
            var lightCube = new THREE.Mesh(lightGeometry, lightMaterial);
            lightCube.position.set(0, i * buildingSize, -buildingSize / 2 - 0.1);
            building.add(lightCube);
        }
    }
    
    building.position.set(x, 0, z);
    return building;
}

function createStreetTile(x, z) {
    var geometry = new THREE.BoxGeometry(buildingSize + streetSize, 1, buildingSize + streetSize);
    var material = new THREE.MeshBasicMaterial({ color: 0x222222 });
    var streetTile = new THREE.Mesh(geometry, material);
    streetTile.position.set(x, -0.5, z);
    scene.add(streetTile);
}

function generateCity() {
    for (let x = -gridSize * (buildingSize + streetSize + blockSpacing) / 2; x < gridSize * (buildingSize + streetSize + blockSpacing) / 2; x += buildingSize + streetSize + blockSpacing) {
        for (let z = -gridSize * (buildingSize + streetSize + blockSpacing) / 2; z < gridSize * (buildingSize + streetSize + blockSpacing) / 2; z += buildingSize + streetSize + blockSpacing) {
            createStreetTile(x, z);
            var building = createBuilding(x, z);
            city.add(building);
        }
    }
    scene.add(city);
}