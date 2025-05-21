/* global THREE, scene, cityParams, modelManager */

function createBuilding(x, z) {
    const building = new THREE.Group();
    building.position.set(x, 0, z);
    building.isBuilding = true;

    const model = modelManager.getRandomBuilding();
    if (model) {
        model.rotation.x = -Math.PI / 2; // Rotate from Z-up to Y-up
        model.position.set(0, 0, 0);
        model.scale.set(0.05, 0.05, 0.05); // adjust scale if needed
        building.add(model);
    }

    return building;
}

async function createBlock(x, z) {
    const block = new THREE.Group();
    const buildingSpacing = 5 * cityParams.streetWidth;
    const textureLoader = new THREE.TextureLoader();
    const roadTex = textureLoader.load("models/textures/Road.png");
    const footpathTex = textureLoader.load("models/textures/Foot Path.png");

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            const bx = x + (i * buildingSpacing) - (buildingSpacing / 2);
            const bz = z + (j * buildingSpacing) - (buildingSpacing / 2);
            const modelIndex = 1 + Math.floor(Math.random() * 10); // 10 FBX models
            const building = createBuilding(bx, bz, modelIndex);
            block.add(building);
        }
    }

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(buildingSpacing * 2.2, buildingSpacing * 2.2),
        new THREE.MeshStandardMaterial({ map: roadTex })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, -2.1, z);
    block.add(road);

    const footpath = new THREE.Mesh(
        new THREE.PlaneGeometry(buildingSpacing * 2.8, buildingSpacing * 2.8),
        new THREE.MeshStandardMaterial({ map: footpathTex })
    );
    footpath.rotation.x = -Math.PI / 2;
    footpath.position.set(x, -2.0, z);
    block.add(footpath);

    block.position.set(x, 0, z);
    return block;
}

function isInsideCityShape(x, z) {
    const distance = Math.sqrt(x * x + z * z);
    const bay = z < 0 && x > 0 && x < 100 && z > -50;
    return distance < 300 && !bay;
}

async function generateCity() {
    if (!city) city = new THREE.Group();
    scene.remove(city);
    city = new THREE.Group();

    const blockSpacing = 10 * cityParams.blockSpacing;
    const gridSize = 4; // reduced for performance

    for (let x = -gridSize * blockSpacing / 2; x <= gridSize * blockSpacing / 2; x += blockSpacing) {
        for (let z = -gridSize * blockSpacing / 2; z <= gridSize * blockSpacing / 2; z += blockSpacing) {
            if (isInsideCityShape(x, z)) {
                const block = await createBlock(x, z);
                city.add(block);
            }
        }
    }

    scene.add(city);
    console.log("City generated with", city.children.length, "blocks");
}