class UIController  {
    constructor(gui, modelLoader, cityBuilder, scene, directionalLight) {
        this.gui = gui;
        this.modelLoader = modelLoader;
        this.cityBuilder = cityBuilder;
        this.scene = scene;
        this.directionalLight = directionalLight;

        this.cityParams = {
            streetWidth: 1.0,
            blockSpacing: 1.2,
            lightingTime: 'sunset',
            textureMode: 'default',
            category: 'small',
            modelIndex: 0
        };

        this.setupUI();
    }

    setupUI() {
        const layoutFolder = this.gui.addFolder('Layout');
        layoutFolder.add(this.cityParams, 'streetWidth', 0.5, 2.0).name('Street Width').onChange(() => this.regenerateCity());
        layoutFolder.add(this.cityParams, 'blockSpacing', 0.5, 2.0).name('Block Spacing').onChange(() => this.regenerateCity());
        layoutFolder.open();

        const lightingFolder = this.gui.addFolder('Lighting');
        lightingFolder.add(this.cityParams, 'lightingTime', ['morning', 'noon', 'sunset', 'night']).name('Lighting').onChange(() => this.updateLighting());
        lightingFolder.open();

        const modelFolder = this.gui.addFolder('Spawn Model');
        const availableModels = this.modelLoader.modelPaths;

        modelFolder.add(this.cityParams, 'category', Object.keys(availableModels)).name('Category').onChange(value => {
            this.cityParams.modelIndex = 0;
            const modelCount = this.modelLoader.modelPaths[value].length;
            if (modelFolder.__controllers.find(c => c.property === 'modelIndex')) {
                modelFolder.remove(modelFolder.__controllers.find(c => c.property === 'modelIndex'));
            }
            modelFolder.add(this.cityParams, 'modelIndex', 0, modelCount - 1, 1).name('Model Index');
        });

        modelFolder.add({ spawn: () => this.spawnModel() }, 'spawn').name('Add to Scene');
        modelFolder.open();
    }

    regenerateCity() {
        this.cityBuilder.generate();
    }

    updateLighting() {
        let time = this.cityParams.lightingTime;
        const lightColorMap = {
            morning: 0xffe0b2,
            noon: 0xffffff,
            sunset: 0xff7043,
            night: 0x222244
        };
        this.scene.background.set(lightColorMap[time]);
        this.directionalLight.color.set(lightColorMap[time]);
        this.directionalLight.intensity = (time === 'night') ? 0.3 : 0.8;
    }

    spawnModel() {
        const model = this.modelLoader.getModel(this.cityParams.category, this.cityParams.modelIndex);
        if (model) {
            model.position.set(0, 0, 0);
            model.scale.setScalar(Math.random() * 2 + 2);
            model.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            this.scene.add(model);
        }
    }
}
export { UIController };