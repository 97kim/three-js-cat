import {useEffect} from "react";
import * as THREE from "three";
import {MTLLoader} from "@/lib/MTLLoader";
import {OBJLoader} from "@/lib/OBJLoader";

const useCat = () => {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121417);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Set camera position above the model
    camera.position.set(0, -100, 60);
    camera.lookAt(0, 0, 0); // Look at the center of the scene

    // Load the .mtl file and then .obj file
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/model/cat.mtl', (materials: MTLLoader.MaterialCreator) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials); // Apply materials to the OBJLoader
      objLoader.load(
        '/model/cat.obj',
        (object: THREE.Object3D) => {
          scene.add(object);
          object.position.set(0, 0, 0); // Center the object

          // Animate the object (rotate around its center)
          const animate = () => {
            requestAnimationFrame(animate);

            object.rotation.z += 0.02; // Rotate the object around the Y-axis
            renderer.render(scene, camera);
          };

          animate();
        },
        undefined,
        (error: unknown) => {
          console.error('An error happened:', error);
        }
      );
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xcbcbcb);
    scene.add(ambientLight);

    // Directional Light: simulates sunlight and creates shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(10, 10, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Clean up
    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);
}

export default useCat;
