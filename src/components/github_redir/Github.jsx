import { Component } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import RigidBody from './rigidbody';
import './Github.css';

class AnimationContainer {
    /** @param {string} containerId ID of the container element */
    constructor(containerId) {
        this.containerId = containerId;
        this.initialize = this.initialize.bind(this);
        this.animate = this.animate.bind(this);
        this.initObjects = this.initObjects.bind(this);
    }
    /** Call only in Component#componentDidMount */
    initialize() {
        this.dom = document.getElementById(this.containerId);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
        this.renderer.setClearColor(0x1c1e2e);
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.dom.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.dom.clientWidth / this.dom.clientHeight,
            0.01,
            500
        );
        this.camera.position.z = 20;
        /** @type {Map<string, RigidBody>} */
        this.objects = new Map();
        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -9.82);

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.ambient = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(this.ambient);

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(-10, 20, 15);
        this.scene.add(this.light);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.initObjects();

        this.animate(0);
    }
    initObjects() {
        const cubeThreeGeometry = new THREE.BoxGeometry(20, 16, 4);
        const cubeThreeMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
        });
        const cubeThreeBody = new THREE.Mesh(
            cubeThreeGeometry,
            cubeThreeMaterial
        );
        const cubePhysics = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(10, 8, 2)),
            position: new CANNON.Vec3(0, 0, 0),
        });
        const wall = new RigidBody(cubeThreeBody, cubePhysics);
        this.objects.set('wall', wall);

        this.world.addBody(cubePhysics);
        this.scene.add(cubeThreeBody);
    }
    /** @type {FrameRequestCallback} */
    animate(time) {
        this.world.step(1 / 60);
        for (let object of this.objects.values()) {
            object.synchronize();
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }
}

const randrange = (min, max) => Math.random() * (max - min) + min;
const rn = (n) => (Math.random() > 0.5 ? -n : n);

class GithubRedirect extends Component {
    componentDidMount() {
        this.animationContainer = new AnimationContainer('three-container');
        this.animationContainer.initialize();
        const mouse = this.animationContainer.mouse;
        const dom = this.animationContainer.dom;
        dom.addEventListener('click', (event) => {
            mouse.x = (event.clientX / dom.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / dom.clientHeight) * 2 + 1;
            this.animationContainer.raycaster.setFromCamera(
                this.animationContainer.mouse,
                this.animationContainer.camera
            );
            const intersects = this.animationContainer.raycaster.intersectObjects(
                this.animationContainer.scene.children
            );
            // it can be assumed that the only clicked object is the wall.
            if (intersects.length > 0) {
                this.animationContainer.objects
                    .get('wall')
                    .delete(
                        this.animationContainer.scene,
                        this.animationContainer.world
                    );
                const particles = async () => {
                    for (let i = 0; i < 60; i++) {
                        const physics = new CANNON.Body({
                            mass: 1,
                            position: new CANNON.Vec3(
                                randrange(-8, 8),
                                0,
                                randrange(-8, 8)
                            ),
                            shape: new CANNON.Box(
                                new CANNON.Vec3(0.25, 0.25, 0.25)
                            ),
                            velocity: new CANNON.Vec3(
                                rn(randrange(5, 15)),
                                rn(randrange(1, 5)),
                                rn(randrange(5, 15))
                            ),
                        }); // defaultSphere.setVelocity(50, defaultSphere.physics.velocity.z, 0)
                        const object = new THREE.Mesh(
                            new THREE.BoxGeometry(0.5, 0.5, 0.5),
                            new THREE.MeshPhysicalMaterial({ color: 0x222222 })
                        );
                        // object.castShadow = true;
                        // object.receiveShadow = true;
                        const body = new RigidBody(object, physics);
                        const world = this.animationContainer.world;
                        const scene = this.animationContainer.scene;
                        body.initialize(scene, world);
                        this.animationContainer.objects.set(`p-${i}`, body);
                    }
                };
                particles();
                setTimeout(() => {
                    window.location.href = 'https://github.com/makotomiyamoto';
                }, 1000);
            }
        });
    }
    render() {
        return (
            <div id='three-container'>
                <div
                    id='redirect-proxy-content'
                    className='fixed header-pad stretch-height center-all'
                >
                    <div className='proxy-content-pad'></div>
                    <div className='proxy-content-top center-all flex-col'>
                        <h2 className='center-text'>Hey there!</h2>
                        <p className='center-text'>
                            I just want to make sure you aren't a bot or
                            anything... Can you go ahead and{' '}
                            <span className='important'>
                                click the white wall
                            </span>{' '}
                            next to you to break the proxy? (and NO, this is{' '}
                            <span className='italic'>NOT</span> an excuse to
                            show off threejs.)
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default GithubRedirect;
