var scene, camera, renderer, parts, clock;

init();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 3, 10);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0,4,0);
  controls.update();
  
  //Add meshes here
  clock = new THREE.Clock();
  parts = [];
  const height = 3;
  const geometry = new THREE.BoxGeometry( 1, height, 1 );
  // adjust rotation origin
  geometry.vertices.forEach(v => v.y += (height/2));
  const material = new THREE.MeshPhongMaterial();
  const box = new THREE.Mesh(geometry, material);

  for(let i = 0; i < 4; i++) {
    const part = box.clone();
    part.position.set(0, height, 0);
    parts.push(part)
    if(i === 0) {
      scene.add(part);
    } else {
      parts[i-1].add(part);
    }
  }

  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  
  const theta = Math.sin(clock.getElapsedTime());
  parts.forEach(part => {
    part.rotation.z = theta;
  });
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}