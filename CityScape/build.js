/* global THREE, scene, cityParams */

function createBuilding(x, z) {
    // Generate random building height within configured range
    var height = Math.floor(Math.random() * 
              (cityParams.buildingHeight.max - cityParams.buildingHeight.min + 1) + 
              cityParams.buildingHeight.min);
    var building = new THREE.Group();
    building.isBuilding = true; // Flag for animation system

    // Convert color strings from GUI to Three.js Color objects
    var buildingColor = new THREE.Color(cityParams.buildingColor);
    var windowColor = new THREE.Color(cityParams.windowColor);
    var lightColor = new THREE.Color(cityParams.lightColor);

    // Main building material with subtle specular highlights
    var buildingMaterial = new THREE.MeshPhongMaterial({ 
        color: buildingColor,
        specular: 0x111111,
        shininess: 30
    });

    // Create each floor of the building
    for (let i = 0; i < height; i++) {
        // 1. Create main building cube
        var geometry = new THREE.BoxGeometry(5, 5, 5); // Fixed building dimensions
        var cube = new THREE.Mesh(geometry, buildingMaterial.clone());
        cube.position.set(0, i * 5, 0); // Stack floors vertically
        building.add(cube);

        // 2. Add windows (only on even floors, 50% chance, not on top floor)
        if (i % 2 === 0 && Math.random() > 0.5 && i < height - 1) {
            var windowGeometry = new THREE.BoxGeometry(3, 3, 0.1); // Flat windows
            var windowMaterial = new THREE.MeshBasicMaterial({ 
                color: windowColor,
                transparent: true,
                opacity: 0.8
            });
            
            // Add windows to all four sides
            ['front', 'back', 'left', 'right'].forEach((side) => {
                var windowCube = new THREE.Mesh(windowGeometry, windowMaterial);
                switch(side) {
                    case 'front': 
                        windowCube.position.set(0, (i + 0.5) * 5, 2.5); 
                        break;
                    case 'back': 
                        windowCube.position.set(0, (i + 0.5) * 5, -2.5); 
                        break;
                    case 'left': 
                        windowCube.position.set(-2.5, (i + 0.5) * 5, 0); 
                        windowCube.rotation.y = Math.PI/2; // Rotate to face outward
                        break;
                    case 'right': 
                        windowCube.position.set(2.5, (i + 0.5) * 5, 0); 
                        windowCube.rotation.y = Math.PI/2;
                        break;
                }
                building.add(windowCube);
            });
        }

        // 3. Add light strips (on all floors except top)
        if (i < height - 1) {
            var lightGeometry = new THREE.BoxGeometry(5.1, 0.3, 0.2); // Thin horizontal strips
            var lightMaterial = new THREE.MeshBasicMaterial({ 
                color: lightColor,
                transparent: true,
                opacity: 0.8
            });
            
            // Add lights to all four sides
            for (let side = 0; side < 4; side++) {
                var angle = side * Math.PI / 2; // 0, 90, 180, 270 degrees
                var lightStrip = new THREE.Mesh(lightGeometry, lightMaterial);
                
                // Position around the building perimeter
                lightStrip.position.set(
                    2.55 * Math.sin(angle),
                    (i + 0.85) * 5, // Slightly below floor ceiling
                    2.55 * Math.cos(angle)
                );
                
                // Rotate to face outward
                lightStrip.rotation.y = angle;
                
                // Store animation data
                lightStrip.userData = { 
                    floor: i,
                    side: side,
                    timeOffset: Math.random() * Math.PI * 2 // Random phase offset
                };
                
                building.add(lightStrip);
            }
        }
    }

    // 4. Add foundation platform (positioned to not clip through buildings)
    var foundationGeometry = new THREE.BoxGeometry(6, 1, 6);
    var foundationMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x777777,
        specular: 0x111111,
        shininess: 15
    });
    var foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.set(0, -1.5, 0); // Lowered to prevent clipping
    building.add(foundation);

    // Position entire building at specified coordinates
    building.position.set(x, 0, z);
    return building;
}

function createBlock(x, z) {
    var block = new THREE.Group();
    var buildingSpacing = 5 * cityParams.streetWidth; // Calculate spacing
    
    // Create 2x2 grid of buildings per block
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            // Calculate building position within block
            var bx = x + (i * buildingSpacing) - (buildingSpacing/2);
            var bz = z + (j * buildingSpacing) - (buildingSpacing/2);
            var building = createBuilding(bx, bz);
            block.add(building);
        }
    }
    
    // Add street base (positioned lower to prevent clipping)
    var streetGeometry = new THREE.BoxGeometry(
        buildingSpacing * 2.2, 
        0.5, 
        buildingSpacing * 2.2
    );
    var streetMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        specular: 0x050505,
        shininess: 10
    });
    var streetBase = new THREE.Mesh(streetGeometry, streetMaterial);
    streetBase.position.set(x, -2.0, z); // Lowered position
    block.add(streetBase);
    
    block.position.set(x, 0, z);
    return block;
}

function generateCity() {
    // Initialize or clear existing city
    if (!city) city = new THREE.Group();
    scene.remove(city);
    city = new THREE.Group();
    
    // Calculate spacing and city size
    var blockSpacing = 10 * cityParams.blockSpacing;
    var gridSize = 8; // 8x8 grid of blocks
    
    // Generate city grid
    for (let x = -gridSize * blockSpacing/2; x <= gridSize * blockSpacing/2; x += blockSpacing) {
        for (let z = -gridSize * blockSpacing/2; z <= gridSize * blockSpacing/2; z += blockSpacing) {
            var block = createBlock(x, z);
            city.add(block);
        }
    }
    
    // Add city to scene
    scene.add(city);
    console.log("City generated with", city.children.length, "blocks");
}