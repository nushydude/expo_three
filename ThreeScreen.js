import Expo from "expo";
import { GLView } from 'expo-gl';
import React, { Component } from "react";
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';
import { Renderer, TextureLoader } from 'expo-three';


export class ThreeScreen extends Component {
  timeout = null;
  
  _onGLContextCreate = async (gl) => {
    
    console.log('start');
    
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    const cube = new IconMesh();
    scene.add(cube);

    camera.lookAt(cube.position);

    function update() {
      console.log('update called');
      
      cube.rotation.y += 0.05;
      cube.rotation.x += 0.025;
    }

    // Setup an animation loop
    const render = () => {
      console.log('Render');
      
      this.timeout = requestAnimationFrame(render);
      
      requestAnimationFrame(render);
      
      update();
      
      renderer.render(scene, camera);
      
      gl.endFrameEXP();
    };
    
   
    
    render(); 
  }
  
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  
  render() {  
    
    
    
     return(       
        <GLView          
          style={{ flex: 1 }}           
          onContextCreate={this._onGLContextCreate}
        />    
      )
    }
}

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(require('./icon.png')),
        // color: 0xff0000
      })
    );
  }
}