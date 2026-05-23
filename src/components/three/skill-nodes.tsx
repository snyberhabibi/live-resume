"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/data/resume";
import { useModeStore } from "@/store/mode";

const categoryColors: Record<string, string> = {
  engineering: "#22d3ee",
  ai: "#a78bfa",
  product: "#f472b6",
  ops: "#34d399",
  leadership: "#fbbf24",
};

const recruiterColors: Record<string, string> = {
  engineering: "#6366f1",
  ai: "#8b5cf6",
  product: "#ec4899",
  ops: "#10b981",
  leadership: "#f59e0b",
};

export function SkillNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const mode = useModeStore((s) => s.mode);
  const isRecruiter = mode === "recruiter";
  const colors = isRecruiter ? recruiterColors : categoryColors;

  // Distribute nodes in a sphere
  const positions = useMemo(() => {
    const golden = (1 + Math.sqrt(5)) / 2;
    return skills.map((_, i) => {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / skills.length);
      const r = 2.8;
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) - 0.5,
        r * Math.cos(phi)
      );
    });
  }, []);

  // Connection lines between nodes in the same category
  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3, string][] = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        if (skills[i].category === skills[j].category) {
          lines.push([positions[i], positions[j], colors[skills[i].category]]);
        }
      }
    }
    return lines;
  }, [positions, colors]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {connections.map(([start, end, color], i) => (
        <Line
          key={`line-${i}`}
          points={[start, end]}
          color={color}
          lineWidth={0.5}
          opacity={0.15}
          transparent
        />
      ))}

      {/* Skill spheres */}
      {skills.map((skill, i) => (
        <SkillOrb
          key={skill.name}
          position={positions[i]}
          color={colors[skill.category]}
          size={0.15 + skill.level * 0.2}
          speed={1 + i * 0.1}
          distort={isRecruiter ? 0.2 : 0.4}
        />
      ))}

      {/* Central core */}
      <Sphere args={[0.35, 64, 64]} position={[0, -0.5, 0]}>
        <MeshDistortMaterial
          color={isRecruiter ? "#6366f1" : "#22d3ee"}
          emissive={isRecruiter ? "#6366f1" : "#22d3ee"}
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </group>
  );
}

function SkillOrb({
  position,
  color,
  size,
  speed,
  distort,
}: {
  position: THREE.Vector3;
  color: string;
  size: number;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.001;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.6}
        distort={distort}
        speed={speed}
        transparent
        opacity={0.85}
      />
    </Sphere>
  );
}
