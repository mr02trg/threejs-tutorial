var scene, camera, cameras, cameraIndex, renderer, controls, clock, player;

init();

function init(){
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  let col = 0x605050;
	scene = new THREE.Scene();
	scene.background = new THREE.Color( col );
	scene.fog = new THREE.Fog( col, 10, 30 );
  
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 4, 8);
  camera.lookAt(0,1.5,0);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI/2;
  scene.add(plane);
  
  const grid = new THREE.GridHelper( 200, 80);
  scene.add( grid );
  
  //Add meshes here
  player = new THREE.Group();
  const playerMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
  const bodyGeometry = new THREE.CylinderBufferGeometry(.3, .2, 1, 30, 20);
  const headGeometry = new THREE.SphereBufferGeometry(.3, 30, 20);
  const body = new THREE.Mesh(bodyGeometry, playerMaterial);
  const head = new THREE.Mesh(headGeometry, playerMaterial);
  head.position.y = 1;
  player.add(body);
  player.add(head);
  scene.add(player);

  
  //Add cameras
  cameras = [];
  cameraIndex = 0;
  const followCam = new THREE.Object3D();
  followCam.position.copy(camera.position);
  player.add(followCam);
  cameras.push(followCam);

  const frontCam = new THREE.Object3D();
  frontCam.position.set(0, 3, -8);
  player.add(frontCam);
  cameras.push(frontCam);

  const overheadCam = new THREE.Object3D();
  overheadCam.position.set(0, 20, 0);
  cameras.push(overheadCam);
  
  addKeyboardControl();
  const btn = document.getElementById('camera-btn');
  btn.addEventListener('click', changeCamera);
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function changeCamera(){
  cameraIndex++;
  if (cameraIndex>=cameras.length) cameraIndex = 0;
}

function addKeyboardControl(){
    document.addEventListener( 'keydown', keyDown );
    document.addEventListener( 'keyup', keyUp );
}
  
function keyDown(evt){
    let forward = (player.userData!==undefined && player.userData.move!==undefined) ? player.userData.move.forward : 0;
    let turn = (player.userData!=undefined && player.userData.move!==undefined) ?  player.userData.move.turn : 0;
    
    switch(evt.keyCode){
      case 87://W
        forward = -1;
        break;
      case 83://S
        forward = 1;
        break;
      case 65://A
        turn = 1;
        break;
      case 68://D
        turn = -1;
        break;
    }
    
    playerControl(forward, turn);
}
  
function keyUp(evt){
    let forward = (player.userData!==undefined && player.userData.move!==undefined) ? player.userData.move.forward : 0;
    let turn = (player.move!=undefined && player.userData.move!==undefined) ?  player.userData.move.turn : 0;
    
    switch(evt.keyCode){
      case 87://W
        forward = 0;
        break;
      case 83://S
        forward = 0;
        break;
      case 65://A
        turn = 0;
        break;
      case 68://D
        turn = 0;
        break;
    }
    
    playerControl(forward, turn);
}

function playerControl(forward, turn){
   	if (forward==0 && turn==0){
			delete player.userData.move;
		}else{
      if (player.userData===undefined) player.userData = {};
			this.player.userData.move = { forward, turn }; 
		}
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  
  const dt = clock.getDelta();
  
  if (player.userData!==undefined && player.userData.move!==undefined){
    player.translateZ(player.userData.move.forward * dt * 5);
    player.rotateY(player.userData.move.turn * dt);
  }
  
  //Add camera lerping
  camera.position.lerp(cameras[cameraIndex].getWorldPosition(new THREE.Vector3()), .05);
  
  const pos = player.position.clone();
  pos.y += 3;
  camera.lookAt(pos);
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}