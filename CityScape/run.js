import { modelLoader } from './modelLoader.js';
import { cityBuilder } from './cityBuilder.js';
import { interactiveControls } from './interactiveControls.js';
import { UIController } from './UIController.js';
import { cityParams } from './cityParams.js';
import { setScene, animate, scene, camera, renderer, directionalLight } from './setup.js';

let modelLoaderInstance;
let cityBuilderInstance;
let city;
let gui;
let uiControllerInstance;

setScene();

modelLoaderInstance = new modelLoader({
    small: ['models/Small Building 1.glb'],
    large: [
        'models/Large Building 1.glb',
        'models/Large Building 2.glb',
        'models/Large Building 3.glb'
    ],
    skyscraper: [
        'models/Skyscraper 1.glb',
        'models/Skyscraper 2.glb'
    ]
});

modelLoaderInstance.loadAll(() => {
    cityBuilderInstance = new cityBuilder(scene, modelLoaderInstance);
    city = cityBuilderInstance.generate();
    gui = new dat.GUI();
    uiControllerInstance = new UIController(gui, modelLoaderInstance, cityBuilderInstance, scene, directionalLight);
    new interactiveControls(renderer.domElement, scene, camera);
    animate();
});