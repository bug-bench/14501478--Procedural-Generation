class modelLoader {
    constructor(modelPaths) {
        this.modelPaths = modelPaths;
        this.loader = new THREE.GLTFLoader();
        this.models = {};
    }

    loadAll(callback) {
        const entries = Object.entries(this.modelPaths);
        let total = entries.reduce((sum, [_, val]) => sum + val.length, 0);
        let loaded = 0;

        entries.forEach(([category, paths]) => {
            this.models[category] = [];

            paths.forEach(path => {
                this.loader.load(path, (gltf) => {
                    this.models[category].push(gltf.scene);
                    loaded++;
                    if (loaded === total && typeof callback === 'function') {
                        callback();
                    }
                }, undefined, (error) => {
                    console.error(`Failed to load ${path}`, error);
                });
            });
        });
    }

    getModel(category, index = null) {
        const list = this.models[category];
        if (!list || list.length === 0) return null;
        if (index !== null && index >= 0 && index < list.length) {
            return list[index].clone(true);
        }
        return list[Math.floor(Math.random() * list.length)].clone(true);
    }

    getAvailableModels() {
        const options = {};
        for (const [category, models] of Object.entries(this.models)) {
            options[category] = models.map((_, i) => `Model ${i + 1}`);
        }
        return options;
    }
}
export { modelLoader };
