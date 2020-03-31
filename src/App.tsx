import * as THREE from 'three';
import React, { CSSProperties, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring';
import { makeNoise2D } from 'open-simplex-noise';

import './App.css';

const [noiseWidth, noiseHeight] = [256, 256];
const noise = makeNoise2D(Date.now());

function sample(x: number, y: number): number {
  let freq = 32;
  let fbm = noise(x * freq, y * freq);
  freq *= 2; x += 32;
  fbm += noise(x * freq, y * freq) * 0.5;
  freq *= 2; x += 42;
  fbm += noise(x * freq, y * freq) * 0.35;
  freq *= 2; x += 9973;
  fbm += noise(x * freq, y * freq) * 0.25;
  freq *= 2; x += 824;
  fbm += noise(x * freq, y * freq) * 0.065;

  return fbm*2.5;
}

function Scene() {
  const { scene } = useThree();

  scene.fog = new THREE.Fog(0x16161f, 10, 100);

  return (
    <>
      <ambientLight intensity={0.25}/>
      <spotLight position={[0, 128, 32]} intensity={0.75} castShadow />
      <Terrain />
    </>
  );
}

function Terrain() {
  const mesh = useRef<THREE.Mesh>();

  useEffect(() => {
    if (mesh.current) {
      const wireframeGeo = new THREE.WireframeGeometry(mesh.current.geometry);
      const wireframeMat = new THREE.LineBasicMaterial({color: 0x16161f});
      const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);

      mesh.current.add(wireframe);
      mesh.current.position.y -= 10;
    }
  })

  useFrame(() => {
    if (mesh.current) {
      //mesh.current.position.z += 0.01;
    }
  });

  const geo = new THREE.PlaneGeometry(noiseWidth, noiseHeight, noiseWidth-1, noiseHeight-1);
  geo.rotateX(-89);

  geo.vertices = geo.vertices.map(vertex => 
    vertex.setY(sample(vertex.x / 256, vertex.z / 256))
  );

  return (
    <>
      <mesh 
      geometry={geo}
      ref={mesh}>
        <meshPhongMaterial attach="material" color={new THREE.Color(0x2d2d3b)} />
      </mesh>
    </>
  );
}

const trans: any = (s: any) => `scale(${s})`;

type CardProps = {
  headerText: string,
  style: CSSProperties,
};

function cardProps(headerText: string, imageUrl: string): CardProps {
  let style: CSSProperties = { backgroundImage: `url(${imageUrl})` };
  
  return {
    headerText,
    style
  };
}

const Card = (cardProps: CardProps) => {
  const cardRef = useRef<any>(null);

  const [props, set] = useSpring(() => ({ 
    s: 1, 
    config: { mass: 1, tension: 100, friction: 10 } 
  }));

  function style(): React.CSSProperties {
    return {
      display: 'absolute',
      transform: props.s.interpolate(trans),
    };
  }

  return (
    <>
      <animated.div
      ref={cardRef}
      className="card"
      style={style()}
      onMouseMove={() => set ({ s: 1.1 })}
      onMouseLeave={() => set({ s: 1 })}>
        <div className="card-header">
          {cardProps.headerText}
          <hr className="card-header-line"></hr>
          <div className="card-content" style={cardProps.style}></div>
        </div>
      </animated.div>
    </>
  );
}

function App() {
  return (
    <div className="main">
      <div className="header">Adam Gleave</div>
      <Canvas>
        <Scene />
      </Canvas>
      <div className="grid-container">
        <div className="grid">
          <Card {...cardProps("OpenMW", "https://i.ytimg.com/vi/izlm2CAnCpY/maxresdefault.jpg")} />
          <Card {...cardProps("OpenCK", "https://imgur.com/Zfh3eDn.png")} />
          <Card {...cardProps("Rustbucket", "https://i.imgur.com/xCYk9h7.png")} />
          <Card {...cardProps("Voxels", "https://imgur.com/ucOoqnc.png")} />
        </div>
      </div>
    </div>
  );
}

export default App;
