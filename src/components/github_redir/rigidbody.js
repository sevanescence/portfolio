import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class RigidBody {
    /**
     * @param {THREE.Object3D} threeBody
     * @param {CANNON.Body} cannonPhysics
     */
    constructor(threeBody, cannonPhysics) {
        this.threeBody = threeBody;
        this.cannonPhysics = cannonPhysics;
    }
    synchronize() {
        this.threeBody.position.copy({
            x: this.cannonPhysics.position.x,
            y: this.cannonPhysics.position.z,
            z: this.cannonPhysics.position.y,
        });
        const qua = new THREE.Quaternion(
            -this.cannonPhysics.quaternion.x, //x
            -this.cannonPhysics.quaternion.z, //y
            -this.cannonPhysics.quaternion.y, //z
            this.cannonPhysics.quaternion.w
        );
        this.threeBody.rotation.setFromQuaternion(qua);
        // this.threeBody.rotation.setFromQuaternion({
        //     x: -this.cannonPhysics.quaternion.x,
        //     y: -this.cannonPhysics.quaternion.z,
        //     z: -this.cannonPhysics.quaternion.y,
        //     w: this.cannonPhysics.quaternion.w,
        // }); // TODO fix this
    }
    /**
     * @param {THREE.Scene} scene
     * @param {CANNON.World} world
     */
    delete(scene, world) {
        scene.remove(this.threeBody);
        world.remove(this.cannonPhysics);
    }
    /**
     * @param {THREE.Scene} scene
     * @param {CANNON.World} world
     *
     * @return {void}
     *
     * Add rigid body to the world.
     */
    initialize(scene, world) {
        scene.add(this.threeBody);
        world.addBody(this.cannonPhysics);
    }
}
