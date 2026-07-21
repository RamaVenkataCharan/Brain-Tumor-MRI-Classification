"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html } from "@react-three/drei";
import * as THREE from "three";
import { paperResults } from "@/lib/modelResults";

interface BarChartProps {
  activeModel: string;
  onSelectModel: (name: string) => void;
  isVisible: boolean;
}

function Bars({ activeModel, onSelectModel, isVisible }: BarChartProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Track animation progress of height growth (0 to 1)
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s growth

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1.0 ? 1.0 : 1.0 - Math.pow(2, -10 * progress);
      setAnimationProgress(ease);

      if (progress < 1.0) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible]);

  // Continuous auto-rotation of chart
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.25;
    }
  });

  const barSpacing = 1.0;
  const startX = -((paperResults.length - 1) * barSpacing) / 2;

  return (
    <group ref={groupRef}>
      {/* Grid Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[7, 4]} />
        <meshBasicMaterial color="#131C2E" transparent opacity={0.3} />
      </mesh>

      {paperResults.map((model, index) => {
        const xPos = startX + index * barSpacing;
        
        // Map accuracy 96.5% - 99.12% to height range 0.8 - 2.5
        const baseline = 0.95;
        const normalizedVal = Math.max(0.1, model.accuracy - baseline) / (0.9922 - baseline);
        const maxHeight = 0.5 + normalizedVal * 1.8;
        const height = maxHeight * animationProgress;

        const isSelected = model.name === activeModel;
        const barColor = isSelected ? "#2DD4BF" : "#0D9488";
        const emissiveColor = isSelected ? "#5EEAD4" : "#052e2b";

        return (
          <group key={model.name} position={[xPos, 0, 0]}>
            {/* 3D Bar Mesh */}
            <mesh
              position={[0, height / 2, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectModel(model.name);
              }}
            >
              <boxGeometry args={[0.6, height, 0.6]} />
              <meshStandardMaterial
                color={barColor}
                emissive={emissiveColor}
                emissiveIntensity={isSelected ? 0.6 : 0.2}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing active wireframe border */}
            {isSelected && (
              <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.62, height + 0.02, 0.62]} />
                <meshBasicMaterial color="#5EEAD4" wireframe transparent opacity={0.3} />
              </mesh>
            )}

            {/* Label at base */}
            <Html position={[0, -0.3, 0]} center className="pointer-events-none select-none">
              <div className="text-center font-heading whitespace-nowrap">
                <span className={`text-[8px] font-bold block ${isSelected ? "text-teal-accent" : "text-text-dim"}`}>
                  {model.name}
                </span>
                <span className={`text-[9px] font-extrabold ${isSelected ? "text-teal-light" : "text-text-muted"}`}>
                  {(model.accuracy * 100).toFixed(1)}%
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function ResultsBarChart3D({
  activeModel,
  onSelectModel,
}: Omit<BarChartProps, "isVisible">) {
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
      <Canvas camera={{ position: [0, 1.8, 5.0], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.65} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Center>
          <Bars activeModel={activeModel} onSelectModel={onSelectModel} isVisible={isVisible} />
        </Center>
      </Canvas>
    </div>
  );
}
