import React from 'react';
import * as THREE from 'three';

const roomStyles = {
  living: {
    floorColor: '#8B7355',
    wallColor: '#F5F5DC',
    ceilingColor: '#FFFAF0',
    accentColor: '#667eea'
  },
  bedroom: {
    floorColor: '#A0522D',
    wallColor: '#E6E6FA',
    ceilingColor: '#FFF0F5',
    accentColor: '#f093fb'
  },
  kitchen: {
    floorColor: '#696969',
    wallColor: '#F0FFFF',
    ceilingColor: '#F5FFFA',
    accentColor: '#43e97b'
  },
  bathroom: {
    floorColor: '#708090',
    wallColor: '#E0FFFF',
    ceilingColor: '#F0FFFF',
    accentColor: '#4facfe'
  },
  study: {
    floorColor: '#8B4513',
    wallColor: '#FFF8DC',
    ceilingColor: '#FFFAF0',
    accentColor: '#a18cd1'
  },
  dining: {
    floorColor: '#D2691E',
    wallColor: '#FAEBD7',
    ceilingColor: '#FFFAF0',
    accentColor: '#fa709a'
  },
  office: {
    floorColor: '#4A4A4A',
    wallColor: '#F0F8FF',
    ceilingColor: '#F8F8FF',
    accentColor: '#667eea'
  },
  other: {
    floorColor: '#8B7355',
    wallColor: '#F5F5DC',
    ceilingColor: '#FFFAF0',
    accentColor: '#667eea'
  }
};

function LivingRoomFurniture() {
  return (
    <group>
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

      <group position={[0, 0, 2.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 0.8, 1.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[2.8, 0.1, 1]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
      </group>
    </group>
  );
}

function BedroomFurniture() {
  return (
    <group>
      <group position={[0, 0, -2.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2.2, 0.6, 2.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[2, 0.2, 2.3]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[0, 0.9, -1.1]} castShadow>
          <boxGeometry args={[2, 0.8, 0.1]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      </group>

      <group position={[-2, 0.6, -2]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.45]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
      </group>

      <group position={[2, 0.6, -2]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.45]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
      </group>

      <group position={[-3, 0, 1.5]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.6, 2, 1.5]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.7, 0.4, 1.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 1, -0.6]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.1]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        <mesh position={[0, 1.5, -0.6]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.1]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
      </group>

      <group position={[2.5, 0, 1]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.6]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.15, 0.05, 0.55]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.45, 0.25, 0.28]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.45, 0.25, 0.28]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.45, 0.25, -0.28]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.45, 0.25, -0.28]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
    </group>
  );
}

function KitchenFurniture() {
  return (
    <group>
      <group position={[0, 0, -3.5]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[6, 0.9, 0.6]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[5.9, 0.05, 0.58]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
      </group>

      <group position={[-3, 0, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.6, 2, 3]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
        <mesh position={[0, 0.5, -1]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.8]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        <mesh position={[0, 1.2, -1]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.8]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      </group>

      <group position={[3, 0, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.6, 0.9, 2]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.58, 0.05, 1.9]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        <mesh position={[0, 0.8, -0.5]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.5]} />
          <meshStandardMaterial color="#4682B4" />
        </mesh>
      </group>

      <group position={[0, 0, 1.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.8, 1.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.9, 0.05, 1.15]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        <mesh position={[-0.85, 0.25, 0.55]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.85, 0.25, 0.55]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.85, 0.25, -0.55]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.85, 0.25, -0.55]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[-1, 0.8, -3.4]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.15, 0.4]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        <mesh position={[0, 0.12, -0.15]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.15]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
      </group>
    </group>
  );
}

