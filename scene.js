import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
const wrap=document.getElementById('jar-canvas-wrap'),note=document.getElementById('loading-note');
try{
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
wrap.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.01,100);
camera.position.set(0,.05,4.6);scene.add(new THREE.HemisphereLight(0xffffff,0xb4a689,2));
for(const [x,y,z,power] of [[3,4,5,2],[-3,1,2,1.5],[0,3,-3,2]]){const l=new THREE.DirectionalLight(0xffffff,power);l.position.set(x,y,z);scene.add(l);}
const group=new THREE.Group();scene.add(group);
const draco=new DRACOLoader();draco.setDecoderPath('./vendor/draco/');
const loader=new GLTFLoader();loader.setDRACOLoader(draco);
loader.load('./barattolo.glb',gltf=>{const model=gltf.scene;const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());const scale=2.1/Math.max(size.x,size.y,size.z);model.scale.multiplyScalar(scale);model.position.sub(center.multiplyScalar(scale));group.add(model);document.querySelector('.hero-art').classList.add('loaded');note.hidden=true;document.getElementById('drag-hint').hidden=false;draco.dispose();},undefined,e=>{console.error(e);note.textContent='Il barattolo 3D non è disponibile al momento.';});
const resize=()=>{renderer.setSize(wrap.clientWidth,wrap.clientHeight);camera.aspect=wrap.clientWidth/wrap.clientHeight;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(wrap);resize();
let dragging=false,lastX=0,lastTouch=0;
wrap.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;wrap.setPointerCapture(e.pointerId);lastTouch=performance.now();});
wrap.addEventListener('pointermove',e=>{if(dragging){group.rotation.y+=(e.clientX-lastX)*.01;lastX=e.clientX;lastTouch=performance.now();}});
for(const event of ['pointerup','pointercancel','lostpointercapture'])wrap.addEventListener(event,()=>{dragging=false;lastTouch=performance.now();});
wrap.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();group.rotation.y+=e.key==='ArrowLeft'?-.15:.15;lastTouch=performance.now();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let previous=performance.now();let visible=true;new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(wrap);
renderer.setAnimationLoop(time=>{const dt=Math.min((time-previous)/1000,.05);previous=time;if(!visible||document.hidden)return;if(!dragging&&!reduced.matches&&time-lastTouch>3500)group.rotation.y+=dt*.16;renderer.render(scene,camera);});
}catch(error){console.error(error);note.textContent='Esplora la nostra storia qui sotto.';}
