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
  description: string,
  toggleFlipped: () => void,
  link: string,
};

const CardBack = (props: CardBackProps) => (
  <Flipped flipId="card">
    <div className="card" onClick={props.toggleFlipped}>
      <div className="card-header" style={{display: "absolute"}}>
        {props.headerText}
        <hr className="card-header-line" />
        <div className="card-text">
          {props.description}
        </div>
        <div className="card-link">
          <a href={props.link}>{props.link}</a>
        </div>
      </div>
    </div>
  </Flipped>
);

type CardProps = {
  headerText: string,
  description: string,
  url: string,
  link: string,
};

const Card = (cardProps: CardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [scale, setScale] = useState(1);

  const toggleFlipped = () => setFlipped(flipped => !flipped);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(1200px) rotateX(${flipped ? 180 : 0}deg) scale(${scale})`,
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
          <CardBack headerText={cardProps.headerText} toggleFlipped={toggleFlipped} description={cardProps.description} link={cardProps.link}/>
        </animated.div>
      ) : (
        <animated.div onMouseEnter={() => setScale(1.096)} onMouseLeave={() => setScale(1)} style={{ opacity: opacity.interpolate(o => opacityFunc(o)), transform }}>
          <CardFront {...makeProps(cardProps.headerText, cardProps.url, toggleFlipped)} />
        </animated.div>
      )}
    </Flipper>
  );
}

function App() {
  const openMwText = `OpenMW are working on bringing an open-source engine to The Elder Scrolls 3: Morrowind.
                      There have been multiple releases, and are readily available to download. 
                      As part of my contributions to this project, I have implemented various changes and
                      interface improvements to the Construction Set — the level editor and modding toolkit.`;
  
  const openCkText = `I am the current director of the OpenCK project. Closely affiliated with the modding
                      team \"Beyond Skyrim\", this project aims to create a more stable and user-friendly
                      level/mod editor for The Elder Scrolls 5: Skyrim. Progress is currently heavily ongoing.`;
  
  const rustbucketText = `Rustbucket is a tiny, hobby-project kernel written in Rust as an educational dive into
                          the language and operating system concepts. It is fully compatible with x86-64 hardware,
                          with the only non-Rust code being the bootstrapping assembler. Current features include
                          exception, fault, and interrupt handling, with the addition of a keyboard driver.
                          Future features may include memory and page management and a console system.`;
  
  const voxelsText = `Procedural generation and computer graphics have been long-standing interests of mine.
                      My most notable project in this area is a university submission consisting of an endless
                      procedural terrain generator. This runs on multiple threads for fast generation, and 
                      uses voxels and signed distance feels to represent the terrain volume. Surface extraction
                      was achieved through an implementation of the \"Dual Contouring\" algorithm.`;

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
          <Card headerText="OpenMW" url="https://i.ytimg.com/vi/izlm2CAnCpY/maxresdefault.jpg" description={openMwText} link="https://gitlab.com/OpenMW/openmw" />
          <Card headerText="OpenCK" url="https://imgur.com/Zfh3eDn.png" description={openCkText} link="https://github.com/Open-CK/OpenCK" />
          <Card headerText="Rustbucket" url="https://i.imgur.com/xCYk9h7.png" description={rustbucketText} link="https://github.com/Adam-Gleave/rustbucket" />
          <Card headerText="Voxels" url="https://imgur.com/ucOoqnc.png" description={voxelsText} link="https://github.com/Adam-Gleave/SOFT356" />
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
