import React from 'react';

function SceneQuickPanel({ scenes, onActivateScene, onDeactivateScene, activeSceneId, onManageScenes }) {
  if (scenes.length === 0) {
    return null;
  }

  const activeScene = scenes.find(s => s.id === activeSceneId);

  const handleSceneClick = (scene) => {
    if (activeSceneId === scene.id) {
      onDeactivateScene();
    } else {
      onActivateScene(scene.id);
    }
  };

  return (
    <div className="scene-quick-panel">
      <div className="scene-quick-header">
        <h4>🎬 快捷场景</h4>
        <button className="btn-icon" onClick={onManageScenes} title="管理场景">
          ⚙️
        </button>
      </div>
      {activeScene && (
        <div className="active-scene-banner" style={{ borderColor: activeScene.color }}>
          <div className="active-scene-banner-info">
            <span className="active-scene-banner-icon" style={{ backgroundColor: activeScene.color + '20', color: activeScene.color }}>
              {activeScene.icon}
            </span>
            <div>
              <span className="active-scene-banner-label">正在运行</span>
              <span className="active-scene-banner-name">{activeScene.name}</span>
            </div>
          </div>
          <button 
            className="btn btn-small btn-danger" 
            onClick={onDeactivateScene}
            title="退出场景，恢复设备状态"
          >
            ✕ 退出
          </button>
        </div>
      )}
      <div className="scene-quick-grid">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            className={`scene-quick-btn ${activeSceneId === scene.id ? 'active' : ''}`}
            style={{ '--scene-color': scene.color }}
            onClick={() => handleSceneClick(scene)}
            title={activeSceneId === scene.id ? `点击退出${scene.name}` : scene.description}
          >
            <span className="scene-quick-icon">{scene.icon}</span>
            <span className="scene-quick-name">{scene.name}</span>
            {activeSceneId === scene.id && (
              <span className="scene-active-indicator" style={{ backgroundColor: scene.color }}>●</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SceneQuickPanel;
