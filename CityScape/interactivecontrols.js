class interactiveControls {
    constructor(domElement, scene, camera) {
        this.domElement = domElement;
        this.scene = scene;
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.plane = new THREE.Plane();
        this.offset = new THREE.Vector3();
        this.intersect = new THREE.Vector3();
        this.selected = null;
        this.dragging = false;

        this.enable();
    }

    enable() {
        this.domElement.addEventListener('pointerdown', e => this.onDown(e));
        this.domElement.addEventListener('pointermove', e => this.onMove(e));
        this.domElement.addEventListener('pointerup', () => this.onUp());
    }

    onDown(event) {
        if (event.button !== 0) return;
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            this.selected = intersects[0].object.parent;
            this.plane.setFromNormalAndCoplanarPoint(
                this.camera.getWorldDirection(this.plane.normal),
                intersects[0].point
            );
            this.offset.copy(intersects[0].point).sub(this.selected.position);
            this.dragging = true;
        }
    }

    onMove(event) {
        if (!this.selected || !this.dragging) return;
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        if (this.raycaster.ray.intersectPlane(this.plane, this.intersect)) {
            const newPos = this.intersect.clone().sub(this.offset);
            if (!this.checkCollision(this.selected, newPos)) {
                this.selected.position.copy(newPos);
            }
        }
    }

    onUp() {
        this.dragging = false;
        this.selected = null;
    }

    checkCollision(obj, newPos) {
        const tempBox = new THREE.Box3().setFromObject(obj.clone());
        tempBox.translate(newPos.clone().sub(obj.position));
        for (const other of this.scene.children) {
            if (other !== obj) {
                const otherBox = new THREE.Box3().setFromObject(other);
                if (tempBox.intersectsBox(otherBox)) return true;
            }
        }
        return false;
    }
}

export { interactiveControls };