//canvas
const canvas = document.querySelector('canvas.webgl')
const planetContainer = document.querySelector('.planet-gl-container')
const planetcanvas = document.querySelector('canvas.planet-webgl')
const galleryContainer = document.querySelector('.gallery-gl-container')
const gallerycanvas = document.querySelector('canvas.gallery')

//texture loader
const starLoader = new THREE.TextureLoader()
const textureLoader = new THREE.TextureLoader()
const star = starLoader.load('images/star.png')

//scene
const scene = new THREE.Scene()
const scenePlanet = new THREE.Scene()
const sceneGallery = new THREE.Scene()

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const conatinerSizes = {
    width: planetContainer.clientWidth,
    height: planetContainer.clientHeight
}
const conatinerSizesG = {
    width: galleryContainer.clientWidth,
    height: galleryContainer.clientHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update sizes
    conatinerSizes.width = planetContainer.innerWidth
    conatinerSizes.height = planetContainer.innerHeight

    // Update sizes
    conatinerSizesG.width = galleryContainer.innerWidth
    conatinerSizesG.height = galleryContainer.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update camera
    planetcamera.aspect = conatinerSizes.width / conatinerSizes.height
    planetcamera.updateProjectionMatrix()

    // Update camera
    gallerycamera.aspect = conatinerSizesG.width / conatinerSizesG.height
    gallerycamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))

    // Update renderer
    planetrenderer.setSize(planetContainer.width, planetContainer.height)
    planetrenderer.setPixelRatio(Math.min(planetContainer.devicePixelRatio, 1))
    // Update renderer
    galleryrenderer.setSize(galleryContainer.width, galleryContainer.height)
    galleryrenderer.setPixelRatio(Math.min(galleryContainer.devicePixelRatio, 1))
})

//geometry
const geometry = new THREE.TorusKnotGeometry( 1.5, 0.5, 250, 30 );
const planetgeometry = new THREE.TorusGeometry( 1.1, 1.1, 30, 120 );
const gallerygeometry = new THREE.PlaneBufferGeometry(4.05,2.7,20,20)
planeCurve(gallerygeometry, -5)

const particleGeometry = new THREE.BufferGeometry;
const particleCnt = 4000
const posArray = new Float32Array(particleCnt * 3)

for(let i = 1; i < 6; i++){
    const gallerymaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`images/projects/0${i}.jpg`),
    })

    const img = new THREE.Mesh(gallerygeometry, gallerymaterial)
    img.position.set(Math.random(0,1), i*-3)
    sceneGallery.add(img)
    sceneGallery.rotation.set(1, i, 0)
}

for(let i = 0; i < particleCnt * 3; i++){
    // posArray[i] = Math.random()
    // posArray[i] = Math.random() - 0.5
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 30)
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

//material
const material = new THREE.PointsMaterial({
    size: 0.005
})
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    map: star,
    transparent: true
})
const planetMaterial = new THREE.PointsMaterial({
    size: 0.005
})

//shapes
const shape = new THREE.Points(geometry, material)
const particlesMesh = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(shape, particlesMesh)

const sphere = new THREE.Points(planetgeometry, planetMaterial)
scenePlanet.add(sphere)

//lights
const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(2,3,4)
scene.add(pointLight)
scenePlanet.add(pointLight)
sceneGallery.add(pointLight)

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,5)
scene.add(camera)

const planetcamera = new THREE.PerspectiveCamera(75, conatinerSizes.width / conatinerSizes.height, 0.1, 100)
planetcamera.position.set(0,0,5)
scenePlanet.add(planetcamera)

const gallerycamera = new THREE.PerspectiveCamera(75, conatinerSizesG.width / conatinerSizesG.height, 0.1, 100)
gallerycamera.position.set(0,0,6)
sceneGallery.add(gallerycamera)

//renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const planetrenderer = new THREE.WebGLRenderer({
    canvas: planetcanvas,
    alpha: true,
    antialias: true
})
planetrenderer.setSize(conatinerSizes.width, conatinerSizes.height)

const galleryrenderer = new THREE.WebGLRenderer({
    canvas: gallerycanvas,
    alpha: true,
    antialias: true
})
galleryrenderer.setSize(conatinerSizesG.width, conatinerSizesG.height)

//mouse
document.addEventListener('mousemove', animateParticles)
let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseX = event.clientX
    mouseY = event.clientY
}

const clock = new THREE.Clock()

