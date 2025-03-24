/* global THREE, scene, cityParams */
var clock = new THREE.Clock();

function createBuilding(x, z) {
    var height = Math.floor(Math.random() * 
              (cityParams.buildingHeight.max - cityParams.buildingHeight.min + 1) + 
              cityParams.buildingHeight.min);
    var building = new THREE.Group();
    building.isBuilding = true;

    // Convert hex colors from GUI to Three.js colors
    var buildingColor = new THREE.Color(cityParams.buildingColor);
    var windowColor = new THREE.Color(cityParams.windowColor);
    var lightColor = new THREE.Color(cityParams.lightColor);

    // Main building material
    var buildingMaterial = new THREE.MeshPhongMaterial({ 
        color: buildingColor,
        specular: 0x111111,
        shininess: 30
    });

    for (let i = 0; i < height; i++) {
        var geometry = new THREE.BoxGeometry(5, 5, 5);
        var cube = new THREE.Mesh(geometry, buildingMaterial.clone());
        cube.position.set(0, i * 5, 0);
        building.add(cube);

        // Windows (unchanged)
        if (i % 2 === 0 && Math.random() > 0.5 && i < height - 1) {
            var windowGeometry = new THREE.BoxGeometry(3, 3, 0.1);
            var windowMaterial = new THREE.MeshBasicMaterial({ color: windowColor });
            
            ['front', 'back', 'left', 'right'].forEach((side) => {
                var windowCube = new THREE.Mesh(windowGeometry, windowMaterial);
                switch(side) {
                    case 'front': windowCube.position.set(0, (i + 0.5) * 5, 2.5); break;
                    case 'back': windowCube.position.set(0, (i + 0.5) * 5, -2.5); break;
                    case 'left': 
                        windowCube.position.set(-2.5, (i + 0.5) * 5, 0); 
                        windowCube.rotation.y = Math.PI/2; 
                        break;
                    case 'right': 
                        windowCube.position.set(2.5, (i + 0.5) * 5, 0); 
                        windowCube.rotation.y = Math.PI/2; 
                        break;
                }
                building.add(windowCube);
            });
        }

        // Light strips (all floors except top)
        if (i < height - 1) {
            var lightGeometry = new THREE.BoxGeometry(5.1, 0.3, 0.2);
            var lightMaterial = new THREE.MeshBasicMaterial({ 
                color: lightColor,
                transparent: true,
                opacity: 0.8
            });
            
            for (let side = 0; side < 4; side++) {
                var lightStrip = new THREE.Mesh(lightGeometry, lightMaterial);
                var angle = side * Math.PI / 2;
                lightStrip.position.set(
                    2.55 * Math.sin(angle),
                    (i + 0.85) * 5,
                    2.55 * Math.cos(angle)
                );
                lightStrip.rotation.y = angle;
                lightStrip.userData = { 
                    floor: i,
                    side: side,
                    timeOffset: Math.random() * Math.PI * 2
                };
                building.add(lightStrip);
            }
        }
    }

    // Foundation
    var foundationGeometry = new THREE.BoxGeometry(6, 1, 6);
    var foundationMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x777777,
        specular: 0x111111,
        shininess: 15
    });
    var foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.set(0, -0.5, 0);
    building.add(foundation);

    building.position.set(x, 0, z);
    return building;
}

function createBlock(x, z) {
    var block = new THREE.Group();
    var buildingSpacing = 5 * cityParams.streetWidth;
    
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            var bx = x + (i * buildingSpacing) - (buildingSpacing/2);
            var bz = z + (j * buildingSpacing) - (buildingSpacing/2);
            var building = createBuilding(bx, bz);
            block.add(building);
        }
    }
    
    // Street base
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
    streetBase.position.set(x, -0.75, z);
    block.add(streetBase);
    
    block.position.set(x, 0, z);
    return block;
}

function generateCity() {
    if (!city) city = new THREE.Group();
    scene.remove(city);
    city = new THREE.Group();
    
    var blockSpacing = 10 * cityParams.blockSpacing;
    var gridSize = 8;
    
    for (let x = -gridSize * blockSpacing/2; x <= gridSize * blockSpacing/2; x += blockSpacing) {
        for (let z = -gridSize * blockSpacing/2; z <= gridSize * blockSpacing/2; z += blockSpacing) {
            var block = createBlock(x, z);
            city.add(block);
        }
    }
    
    scene.add(city);
    console.log("City generated with", city.children.length, "blocks");
}