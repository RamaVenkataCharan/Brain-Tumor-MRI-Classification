"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html } from "@react-three/drei";
import * as THREE from "three";

interface NodeInfo {
  name: string;
  detail: string;
  x: number;
  color: string;
}

const pipelineNodes: NodeInfo[] = [
  { name: "Input MRI", detail: "224x224x3", x: -3.5, color: "#1B2640" },
  { name: "Backbone", detail: "Feature Maps", x: -1.8, color: "#0D9488" },
  { name: "GAP Layer", detail: "Pooled Features", x: -0.1, color: "#2DD4BF" },
  { name: "Dense (128)", detail: "ReLU + Dropout", x: 1.6, color: "#0D9488" },
  { name: "Dense (4)", detail: "Logits Out", x: 3.3, color: "#1B2640" },
  { name: "Softmax", detail: "Probabilities", x: 4.8, color: "#2DD4BF" },
];

function Pipeline({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 15;
  const particleRefs = useRef<THREE.Mesh[]>([]);

  // Particles state: each has an offset/progress along the pipeline (0 to 1)
  const [particles, setParticles] = useState(() =>
    Array.from({ length: particleCount }).map((_, i) => ({
      progress: i / particleCount,
      speed: 0.18 + Math.random() * 0.05,
    }))
  );

  useFrame((state, delta) => {
    // Rotation of nodes for visual dynamism
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.1;
    }

    if (!isVisible) return;

    // Update particle positions
    setParticles((prev) =>
      prev.map((p) => {
        let newProgress = p.progress + p.speed * delta;
        if (newProgress > 1.0) {
          newProgress = 0.0;
        }
        return { ...p, progress: newProgress };
      })
    );
  });

  // Calculate the X coordinate of a particle based on its progress
  const getParticlePos = (progress: number): [number, number, number] => {
    const startX = pipelineNodes[0].x;
    const endX = pipelineNodes[pipelineNodes.length - 1].x;
    const currentX = startX + (endX - startX) * progress;
    // Add a slight sine wave in Y to make the flow look fluid
    const currentY = Math.sin(progress * Math.PI * 4) * 0.15;
    return [currentX, currentY, 0];
  };

  return (
    <group ref={groupRef}>
      {/* Node cubes */}
      {pipelineNodes.map((node, i) => (
        <group key={node.name} position={[node.x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial
              color={node.color}
              metalness={0.2}
              roughness={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Glowing wireframe overlay */}
          <mesh>
            <boxGeometry args={[0.92, 0.92, 0.92]} />
            <meshBasicMaterial color="#5EEAD4" wireframe transparent opacity={0.15} />
          </mesh>

          {/* HTML Overlay Labels */}
          <Html position={[0, -0.8, 0]} center className="pointer-events-none select-none">
            <div className="bg-bg-deep/90 border border-border-slate/60 text-center rounded px-2.5 py-1 min-w-[90px] whitespace-nowrap shadow-md">
              <p className="text-[10px] font-bold text-text-primary font-heading tracking-tight">{node.name}</p>
              <p className="text-[8px] text-text-dim mt-0.5">{node.detail}</p>
            </div>
          </Html>
        </group>
      ))}

      {/* Connecting pipeline tube */}
      <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 9.2, 8]} />
        <meshBasicMaterial color="#1E293B" transparent opacity={0.5} />
      </mesh>

      {/* Flowing particles */}
      {isVisible &&
        particles.map((p, i) => {
          const pos = getParticlePos(p.progress);
          return (
            <mesh key={`part-${i}`} position={pos}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#2DD4BF" />
            </mesh>
          );
        })}
    </group>
  );
}

export default function PipelineFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] relative">
      <Canvas camera={{ position: [0, 1.2, 6.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <Center>
          <Pipeline isVisible={isVisible} />
        </Center>
      </Canvas>
    </div>
  );
}