function BathroomFurniture() {
  return (
    <group>
      <group position={[-2.5, 0, -3]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.6]} />
          <meshStandardMaterial color="#E8E8E8" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.15, 0.1, 0.55]} />
          <meshStandardMaterial color="#DCDCDC" />
        </mesh>
        <mesh position={[0, 1, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.15, 0.3]} />
          <meshStandardMaterial color="#B0C4DE" />
        </mesh>
        <mesh position={[0, 1.3, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      </group>

      <group position={[2.5, 0, -3]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.4, 32]} />
          <meshStandardMaterial color="#F5F5F5" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.6]} />
          <meshStandardMaterial color="#F5F5F5" />
        </mesh>
        <mesh position={[0, 0.7, 0.25]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#F5F5F5" />
        </mesh>
      </group>

      <group position={[0, 0, 3]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[2, 0.2, 1.5]} />
          <meshStandardMaterial color="#E8E8E8" />
        </mesh>
        <mesh position={[0, 0.8, 0.6]} castShadow>
          <boxGeometry args={[1.9, 1.2, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
        </mesh>
        <mesh position={[-0.9, 0.7, 0]} castShadow>
          <boxGeometry args={[0.05, 1.4, 1.5]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        <mesh position={[0.9, 0.7, 0]} castShadow>
          <boxGeometry args={[0.05, 1.4, 1.5]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[2, 0.05, 1.5]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      </group>

      <group position={[-3, 1.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.15]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
        <mesh position={[0, 0.3, 0.08]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.1]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        <mesh position={[0, -0.3, 0.08]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.1]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      </group>
    </group>
  );
}

function StudyFurniture() {
  return (
    <group>
      <group position={[0, 0, -3]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2.5, 0.8, 0.8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[2.45, 0.05, 0.75]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        <mesh position={[-1.15, 0.25, 0.35]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[1.15, 0.25, 0.35]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-1.15, 0.25, -0.35]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[1.15, 0.25, -0.35]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[0, 0.5, -2.5]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        <mesh position={[0, 0.2, 0.15]} castShadow>
          <boxGeometry args={[0.55, 0.35, 0.05]} />
          <meshStandardMaterial color="#191970" emissive="#191970" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.6, 0.3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0.6, 0.3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>

      <group position={[-3.5, 0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.5, 2.4, 2.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.5, -0.8]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0, 1.3, -0.8]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0, 2.1, -0.8]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      </group>

      <group position={[2, 0, 2]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.75, 0.05, 0.75]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.7]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[-0.3, 1.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.7]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.3, 1.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.7]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.7]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    </group>
  );
}

function DiningFurniture() {
  return (
    <group>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[0, 0.45, 1.2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[-0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[1.2, 0.45, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[-0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[-1.2, 0.45, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[-0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[0, 0.45, -1.2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        <mesh position={[-0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.05, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[-3, 0, 2]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 0.5]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.45, 0.05, 0.45]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>

      <group position={[3, 0, -2]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.5, 2, 1.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.5, -0.4]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.6]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        <mesh position={[0, 1.3, -0.4]} castShadow>
          <boxGeometry args={[0.45, 0.05, 0.6]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      </group>
    </group>
  );
}

function OfficeFurniture() {
  return (
    <group>
      <group position={[0, 0, -3]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 0.8, 0.8]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[2.95, 0.05, 0.75]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>

      <group position={[-1, 0.5, -2.5]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        <mesh position={[0, 0.2, 0.15]} castShadow>
          <boxGeometry args={[0.55, 0.35, 0.05]} />
          <meshStandardMaterial color="#191970" emissive="#191970" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <group position={[1, 0.5, -2.5]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.3, 0.4]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 0.2, 0.15]} castShadow>
          <boxGeometry args={[0.35, 0.2, 0.05]} />
          <meshStandardMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <group position={[0, 0.5, -2.8]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.2]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
        <mesh position={[0, 0.2, 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
      </group>

      <group position={[-3.5, 0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.6, 2.4, 2.5]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 0.5, -0.8]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.8]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        <mesh position={[0, 1.3, -0.8]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.8]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        <mesh position={[0, 2.1, -0.8]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.8]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      </group>

      <group position={[-1.5, 0, 1.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.6]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.55, 0.05, 0.55]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[-0.2, 1.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.5]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0.2, 1.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.5]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>

      <group position={[2, 0, 2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1, 0.6]} />
          <meshStandardMaterial color="#556B2F" />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.15, 0.05, 0.55]} />
          <meshStandardMaterial color="#6B8E23" />
        </mesh>
        <mesh position={[-0.5, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[-0.5, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.15]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>

      <group position={[0, 0.4, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.6]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
        <mesh position={[-0.25, 0.05, -0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0.25, 0.05, -0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[-0.25, 0.05, 0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0.25, 0.05, 0.25]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <meshStandardMaterial color="#333333" />
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>
    </group>
  );
}

function DefaultFurniture() {
  return (
    <group>
      <group position={[-2, 0.4, -3.8]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.4]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
      </group>

      <group position={[2, 0, 3.5]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.4, 0.8]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
      </group>
    </group>
  );
}

function Room({ room }) {
  const roomType = room?.roomType || 'other';
  const styles = roomStyles[roomType] || roomStyles.other;
  const customColor = room?.color || styles.accentColor;

  const roomWidth = 8;
  const roomDepth = 8;
  const roomHeight = 3.5;
  const wallThickness = 0.2;

  const renderFurniture = () => {
    switch (roomType) {
      case 'living':
        return <LivingRoomFurniture />;
      case 'bedroom':
        return <BedroomFurniture />;
      case 'kitchen':
        return <KitchenFurniture />;
      case 'bathroom':
        return <BathroomFurniture />;
      case 'study':
        return <StudyFurniture />;
      case 'dining':
        return <DiningFurniture />;
      case 'office':
        return <OfficeFurniture />;
      default:
        return <DefaultFurniture />;
    }
  };

  return (
    <group>
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color={styles.floorColor} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh receiveShadow position={[0, roomHeight / 2, -roomDepth / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial 
          color={styles.wallColor} 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh receiveShadow position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, roomHeight, wallThickness]} />
        <meshStandardMaterial 
          color={styles.wallColor} 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, roomHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color={styles.ceilingColor} 
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

      {renderFurniture()}

      <mesh position={[-3.5, 1.1, -3.5]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial 
          color={customColor} 
          emissive={customColor} 
          emissiveIntensity={0.5} 
        />
      </mesh>
    </group>
  );
}

export default Room;
