import React from 'react';
import * as THREE from 'three';

function Room() {
  const roomWidth = 8;
  const roomDepth = 8;
  const roomHeight = 3.5;
  const wallThickness = 0.2;

  return (
    <group>
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color="#8B7355" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh receiveShadow position={[0, roomHeight / 2, -roomDepth / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial 
          color="#F5F5DC" 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh receiveShadow position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, roomHeight, wallThickness]} />
        <meshStandardMaterial 
          color="#F5F5DC" 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, roomHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color="#FFFAF0" 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, roomHeight / 2, -roomDepth / 2 + wallThickness / 2]}>
        <boxGeometry args={[2.5, 1.8, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      <mesh position={[-1.3, roomHeight / 2, -roomDepth / 2 + wallThickness / 2]}>
        <boxGeometry args={[0.1, 1.8, 0.08]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[1.3, roomHeight / 2, -roomDepth / 2 + wallThickness / 2]}>
        <boxGeometry args={[0.1, 1.8, 0.08]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.6, -roomDepth / 2 + wallThickness / 2]}>
        <boxGeometry args={[2.7, 0.1, 0.08]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.8, -roomDepth / 2 + wallThickness / 2]}>
        <boxGeometry args={[2.7, 0.1, 0.08]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      <group position={[-2, 0.4, -3.8]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.4]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
        <mesh position={[-0.6, 0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.15]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0.6, 0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.15]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>

      <group position={[-2.5, 0, 3]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.5, 0.2, 0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.5, 0.2, 0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.5, 0.2, -0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.5, 0.2, -0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[2, 0, 3.5]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.4, 0.8]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 0.02, 0.7]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>

      <group position={[-3.5, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, 1, 0.8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.05, 0.15, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.1, 1.15, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#FF6347" emissive="#FF6347" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export default Room;
