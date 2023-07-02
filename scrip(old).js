/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Material
const material = new THREE.MeshNormalMaterial()

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

const mesh4 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.25, 100, 16),
    material
)

const mesh5 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0,9, 0.25, 50, 16),
    material
)
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

scene.add(mesh1, mesh2, mesh3, mesh4, mesh5)

/**
* Position
*/

const objectsDistance = 4

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
mesh4.position.y = - objectsDistance * 3
mesh5.position.y = - objectsDistance * 4

// x position
mesh1.position.x = - 2
mesh2.position.x = 2
mesh3.position.x = 2
mesh4.position.x = - 2
mesh5.position.x = - 2

/**
$ Permanent rotation
*/

const sectionMeshes = [ mesh1, mesh2, mesh3, mesh4, mesh5 ]




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.05
        mesh.rotation.y += deltaTime * 0.06
    }
    
    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY    
    const newSection = Math.round(scrollY / sizes.height)
    
    /**if(newSection != currentSection)
    {
        currentSection = newSection

        console.log('changed', currentSection)
        
      gsap.to(
        sectionMeshes[currentSection].rotation,
        {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3'
        }
    )
    }*/
})

tick()

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)