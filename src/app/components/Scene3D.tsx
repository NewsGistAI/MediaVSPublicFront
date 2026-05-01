import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  mouse: { x: number; y: number };
}

/** Low-poly terrain ground */
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 64, 64);
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // gentle hills
      const z =
        Math.sin(x * 0.08) * 1.8 +
        Math.cos(y * 0.06) * 2.2 +
        Math.sin(x * 0.15 + y * 0.1) * 0.8 +
        Math.random() * 0.3;
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} receiveShadow>
      <meshStandardMaterial
        color="#5a9e6f"
        flatShading
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}

/** Decorative low-poly trees */
function Tree({ position }: { position: [number, number, number] }) {
  const scale = 0.5 + Math.random() * 0.5;
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 2, 6]} />
        <meshStandardMaterial color="#8B6914" flatShading />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1.2, 2.5, 6]} />
        <meshStandardMaterial color="#2d7a45" flatShading />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[0.9, 2, 6]} />
        <meshStandardMaterial color="#38915a" flatShading />
      </mesh>
    </group>
  );
}

/** Animated water plane */
function Water() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = -5.5 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[25, -5.5, -10]}>
      <circleGeometry args={[15, 32]} />
      <meshStandardMaterial
        color="#4db8c7"
        transparent
        opacity={0.6}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
}

/** Mouse-following point light */
function MouseLight({ mouse }: { mouse: { x: number; y: number } }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, mouse.x * 15, 0.05);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, 4 + mouse.y * 3, 0.05);
      lightRef.current.position.z = THREE.MathUtils.lerp(lightRef.current.position.z, 8 + mouse.y * 2, 0.05);
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 4, 8]}
        intensity={80}
        color="#ffeedd"
        distance={40}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </>
  );
}

/** Camera parallax driven by mouse */
function CameraRig({ mouse }: { mouse: { x: number; y: number } }) {
  useFrame(({ camera }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 3, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3 + mouse.y * 1.5, 0.02);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D({ mouse }: Scene3DProps) {
  const treePositions: [number, number, number][] = useMemo(() => [
    [-18, -4.5, -15], [-12, -4.8, -20], [-25, -4.3, -10],
    [15, -4.6, -18], [22, -4.4, -12], [28, -4.7, -22],
    [-8, -4.9, -28], [8, -4.5, -25], [-30, -4.6, -18],
    [35, -4.5, -15], [-20, -4.4, -30], [18, -4.8, -30],
    [-15, -4.3, -8], [30, -4.6, -8], [0, -4.7, -32],
  ], []);

  return (
    <>
      {/* Sky color */}
      <color attach="background" args={['#1a1a3e']} />
      <fog attach="fog" args={['#1a1a3e', 30, 80]} />

      {/* Ambient & directional lights */}
      <ambientLight intensity={0.3} color="#8090c0" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        color="#ffd4a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Mouse-following light */}
      <MouseLight mouse={mouse} />

      {/* Camera parallax */}
      <CameraRig mouse={mouse} />

      {/* Stars */}
      <Stars radius={60} depth={50} count={1500} factor={3} fade speed={0.5} />

      {/* Clouds */}
      <Cloud position={[-15, 12, -30]} speed={0.2} opacity={0.4} width={15} depth={3} segments={12} />
      <Cloud position={[20, 14, -35]} speed={0.15} opacity={0.3} width={20} depth={4} segments={10} />
      <Cloud position={[0, 16, -40]} speed={0.1} opacity={0.35} width={18} depth={3} segments={8} />

      {/* Terrain */}
      <Terrain />

      {/* Water */}
      <Water />

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
    </>
  );
}
