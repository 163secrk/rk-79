import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid } from '@react-three/drei';
import Room from './Room';
import DeviceModel from './DeviceModel';

function CameraController({ targetPosition }) {
  const { camera } = useThree();
  useEffect(() => {
    if (targetPosition) {
      camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
    }
  }, [targetPosition, camera]);
  return null;
}

function SceneContent({ 
  devices, 
  selectedDevice, 
  selectedGroup,
  onDeviceMove, 
  onDeviceSelect,
  onGroupSelect,
  transformMode,
  setTransformMode,
  currentRoom
}) {
  const transformRef = useRef();
  const meshRefs = useRef({});
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (selectedDevice && transformRef.current && meshRefs.current[selectedDevice.id]) {
      transformRef.current.attach(meshRefs.current[selectedDevice.id]);
    }
  }, [selectedDevice]);

  const isInSelectedGroup = (deviceId) => {
    if (!selectedGroup) return false;
    return selectedGroup.deviceIds?.includes(deviceId);
  };

  const getGroupHighlightColor = () => {
    return selectedGroup?.color || '#667eea';
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'g':
          setTransformMode('translate');
          break;
        case 'r':
          setTransformMode('rotate');
          break;
        case 's':
          setTransformMode('scale');
          break;
        case 'escape':
          onDeviceSelect(null);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setTransformMode, onDeviceSelect]);

  const handleTransformChange = () => {
    if (selectedDevice && meshRefs.current[selectedDevice.id]) {
      const mesh = meshRefs.current[selectedDevice.id];
      const position = {
        x: parseFloat(mesh.position.x.toFixed(2)),
        y: parseFloat(mesh.position.y.toFixed(2)),
        z: parseFloat(mesh.position.z.toFixed(2))
      };
      const rotation = {
        x: parseFloat(mesh.rotation.x.toFixed(2)),
        y: parseFloat(mesh.rotation.y.toFixed(2)),
        z: parseFloat(mesh.rotation.z.toFixed(2))
      };
      onDeviceMove(selectedDevice.id, position, rotation);
    }
  };

  const handleDeviceClick = (device, e) => {
    e.stopPropagation();
    onDeviceSelect(device);
  };

  return (
    <>
      <CameraController />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      <Room room={currentRoom} />

      <Grid 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#6f6f6f" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#9d4b4b" 
        fadeDistance={30} 
        fadeStrength={1} 
        followCamera={false} 
        infiniteGrid 
        receiveShadow
      />

      {devices.map((device) => (
        <group key={device.id}>
          <DeviceModel
            ref={(el) => (meshRefs.current[device.id] = el)}
            device={device}
            onClick={(e) => handleDeviceClick(device, e)}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(device.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredId(null);
              document.body.style.cursor = 'auto';
            }}
            isSelected={selectedDevice?.id === device.id}
            isHovered={hoveredId === device.id}
            isInGroup={isInSelectedGroup(device.id)}
            groupColor={getGroupHighlightColor()}
          />
        </group>
      ))}

      {selectedDevice && (
        <TransformControls
          ref={transformRef}
          mode={transformMode}
          onMouseUp={handleTransformChange}
          onObjectChange={handleTransformChange}
          size={0.8}
        />
      )}

      <OrbitControls
        makeDefault
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function Scene3D({ devices, selectedDevice, selectedGroup, onDeviceMove, onDeviceSelect, onGroupSelect, currentRoom }) {
  const [transformMode, setTransformMode] = useState('translate');

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [6, 5, 6], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)' }}
        gl={{ antialias: true }}
      >
        <fog attach="fog" args={['#1a1a2e', 10, 30]} />
        <SceneContent
          devices={devices}
          selectedDevice={selectedDevice}
          selectedGroup={selectedGroup}
          onDeviceMove={onDeviceMove}
          onDeviceSelect={onDeviceSelect}
          onGroupSelect={onGroupSelect}
          transformMode={transformMode}
          setTransformMode={setTransformMode}
          currentRoom={currentRoom}
        />
      </Canvas>
      
      <div className="hint-text">
        拖拽设备移动位置 | G: 移动 | R: 旋转 | S: 缩放 | ESC: 取消选择 | 滚轮缩放视角 | 右键拖动旋转
      </div>
    </>
  );
}

export default Scene3D;
