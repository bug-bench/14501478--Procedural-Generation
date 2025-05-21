/* global THREE, scene, cityParams, noise */

function generateBuildingCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, width, height);

    for (let y = 4; y < height - 2; y += 3) {
        for (let x = 0; x < width; x += 3) {
            const shade = Math.floor(Math.random() * 64);
            ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
            ctx.fillRect(x, y, 2, 1);
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
}

const buildingTexture = generateBuildingCanvas(cityParams.canvasSize.width, cityParams.canvasSize.height);

function createBuilding(x, z, height) {
    const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(cityParams.buildingColor),
        map: buildingTexture
    });
    const topMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(cityParams.buildingColor) });
    const materials = [material, material, topMat, topMat, material, material];
    const geometry = new THREE.BoxGeometry(10, height, 10);
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(x, height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function createBlock(type, x, z) {
    const group = new THREE.Group();
    const blockSize = 20;
    const roadThickness = 2;

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(blockSize + roadThickness, 0.5, blockSize + roadThickness),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    base.position.set(x, -1, z);
    group.add(base);

    if (type === 'building') {
        const h = THREE.MathUtils.randInt(
            cityParams.buildingHeight.min * 5,
            cityParams.buildingHeight.max * 5
        );
        group.add(createBuilding(x, z, h));

    } else if (type === 'park') {
        const ground = new THREE.Mesh(
            new THREE.BoxGeometry(blockSize, 0.3, blockSize),
            new THREE.MeshLambertMaterial({ color: 0x228B22 })
        );
        ground.position.set(x, -0.75, z);
        group.add(ground);

        const trees = THREE.MathUtils.randInt(2, 5);
        for (let i = 0; i < trees; i++) {
            const tx = x + (Math.random() - 0.5) * (blockSize - 4);
            const tz = z + (Math.random() - 0.5) * (blockSize - 4);
            group.add(createTree(tx, tz));
        }

    } else if (type === 'water') {
        const water = new THREE.Mesh(
            new THREE.BoxGeometry(blockSize + roadThickness, 0.5, blockSize + roadThickness),
            new THREE.MeshPhongMaterial({ color: 0x4b95de, transparent: true, opacity: 0.6 })
        );
        water.position.set(x, -1, z);
        group.add(water);
    }

    return group;
}

function createTree(x, z) {
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 3, 6),
        new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    );
    trunk.position.set(x, 1.5, z);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(2, 3, 8),
        new THREE.MeshLambertMaterial({ color: 0x2E8B57 })
    );
    leaves.position.set(x, 4.5, z);

    const tree = new THREE.Group();
    tree.add(trunk);
    tree.add(leaves);
    return tree;
}

function generateCity() {
    if (!city) city = new THREE.Group();
    scene.remove(city);
    city = new THREE.Group();

    const gridSize = 15;
    const spacing = 20 + 2;
    noise.seed(cityParams.perlinSeed);

    const baySide = Math.floor(Math.random() * 4); // 0=left, 1=right, 2=top, 3=bottom
    const bayDepthProfile = [4, 3, 3, 2, 2, 2, 1, 0];
    const bayStart = Math.floor((gridSize - bayDepthProfile.length) / 2);

    for (let gx = 0; gx < gridSize; gx++) {
        for (let gz = 0; gz < gridSize; gz++) {
            const x = gx * spacing - (gridSize * spacing / 2);
            const z = gz * spacing - (gridSize * spacing / 2);

            const value = Math.abs(noise.perlin2(gx / 5, gz / 5));
            let type = 'building';

            // Bay profile logic based on side
            let bayIndex, bayLimit = -1;
            if (baySide === 0 && gx < bayDepthProfile[0]) {
                bayIndex = gz - bayStart;
                if (bayIndex >= 0 && bayIndex < bayDepthProfile.length) bayLimit = bayDepthProfile[bayIndex];
                if (gx < bayLimit) type = 'water';
            } else if (baySide === 1 && gx >= gridSize - bayDepthProfile[0]) {
                bayIndex = gz - bayStart;
                if (bayIndex >= 0 && bayIndex < bayDepthProfile.length) bayLimit = bayDepthProfile[bayIndex];
                if (gx >= gridSize - bayLimit) type = 'water';
            } else if (baySide === 2 && gz < bayDepthProfile[0]) {
                bayIndex = gx - bayStart;
                if (bayIndex >= 0 && bayIndex < bayDepthProfile.length) bayLimit = bayDepthProfile[bayIndex];
                if (gz < bayLimit) type = 'water';
            } else if (baySide === 3 && gz >= gridSize - bayDepthProfile[0]) {
                bayIndex = gx - bayStart;
                if (bayIndex >= 0 && bayIndex < bayDepthProfile.length) bayLimit = bayDepthProfile[bayIndex];
                if (gz >= gridSize - bayLimit) type = 'water';
            } else if (value < 0.12) {
                type = 'park';
            }

            const block = createBlock(type, x, z);
            city.add(block);
        }
    }

    scene.add(city);
    console.log("City generated with bay side:", baySide);
}

