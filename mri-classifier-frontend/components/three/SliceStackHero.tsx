"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Center } from "@react-three/drei";
import * as THREE from "three";

function Slices({ spacingMultiplier }: { spacingMultiplier: number }) {
  // Load the textures from our copied public files
  const textures = useTexture([
    "/mri-samples/notumor.jpg",
    "/mri-samples/glioma.jpg",
    "/mri-samples/meningioma.jpg",
    "/mri-samples/pituitary.jpg",
  ]);

  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotate the whole stack gently
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const sliceCount = 8;
  const planes = Array.from({ length: sliceCount });

  return (
    <group ref={groupRef}>
      {planes.map((_, index) => {
        // Map textures cyclically
        const texture = textures[index % textures.length];
        
        // As scroll occurs, spacing multiplier goes from 1.0 (stacked) to 4.5 (exploded)
        // Position along the Y axis
        const yPos = (index - (sliceCount - 1) / 2) * 0.25 * spacingMultiplier;
        
        // Highlight slice index 4 representing "model focus slice"
        const isFocused = index === 4;
        const color = isFocused ? "#2DD4BF" : "#94A3B8";
        const opacity = isFocused ? 0.95 : 0.45;

        return (
          <group key={index} position={[0, yPos, 0]}>
            {/* MRI slice plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.5, 2.5]} />
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={opacity}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Glowing borders for the focused slice */}
            {isFocused && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
                <ringGeometry args={[1.7, 1.73, 4]} />
                <meshBasicMaterial color="#2DD4BF" transparent opacity={0.8} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function SliceStackHero() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight || 800;
      const progress = Math.min(window.scrollY / heroHeight, 1.0);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Multiplier scales from 1.0 (when scrolled to top) to 4.5 (when scrolled past hero)
  const spacingMultiplier = 1.0 + scrollProgress * 3.5;

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[550px] relative">
      {/* 2D Fallback shown while canvas loads or if WebGL fails */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none select-none bg-surface/5">
        <span className="text-text-dim text-xs">Loading Volumetric Stack...</span>
      </div>

      <Canvas
        camera={{ position: [3.2, 2.5, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.85} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Center>
          <Slices spacingMultiplier={spacingMultiplier} />
        </Center>
      </Canvas>

      {/* Decorative interactive indicator overlay */}
      <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur border border-border-slate/50 px-3 py-1.5 rounded-lg text-[10px] text-text-muted select-none flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-teal-accent animate-pulse" />
        <span>Scroll down to expand slice layers</span>
      </div>
    </div>
  );
}
