const modelManager = {
    buildingPrototypes: [],

    loadModel(onComplete) {
        const loader = new THREE.GLTFLoader();
        loader.load('models/city_buildings.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    // Clone and store separately for future use
                    this.buildingPrototypes.push(child.clone(true));
                }
            });

            console.log("Loaded", this.buildingPrototypes.length, "building meshes");
            if (onComplete) onComplete();
        });
    },

    getRandomBuilding() {
        if (this.buildingPrototypes.length === 0) return null;
        const base = this.buildingPrototypes[Math.floor(Math.random() * this.buildingPrototypes.length)];
        return base.clone(true);
    }
};
