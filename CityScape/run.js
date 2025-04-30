let modelLoader;
let cityBuilder;
let city;
setScene();
modelLoader = new ModelLoader({
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
modelLoader.loadAll(() => {
    cityBuilder = new CityBuilder(scene, modelLoader);
    city = cityBuilder.generate();
    new InteractiveControls(renderer.domElement, scene, camera);
    animate();
});
