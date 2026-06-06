import React from 'react';

function SceneQuickPanel({ scenes, onActivateScene, activeSceneId, onManageScenes }) {
  if (scenes.length === 0) {
    return null;
  }

  return (
    <div className="scene-quick-panel">
      <div className="scene-quick-header">
        <h4>🎬 快捷场景</h4>
        <button className="btn-icon" onClick={onManageScenes} title="管理场景">
          ⚙️
        </button>
      </div>
      <div className="scene-quick-grid">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            className={`scene-quick-btn ${activeSceneId === scene.id ? 'active' : ''}`}
            style={{ '--scene-color': scene.color }}
            onClick={() => onActivateScene(scene.id)}
            title={scene.description}
          >
            <span className="scene-quick-icon">{scene.icon}</span>
            <span className="scene-quick-name">{scene.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SceneQuickPanel;
