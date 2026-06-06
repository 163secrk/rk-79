import React, { forwardRef } from 'react';
import * as THREE from 'three';

const CeilingLight = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  const brightness = state.brightness || 80;
  const color = state.color || '#ffffff';
  
  const lightIntensity = isOn ? (brightness / 100) * 2 : 0;
  const emissiveIntensity = isOn ? (brightness / 100) * 0.8 : 0;

  return (
    <group>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.15, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.1, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>

      {isOn && (
        <pointLight 
          position={[0, -0.3, 0]} 
          color={color}
          intensity={lightIntensity}
          distance={8}
          decay={2}
          castShadow
        />
      )}

      {showHighlight && (
        <mesh position={[0, -0.2, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.5 : 0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const Lamp = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  const brightness = state.brightness || 80;
  const color = state.color || '#ffd700';
  
  const lightIntensity = isOn ? (brightness / 100) * 1.5 : 0;
  const emissiveIntensity = isOn ? (brightness / 100) * 0.8 : 0;

  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 0.4, 32, 1, true]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[0, 1.45, 0]} castShadow>
        <ringGeometry args={[0.02, 0.2, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.5} />
      </mesh>
      
      {isOn && (
        <pointLight 
          position={[0, 1.15, 0]} 
          color={color}
          intensity={lightIntensity}
          distance={6}
          decay={2}
          castShadow
        />
      )}

      {showHighlight && (
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.5 : 0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const AirConditioner = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  const mode = state.mode || 'cool';
  
  const displayColor = mode === 'cool' ? '#87ceeb' : '#ff6b6b';

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.2]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.3} roughness={0.4} />
      </mesh>
      
      <mesh position={[0, -0.12, 0.11]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.02]} />
        <meshStandardMaterial 
          color={isOn ? displayColor : '#888888'}
          emissive={isOn ? displayColor : '#000000'}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </mesh>
      
      <mesh position={[-0.4, 0, -0.05]} castShadow>
        <boxGeometry args={[0.05, 0.25, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {isOn && (
        <group position={[0, -0.3, 0.15]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[(i - 2) * 0.2, 0, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.5]} />
              <meshStandardMaterial 
                color={displayColor}
                emissive={displayColor}
                emissiveIntensity={0.8}
                transparent
                opacity={0.5 + Math.random() * 0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {showHighlight && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.3, 0.45, 0.3]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.15 : 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

const TV = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  
  const screenColor = isOn ? '#1a1a2e' : '#0a0a0a';

  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 1, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.4, 0.05]} castShadow>
        <boxGeometry args={[1.7, 0.9, 0.02]} />
        <meshStandardMaterial 
          color={screenColor}
          emissive={isOn ? '#2a4a6a' : '#000000'}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </mesh>
      
      {isOn && (
        <>
          <mesh position={[0, 0.4, 0.06]}>
            <boxGeometry args={[1.5, 0.7, 0.01]} />
            <meshStandardMaterial 
              color="#4a90a4"
              emissive="#4a90a4"
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[0, 0.5, 0.06]}>
            <boxGeometry args={[1.2, 0.1, 0.01]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.8}
            />
          </mesh>
        </>
      )}
      
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, -0.32, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.3} />
      </mesh>

      {showHighlight && (
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.9, 1.1, 0.15]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.15 : 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

const Speaker = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  const volume = state.volume || 60;
  
  const pulseIntensity = isOn ? (volume / 100) * 0.5 : 0;

  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.3, 0.5, 0.25]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.3} roughness={0.6} />
      </mesh>
      
      <mesh position={[0, 0.35, 0.13]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          emissive={isOn ? '#4488ff' : '#000000'}
          emissiveIntensity={pulseIntensity}
        />
      </mesh>
      
      <mesh position={[0, 0.1, 0.13]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          emissive={isOn ? '#4488ff' : '#000000'}
          emissiveIntensity={pulseIntensity * 0.7}
        />
      </mesh>
      
      {isOn && (
        <group position={[0, 0.25, 0.2]}>
          {[...Array(3)].map((_, i) => (
            <mesh key={i} position={[0, (i - 1) * 0.08, i * 0.05]}>
              <torusGeometry args={[0.08 + i * 0.04, 0.01, 8, 16]} />
              <meshStandardMaterial 
                color="#4488ff"
                emissive="#4488ff"
                emissiveIntensity={0.6 - i * 0.15}
                transparent
                opacity={0.5 - i * 0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {showHighlight && (
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.35]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.15 : 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

const Fridge = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;

  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.8, 1.8, 0.7]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[0, 1.4, 0.36]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#d0d0d0" 
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      
      <mesh position={[0, 0.5, 0.36]} castShadow>
        <boxGeometry args={[0.7, 0.85, 0.05]} />
        <meshStandardMaterial 
          color="#d0d0d0" 
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      
      <mesh position={[0.25, 1.4, 0.39]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.03]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      <mesh position={[0.25, 0.5, 0.39]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.03]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      <mesh position={[-0.25, 1.6, 0.39]}>
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial 
          color={isOn ? '#43e97b' : '#888888'}
          emissive={isOn ? '#43e97b' : '#000000'}
          emissiveIntensity={isOn ? 0.5 : 0}
        />
      </mesh>
      
      {showHighlight && (
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.9, 1.9, 0.8]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.15 : 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

const Curtain = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  const openPercent = state.openPercent !== undefined ? state.openPercent : 50;
  const curtainWidth = 0.6 * (1 - openPercent / 100);

  return (
    <group>
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[-0.375 + curtainWidth/2, 0.9, 0]} castShadow>
        <boxGeometry args={[curtainWidth, 1.8, 0.05]} />
        <meshStandardMaterial 
          color="#DEB887" 
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[0.375 - curtainWidth/2, 0.9, 0]} castShadow>
        <boxGeometry args={[curtainWidth, 1.8, 0.05]} />
        <meshStandardMaterial 
          color="#DEB887" 
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {isOn && (
        <mesh position={[0, 0.9, -0.05]}>
          <boxGeometry args={[1.4, 1.7, 0.02]} />
          <meshStandardMaterial 
            color="#87CEEB" 
            emissive="#87CEEB"
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {showHighlight && (
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1.6, 2, 0.2]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.15 : 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

const Camera = ({ state, isSelected, isHovered, isInGroup, highlightColor, showHighlight }) => {
  const isOn = state.on;
  const recording = state.recording || false;

  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.25, 0.12]} castShadow>
        <sphereGeometry args={[0.08, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          emissive={isOn ? '#ff4444' : '#000000'}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </mesh>
      
      <mesh position={[0, 0.25, 0.18]} castShadow>
        <circleGeometry args={[0.04, 32]} />
        <meshStandardMaterial 
          color="#333333"
          emissive={isOn ? '#66aaff' : '#000000'}
          emissiveIntensity={isOn ? 0.5 : 0}
        />
      </mesh>
      
      {recording && (
        <mesh position={[0.08, 0.32, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial 
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {showHighlight && (
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.4, 16]} />
          <meshBasicMaterial 
            color={highlightColor} 
            transparent 
            opacity={isInGroup && !isSelected && !isHovered ? 0.15 : 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

const DeviceModel = forwardRef(({ device, onClick, onPointerOver, onPointerOut, isSelected, isHovered, isInGroup, groupColor }, ref) => {
  const { position, rotation, type, state } = device;

  const highlightColor = isSelected ? '#667eea' : (isInGroup ? groupColor : '#764ba2');
  const showHighlight = isSelected || isHovered || isInGroup;

  const renderDevice = () => {
    switch (type) {
      case 'light':
        return <CeilingLight state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'lamp':
        return <Lamp state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'ac':
        return <AirConditioner state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'tv':
        return <TV state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'speaker':
        return <Speaker state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'camera':
        return <Camera state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'fridge':
        return <Fridge state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      case 'curtain':
        return <Curtain state={state} isSelected={isSelected} isHovered={isHovered} isInGroup={isInGroup} highlightColor={highlightColor} showHighlight={showHighlight} />;
      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={ref}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {renderDevice()}
    </group>
  );
});

DeviceModel.displayName = 'DeviceModel';

export default DeviceModel;
