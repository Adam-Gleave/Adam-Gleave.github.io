import * as THREE from 'three';
import React, { CSSProperties, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { animated, interpolate, useSpring } from 'react-spring';
import { Flipper, Flipped } from 'react-flip-toolkit';
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

type CardFrontProps = {
  headerText: string,
  style: CSSProperties,
  toggleFlipped: () => void,
};

function makeProps(headerText: string, imageUrl: string, toggleFlipped: () => void): CardFrontProps {
  let style: CSSProperties = { backgroundImage: `url(${imageUrl})` };
  
  return {
    headerText,
    style,
    toggleFlipped,
  };
}

const CardFront = (props: CardFrontProps) => (
  <Flipped flipId="card">
    <div className="card" onClick={props.toggleFlipped}>
      <div className="card-header" style={{display: "absolute"}}>
        {props.headerText}
        <hr className="card-header-line" />
        <div className="card-content" style={props.style} />
      </div>
    </div>
  </Flipped>
);

type CardBackProps = {
  headerText: string,
  toggleFlipped: () => void,
};

const CardBack = (props: CardBackProps) => (
  <Flipped flipId="card">
    <div className="card" onClick={props.toggleFlipped}>
      <div className="card-header" style={{display: "absolute"}}>
        {props.headerText}
        <hr className="card-header-line" />
        <div className="card-content" />
      </div>
    </div>
  </Flipped>
);

type CardProps = {
  headerText: string,
  url: string
};

const Card = (cardProps: CardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [scale, setScale] = useState(1);

  const toggleFlipped = () => setFlipped(flipped => !flipped);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg) scale(${scale})`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  function opacityFunc(o: any): number {
    if (typeof o === "number") {
      return 1 - o;
    }
    return 1;
  }

  return (
    <Flipper flipKey={flipped} spring="gentle">
      {flipped ? (
        <animated.div style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }}>
          <CardBack headerText={cardProps.headerText} toggleFlipped={toggleFlipped} />
        </animated.div>
      ) : (
        <animated.div onMouseEnter={() => setScale(1.1)} onMouseLeave={() => setScale(1)} style={{ opacity: opacity.interpolate(o => opacityFunc(o)), transform }}>
          <CardFront {...makeProps(cardProps.headerText, cardProps.url, toggleFlipped)} />
        </animated.div>
      )}
    </Flipper>
  );
}

function App() {
  return (
    <div className="main">
      <div className="header">
        Adam Gleave
      </div>
      <Canvas>
        <Scene />
      </Canvas>
      <div className="grid-container">
        <div className="grid">
          <Card headerText="OpenMW" url="https://i.ytimg.com/vi/izlm2CAnCpY/maxresdefault.jpg" />
          <Card headerText="OpenCK" url="https://imgur.com/Zfh3eDn.png" />
          <Card headerText="Rustbucket" url="https://i.imgur.com/xCYk9h7.png" />
          <Card headerText="Voxels" url="https://imgur.com/ucOoqnc.png" />
        </div>
      </div>
      <div>
        <div className="footer-container">
          <div className="footer">
            <a href="https://github.com/Adam-Gleave/" target="_blank" draggable={false}>
              <img src={process.env.PUBLIC_URL + "/images/GitHub-Mark-Light-32px.png"} draggable={false} />
            </a>
            <a href="mailto:adamgleave97@gmail.com" draggable={false}>
              <img src={process.env.PUBLIC_URL + "/images/mail-32.png"} draggable={false} />
            </a>
            <a href="https://www.linkedin.com/in/adam-gleave/" target="_blank" draggable={false}>
              <img src={process.env.PUBLIC_URL + "/images/linkedin-5-32.png"} draggable={false} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
