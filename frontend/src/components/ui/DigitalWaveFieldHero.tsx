"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom shader for the wave points
const WavePoints = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const count = 4000;
  const sep = 0.2;
  const targetCursor = useRef(new THREE.Vector2(0, 0));

  const [positions, initialPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    let i = 0;
    
    // Grid size based on count (approx sqrt)
    const size = Math.sqrt(count);
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const xPos = (x - size / 2) * sep;
        const zPos = (z - size / 2) * sep;
        
        positions[i] = xPos;
        positions[i + 1] = 0;
        positions[i + 2] = zPos;
        
        initialPositions[i] = xPos;
        initialPositions[i + 1] = 0;
        initialPositions[i + 2] = zPos;
        
        i += 3;
      }
    }
    return [positions, initialPositions];
  }, [count, sep]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Smooth cursor follow
    targetCursor.current.lerp(
      new THREE.Vector2(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2
      ),
      0.05
    );

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = initialPositions[i3];
      const z = initialPositions[i3 + 2];
      
      // Calculate distance from cursor for wave effect
      const dx = x - targetCursor.current.x;
      const dz = z - targetCursor.current.y * 2; // Approximate z impact from mouse y
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Wave calculation: base wave + cursor pulse
      const wave = Math.sin(x * 1.5 + time * 1.2) * Math.cos(z * 1.5 + time * 0.8) * 0.3;
      const cursorPulse = Math.max(0, 2 - distance) * Math.sin(time * 5 - distance * 2) * 0.5;
      
      positions[i3 + 1] = wave + cursorPulse;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a78bfa" // violet-light
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export function DigitalWaveFieldHero() {
  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Background Three.js Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
          <fog attach="fog" args={["#050508", 5, 15]} />
          <ambientLight intensity={0.5} />
          <WavePoints />
        </Canvas>
      </div>

      {/* Decorative Orbs */}
      <div className="orb orb-violet w-[300px] h-[300px] top-1/4 left-1/4 mix-blend-screen opacity-50" />
      <div className="orb orb-cyan w-[400px] h-[400px] bottom-1/4 right-1/4 mix-blend-screen opacity-40" />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-glow bg-bg-surface/50 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-violet-light" />
          <span className="text-sm font-medium bg-gradient-to-r from-violet-light to-cyan bg-clip-text text-transparent">
            Introducing Nexus Vault 2.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-text-primary mb-6 drop-shadow-2xl"
        >
          Secure Your Digital{" "}
          <span className="gradient-text-violet">Frontier</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 font-medium leading-relaxed"
        >
          Experience the next generation of smart contract security. Enterprise-grade AI analysis meets military-grade encryption for your digital assets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 group text-base py-3 px-8">
            Start Auditing Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="w-full sm:w-auto glass-card flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-text-primary hover:bg-white/5 transition-colors">
            <Cpu className="w-4 h-4 text-cyan" />
            View Documentation
          </button>
        </motion.div>
        
        {/* Interactive Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
        >
          {[
            { label: "Assets Secured", value: "$4.2B+", icon: Shield, color: "text-green" },
            { label: "Smart Contracts", value: "12,450", icon: Cpu, color: "text-violet-light" },
            { label: "Threats Prevented", value: "8,992", icon: Sparkles, color: "text-cyan" },
          ].map((stat, i) => (
            <div key={i} className="glass-card glass-card-violet flex flex-col items-center justify-center p-6 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1 tracking-tight mono">{stat.value}</h3>
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="noise-bg mix-blend-overlay opacity-30" />
    </div>
  );
}
