class CityBuilder {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.city = new THREE.Group();
    }

    createBuilding(x, z, type = 'small') {
        const building = this.modelLoader.getModel(type);
        if (!building) return null;

        building.position.set(x, 0, z);
        building.scale.setScalar(Math.random() * 2 + 2);
        building.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        return building;
    }

    createBlock(x, z) {
        const block = new THREE.Group();
        const spacing = 10 * cityParams.streetWidth;
        const types = ['small', 'large', 'skyscraper'];
        const count = 4 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * spacing;
            const offsetZ = (Math.random() - 0.5) * spacing;
            const type = types[Math.floor(Math.random() * types.length)];
            const building = this.createBuilding(x + offsetX, z + offsetZ, type);
            if (building) block.add(building);
        }

        return block;
    }

    generate(gridSize = 5) {
        this.scene.remove(this.city);
        this.city = new THREE.Group();

        const blockSpacing = 50 * cityParams.blockSpacing;
        for (let x = -gridSize * blockSpacing / 2; x <= gridSize * blockSpacing / 2; x += blockSpacing) {
            for (let z = -gridSize * blockSpacing / 2; z <= gridSize * blockSpacing / 2; z += blockSpacing) {
                const block = this.createBlock(x, z);
                this.city.add(block);
            }
        }

        this.scene.add(this.city);
        return this.city;
    }
}