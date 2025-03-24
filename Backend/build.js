// build.js
/*
 * Contains all city generation functions including buildings, blocks,
 * and street layout.
 */
/* global THREE, scene, cityParams */
var city = new THREE.Group();

function createBuilding(x, z) {
    // Create a building with random height at specified position
    var height = Math.floor(Math.random() * 8 + 2);
    var building = new THREE.Group();

    // Create each floor of the building
    for (let i = 0; i < height; i++) {
        // Main building structure
        var buildingColor = new THREE.Color(0xd3d3d3);
        var geometry = new THREE.BoxGeometry(cityParams.buildingSize, cityParams.buildingSize, cityParams.buildingSize);
        var material = new THREE.MeshBasicMaterial({ color: buildingColor });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, i * cityParams.buildingSize, 0);
        building.add(cube);

        // Windows on all four sides
        if (i % 2 === 0 && Math.random() > 0.5) {
            var windowGeometry = new THREE.BoxGeometry(cityParams.buildingSize * 0.6, cityParams.buildingSize * 0.6, 0.1);
            var windowMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb });
            
            // Create windows on each side
            ['front', 'back', 'left', 'right'].forEach((side, index) => {
                var windowCube = new THREE.Mesh(windowGeometry, windowMaterial);
                switch(side) {
                    case 'front': windowCube.position.set(0, (i + 0.5) * cityParams.buildingSize, cityParams.buildingSize/2); break;
                    case 'back': windowCube.position.set(0, (i + 0.5) * cityParams.buildingSize, -cityParams.buildingSize/2); break;
                    case 'left': windowCube.position.set(-cityParams.buildingSize/2, (i + 0.5) * cityParams.buildingSize, 0); 
                                windowCube.rotation.y = Math.PI/2; break;
                    case 'right': windowCube.position.set(cityParams.buildingSize/2, (i + 0.5) * cityParams.buildingSize, 0); 
                                 windowCube.rotation.y = Math.PI/2; break;
                }
                building.add(windowCube);
            });
        }

        // Lights on all four sides
        if (i % 2 !== 0 && Math.random() > 0.7) {
            var lightGeometry = new THREE.BoxGeometry(cityParams.buildingSize * 0.4, cityParams.buildingSize * 0.4, 0.1);
            var lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            
            // Create lights on each side
            ['front', 'back', 'left', 'right'].forEach((side, index) => {
                var lightCube = new THREE.Mesh(lightGeometry, lightMaterial);
                switch(side) {
                    case 'front': lightCube.position.set(0, (i + 0.5) * cityParams.buildingSize, cityParams.buildingSize/2); break;
                    case 'back': lightCube.position.set(0, (i + 0.5) * cityParams.buildingSize, -cityParams.buildingSize/2); break;
                    case 'left': lightCube.position.set(-cityParams.buildingSize/2, (i + 0.5) * cityParams.buildingSize, 0); 
                                lightCube.rotation.y = Math.PI/2; break;
                    case 'right': lightCube.position.set(cityParams.buildingSize/2, (i + 0.5) * cityParams.buildingSize, 0); 
                                 lightCube.rotation.y = Math.PI/2; break;
                }
                building.add(lightCube);
            });
        }
    }

    // Add platform beneath the building
    var platformGeometry = new THREE.BoxGeometry(cityParams.buildingSize * 1.2, 1, cityParams.buildingSize * 1.2);
    var platformMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 });
    var platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, -0.5, 0);
    building.add(platform);

    building.position.set(x, 0, z);
    return building;
}

function createBlock(x, z) {
    // Create a block of buildings at specified position
    var block = new THREE.Group();
    var numBuildings = cityParams.blockSize;
    var spacing = cityParams.buildingSize * 1.2;
    
    // Arrange buildings in a grid within the block
    for (let i = 0; i < numBuildings; i++) {
        for (let j = 0; j < numBuildings; j++) {
            var bx = x + i * spacing - (numBuildings-1) * spacing/2;
            var bz = z + j * spacing - (numBuildings-1) * spacing/2;
            var building = createBuilding(bx, bz);
            block.add(building);
        }
    }
    
    block.position.set(x, 0, z);
    return block;
}

function createStreetTile(x, z) {
    // Create a street tile that covers the entire block area
    var blockSize = cityParams.blockSize * cityParams.buildingSize * 1.5;
    var geometry = new THREE.BoxGeometry(blockSize, 1, blockSize);
    var material = new THREE.MeshBasicMaterial({ color: 0x222222 });
    var streetTile = new THREE.Mesh(geometry, material);
    streetTile.position.set(x, -0.5, z);
    scene.add(streetTile);
}

function generateCity() {
    // Generate the entire city layout
    var blockSpacing = cityParams.buildingSize * cityParams.blockSize * 1.8;
    var gridSize = 10;
    
    // Calculate starting position to center the city
    var startX = -gridSize * blockSpacing / 2;
    var startZ = -gridSize * blockSpacing / 2;
    
    // Create grid of blocks and streets
    for (let x = startX; x < -startX; x += blockSpacing) {
        for (let z = startZ; z < -startZ; z += blockSpacing) {
            createStreetTile(x, z);
            var block = createBlock(x, z);
            city.add(block);
        }
    }
    scene.add(city);
}