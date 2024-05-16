import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
const mainCamera = new THREE.PerspectiveCamera();
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({ antialias: true });

const ref1 = new THREE.Object3D();
const ref2 = new THREE.Object3D();
const ref3 = new THREE.Object3D();
const ref4 = new THREE.Object3D();
const objs = new THREE.Group();   


const foundation = { radiusTop: 2, radiusBottom: 2, height: 20 };

const materials = {
    foundation: new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true }),
    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    kleinMaterial : new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    hyperbolicMaterial : new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    torusKnotMaterial : new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    hyperbolicParaboloidMaterial : new THREE.MeshBasicMaterial({ color: 0xffa500 }),
    helicoidMaterial : new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    boyMaterial : new THREE.MeshBasicMaterial({ color: 0xffffff })
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene.background = new THREE.Color('aliceblue');
    addObjects(scene);

    createCamera();
    addCarousel(scene, 0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    mainCamera.position.set(80, 100, 80);
    mainCamera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function addMesh(obj, geom, material, x, y, z) {
    'use strict';
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function addFoundation(obj, x, y, z) {
    'use strict';
    const geom = new THREE.CylinderGeometry(4, 4, 20);
    addMesh(obj, geom, materials.foundation, x, y, z);
}

function addCarousel(obj, x, y, z) {
    'use strict';
    ref1.position.set(x, y, z);

    addFoundation(ref1, 0, 0, 0);

    obj.add(ref1);
}

function addObjects(obj) {
    'use strict';
    addDonut(objs, 40, 0, -40);
    addEnneper(objs, -35, 4, 50);
    addKlein(objs, -60, 4, 0);
    addTorusKnot(objs, -13, 8, -33);
    addHyperbolic(objs, 60, 9, 5);
    addHyperbolicParaboloid(objs, 10, 20, 20);
    addHelicoid(objs, -30, 10, 15);
    addBoy(objs, 45, 20, 10);
    obj.add(objs);
}

function addDonut(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var theta = u * Math.PI * 2;
        var phi = v * Math.PI * 2;
        var radiusTorus = 1;
        var radiusTube = 0.5;
        target.set(
            (radiusTorus + radiusTube * Math.cos(phi)) * Math.cos(theta),
            (radiusTorus + radiusTube * Math.cos(phi)) * Math.sin(theta),
            radiusTube * Math.sin(phi)
        );
    }, 20, 10);

    addMesh(obj, geom, materials.donutMaterial, x, y, z);
}

function addEnneper(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = u - (u * u * u) / 3 + (u * v * v);
        var y = v - (v * v * v) / 3 + (v * u * u);
        var z = u * u - v * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.enneperMaterial, x, y, z);
}

function addKlein(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        u *= Math.PI;
        v *= 2 * Math.PI;
        var x, y, z;

        var cosU = Math.cos(u);
        var sinU = Math.sin(u);
        var cosV = Math.cos(v);
        var sinV = Math.sin(v);

        var r = 6 * (1 + sinU);
        x = r * cosU * cosV;
        y = r * sinU;
        z = -2 * r * cosU * sinV;

        target.set(x, y, z);
    }, 10, 10);

    addMesh(obj, geom, materials.kleinMaterial, x, y, z);
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var p = 2, q = 3;
        var phi = p * u;
        var theta = q * v * Math.PI * 2;

        var x = Math.cos(theta) * (1 + Math.sin(phi));
        var y = Math.sin(theta) * (1 + Math.sin(phi));
        var z = Math.cos(phi);

        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.torusKnotMaterial, x, y, z);
}

function addHyperbolic(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = Math.cosh(u) * Math.cos(v);
        var y = Math.cosh(u) * Math.sin(v);
        var z = Math.sinh(u);
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.hyperbolicMaterial, x, y, z);
}

function addHyperbolicParaboloid(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = u;
        var y = v;
        var z = u * u - v * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.hyperbolicParaboloidMaterial, x, y, z);
}

function addHelicoid(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var c = 1;
        var x = u * Math.cos(v);
        var y = u * Math.sin(v);
        var z = c * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.helicoidMaterial, x, y, z);
}

function addBoy(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = Math.sin(u) * Math.cos(v);
        var y = Math.sin(u) * Math.sin(v);
        var z = Math.cos(u) + Math.log(Math.tan(v / 2));
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.boyMaterial, x, y, z);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, mainCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    document.body.appendChild(renderer.domElement);
    
    createScene(); // create scene: cameras, objects, light
    onResize();    // update window size
    
    new OrbitControls(mainCamera, renderer.domElement);
    
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    mainCamera.aspect = window.innerWidth / window.innerHeight;
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();