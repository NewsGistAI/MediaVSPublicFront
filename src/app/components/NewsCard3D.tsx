import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

interface NewsCard3DProps {
  title: string;
  titleZh: string;
  category: string;
  position: [number, number, number];
  mouse: { x: number; y: number };
  onEnter: () => void;
}

export default function NewsCard3D({ title, titleZh, category, position, mouse, onEnter }: NewsCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const glowIntensity = useRef(0);

  const { viewport } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    // Mouse world position approximation
    const mouseWorldX = mouse.x * (viewport.width / 2);
    const mouseWorldY = mouse.y * (viewport.height / 2);

    // Distance from mouse to card center
    const dx = mouseWorldX - position[0];
    const dy = mouseWorldY - position[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Flip when mouse is close
    const shouldFlip = dist < 3.5;
    if (shouldFlip !== isFlipped) {
      setIsFlipped(shouldFlip);
    }

    // Smooth rotation
    targetRotation.current = isFlipped ? Math.PI : 0;
    currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, targetRotation.current, 0.06);
    groupRef.current.rotation.y = currentRotation.current;

    // Glow intensity
    const targetGlow = shouldFlip ? 1 : hovered ? 0.5 : 0;
    glowIntensity.current = THREE.MathUtils.lerp(glowIntensity.current, targetGlow, 0.08);
  });

  const categoryColors: Record<string, string> = {
    Technology: '#6366f1',
    Business: '#f59e0b',
    Environment: '#10b981',
    Culture: '#ec4899',
    Politics: '#ef4444',
    Health: '#06b6d4',
    Society: '#8b5cf6',
    History: '#d97706',
  };

  const catColor = categoryColors[category] || '#6366f1';

  return (
    <Float
      speed={2}
      rotationIntensity={0.15}
      floatIntensity={0.6}
      floatingRange={[-0.3, 0.3]}
    >
      <group
        ref={groupRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onEnter}
      >
        {/* Card body - front */}
        <mesh castShadow>
          <boxGeometry args={[4, 2.6, 0.08]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.05}
            emissive="#4466aa"
            emissiveIntensity={hovered ? 0.15 : 0.03}
          />
        </mesh>

        {/* Glow plane */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[4.4, 3.0]} />
          <meshBasicMaterial
            color={catColor}
            transparent
            opacity={hovered || isFlipped ? 0.15 : 0}
          />
        </mesh>

        {/* Front face - The Media */}
        <Html
          position={[0, 0, 0.05]}
          transform
          occlude
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              width: '320px',
              padding: '20px 24px',
              fontFamily: 'IBM Plex Sans, sans-serif',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: catColor,
              marginBottom: '10px',
            }}>
              {category}
            </div>
            <div style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#1e3a5f',
              lineHeight: 1.3,
              marginBottom: '6px',
            }}>
              {title}
            </div>
            <div style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: '13px',
              color: '#c84b31',
              marginBottom: '12px',
            }}>
              {titleZh}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#1e3a5f',
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              width: 'fit-content',
            }}>
              <span style={{ fontSize: '14px' }}>📰</span>
              The Media
              <span style={{ opacity: 0.6, fontSize: '10px' }}>媒体观点</span>
            </div>
          </div>
        </Html>

        {/* Back face - The Public */}
        <Html
          position={[0, 0, -0.05]}
          transform
          occlude
          distanceFactor={6}
          rotation={[0, Math.PI, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              width: '320px',
              padding: '20px 24px',
              fontFamily: 'IBM Plex Sans, sans-serif',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: catColor,
              marginBottom: '10px',
            }}>
              {category}
            </div>
            <div style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#1e3a5f',
              lineHeight: 1.3,
              marginBottom: '6px',
            }}>
              {title}
            </div>
            <div style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: '13px',
              color: '#c84b31',
              marginBottom: '12px',
            }}>
              {titleZh}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#2a9d8f',
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              width: 'fit-content',
            }}>
              <span style={{ fontSize: '14px' }}>👥</span>
              The Public
              <span style={{ opacity: 0.6, fontSize: '10px' }}>公众观点</span>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}
