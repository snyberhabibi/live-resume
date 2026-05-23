"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";

const ROCK_COUNT = 80;

export function DesertRocks() {
  const groupRef = useRef<THREE.Group>(null);

  const rocks = useMemo(
    () =>
      Array.from({ length: ROCK_COUNT }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 80,
          -1.5 + Math.random() * 0.5,
          -Math.random() * 70,
        ] as [number, number, number],
        rotation: [
          Math.random() * 0.3,
          Math.random() * Math.PI * 2,
          Math.random() * 0.2,
        ] as [number, number, number],
        scale: (0.2 + Math.random() * 0.8) as number,
      })),
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      const { progress } = useScrollStore.getState();
      groupRef.current.position.z = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances limit={ROCK_COUNT} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#8b7355"
          roughness={0.95}
          metalness={0.05}
        />
        {rocks.map((rock, i) => (
          <Instance
            key={i}
            position={rock.position}
            rotation={rock.rotation}
            scale={rock.scale}
          />
        ))}
      </Instances>
    </group>
  );
}
