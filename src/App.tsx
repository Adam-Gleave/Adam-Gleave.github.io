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

const calc = (x: any, y: any, cardX: number, cardY: number) => [
  -(y - cardY) / 20, (x - cardX) / 20, 1.05
];

const trans: any = (x: any, y: any, s: any) => `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

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

function Card(cardProps: CardProps) {
  const [props, set] = useSpring(() => ({ 
    xys: [0, 0, 1], 
    config: { mass: 5, tension: 350, friction: 40 } 
  }));

  function style(): React.CSSProperties {
    return {
      display: 'absolute',
      transform: props.xys.interpolate(trans),
    };
  }

  return (
    <animated.div
    className="card"
    style={style()}
    onMouseMove={({ clientX: x, clientY: y }) => set ({ 
      xys: calc(
        x, y, 
        window.innerWidth * (20 / 100), 
        window.innerHeight * (60 / 100)
      ) 
    })}
    onMouseLeave={() => set({ xys: [0, 0, 1] })}>
      <div className="card-header">
        {cardProps.headerText}
        <hr className="card-header-line"></hr>
        <div className="card-content" style={cardProps.style}></div>
      </div>
    </animated.div>
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