const animate = () =>{
	const elapsedTime = clock.getElapsedTime()
    shape.rotation.y += 0.01
    sphere.rotation.y += 0.01
    particlesMesh.rotation.y = 0.05 * elapsedTime

    if (mouseX > 0) {
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00004)
        particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00004)
        sphere.rotation.y = -mouseX * (elapsedTime * 0.0001)
    }

    renderer.render(scene, camera)
    planetrenderer.render(scenePlanet, planetcamera)
	galleryrenderer.render(sceneGallery, gallerycamera)
	window.requestAnimationFrame(animate)
}
animate()

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true
});

let sphereAnim = gsap.timeline()
let elAnim = gsap.timeline()

// Full Height

sphereAnim.to(camera.position, { z: -9, scrollTrigger: {
    trigger: ".section-two",
    endTrigger: ".section-three",
    end: "top top",      

}})
sphereAnim.to(camera.rotation, { x: -1, scrollTrigger: {
    trigger: ".section-two",
    endTrigger: ".section-three",
    end: "top top",      

}})

sphereAnim.to(planetcamera.position, { z: 3, scrollTrigger: {

    trigger: ".section-three",

    endTrigger: ".section-four",
    end: "top top",      

}})
sphereAnim.to(planetcamera.rotation, { y: 0, scrollTrigger: {

    trigger: ".section-three",

    endTrigger: ".section-four",
    end: "top top",      

}})
sphereAnim.to('.f-txt-1', { x: 100, scrollTrigger: {

    trigger: ".section-three",

    endTrigger: ".section-four",
    end: "top top",      

}})
sphereAnim.to('.f-txt-2', { x: -100, scrollTrigger: {

    trigger: ".section-three",

    endTrigger: ".section-four",
    end: "top top",      

}})
sphereAnim.to('.f-txt-3', { x: 100, scrollTrigger: {

    trigger: ".section-three",

    endTrigger: ".section-four",
    end: "top top",      

}})
sphereAnim.to('.f-txt-4', { x: -50, scrollTrigger: {

    trigger: ".section-three",

    endTrigger: ".section-four",
    end: "top top",      

}})
sphereAnim.to(gallerycamera.position, { y: -23.7, scrollTrigger: {
    trigger: ".cjco",
    endTrigger: ".section-six",
    end: "top bottom",      
}})
sphereAnim.to(gallerycamera.position, { z: 4, scrollTrigger: {
    trigger: ".cjco",
    endTrigger: ".section-six",
    end: "top bottom",      
}})


sphereAnim.to(gallerycamera.rotation, { x: 1, scrollTrigger: {
    trigger: ".cjco",
    endTrigger: ".section-six",
    end: "top bottom",      
}})
sphereAnim.to(gallerycamera.rotation, { z: 0.3, scrollTrigger: {
    trigger: ".cjco",
    endTrigger: ".section-six",
    end: "top bottom",      
}})

elAnim.to(camera.position, { z: 5, scrollTrigger: {
    trigger: ".section-five",
    endTrigger: ".section-six",
    end: "top top",      
}})
elAnim.to(camera.rotation, { x: 0, scrollTrigger: {
    trigger: ".section-five",
    endTrigger: ".section-six",
    end: "top top",      

}})

// //GUI
// const lightFolder = gui.addFolder('Light') 
// lightFolder.add(pointLight.position, 'x').max(10).min(-10)
// lightFolder.add(pointLight.position, 'y').max(10).min(-10)
// lightFolder.add(pointLight.position, 'z').max(10).min(-10)

function planeCurve(g, z){
    
  let p = g.parameters;
  let hw = p.width * 0.5;
  
  let a = new THREE.Vector2(-hw, 0);
  let b = new THREE.Vector2(0, z);
  let c = new THREE.Vector2(hw, 0);
  
  let ab = new THREE.Vector2().subVectors(a, b);
  let bc = new THREE.Vector2().subVectors(b, c);
  let ac = new THREE.Vector2().subVectors(a, c);
  
  let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
  
  let center = new THREE.Vector2(0, z - r);
  let baseV = new THREE.Vector2().subVectors(a, center);
  let baseAngle = baseV.angle() - (Math.PI * 0.5);
  let arc = baseAngle * 2;
  
  let uv = g.attributes.uv;
  let pos = g.attributes.position;
  let mainV = new THREE.Vector2();
  for (let i = 0; i < uv.count; i++){
    let uvRatio = 1 - uv.getX(i);
    let y = pos.getY(i);
    mainV.copy(c).rotateAround(center, (arc * uvRatio));
    pos.setXYZ(i, mainV.x, y, -mainV.y);
  }
  
  pos.needsUpdate = true;
  
}