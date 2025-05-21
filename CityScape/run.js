/* global setScene, generateCity, animate */

// Initialize the scene, generate city, and start animation loop
modelManager.loadModel(() => {
    setScene();
    generateCity();
    animate();
});
