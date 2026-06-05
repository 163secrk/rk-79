# 3D智能家居控制系统

一个基于 Three.js 的 3D 智能家居控制系统，支持在网页上渲染房间场景，并可以拖拽摆放灯具、空调等设备模型。

## 功能特性

- 🏠 **3D 房间场景** - 使用 Three.js 渲染真实的客厅场景
- 🎯 **拖拽摆放** - 支持拖拽移动、旋转、缩放设备
- 💡 **多种设备** - 吸顶灯、台灯、空调、电视、音箱、摄像头等 6 种设备
- 🎛️ **设备控制** - 开关、亮度、颜色、温度、模式等参数调节
- 💾 **数据持久化** - 设备布局和状态自动保存到后端
- 🎮 **便捷操作** - 键盘快捷键支持（G移动/R旋转/S缩放/ESC取消）

## 技术栈

### 前端
- React 18
- Three.js + @react-three/fiber + @react-three/drei
- Axios
- 端口: 3079

### 后端
- Node.js + Express
- CORS 支持
- 文件系统存储 (JSON)
- 端口: 8079

## 快速开始

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装所有依赖（包含前后端）
npm run install:all
```

### 启动服务

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:backend  # 后端端口 8079
npm run dev:frontend # 前端端口 3079
```

### 访问应用

打开浏览器访问: http://localhost:3079

## 操作说明

### 鼠标操作
- **左键点击** - 选择设备
- **左键拖拽** - 移动已选中的设备
- **右键拖拽** - 旋转视角
- **滚轮** - 缩放视角
- **悬停** - 高亮显示设备

### 键盘快捷键
- `G` - 切换到移动模式
- `R` - 切换到旋转模式
- `S` - 切换到缩放模式
- `ESC` - 取消选择

### 设备操作
1. 从左侧设备库点击添加新设备
2. 在 3D 场景中点击选中设备
3. 使用 Transform Controls 拖拽调整位置
4. 在右侧控制面板调节设备参数
5. 点击顶部"保存布局"保存更改

## 设备类型

| 设备 | 图标 | 可调节参数 |
|------|------|------------|
| 吸顶灯 | 💡 | 开关、亮度、颜色 |
| 台灯 | 🪔 | 开关、亮度、颜色 |
| 空调 | ❄️ | 开关、温度、模式 |
| 电视 | 📺 | 开关、音量、频道 |
| 音箱 | 🔊 | 开关、音量 |
| 摄像头 | 📷 | 开关、录像 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/devices` | 获取所有设备 |
| POST | `/api/devices` | 保存所有设备 |
| PUT | `/api/devices/:id` | 更新设备信息 |
| PUT | `/api/devices/:id/state` | 更新设备状态 |
| POST | `/api/devices/:id` | 创建设备 |
| DELETE | `/api/devices/:id` | 删除设备 |
| GET | `/api/health` | 健康检查 |

## 项目结构

```
rk-79/
├── backend/              # 后端服务
│   ├── data/
│   │   └── devices.json  # 设备数据存储
│   ├── server.js         # Express 服务器
│   └── package.json
├── frontend/             # 前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/   # React 组件
│   │   │   ├── Scene3D.js       # 3D场景
│   │   │   ├── Room.js          # 房间模型
│   │   │   ├── DeviceModel.js   # 设备模型
│   │   │   ├── DeviceLibrary.js # 设备库
│   │   │   └── ControlPanel.js  # 控制面板
│   │   ├── services/
│   │   │   └── api.js           # API 服务
│   │   ├── App.js               # 主应用
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   └── package.json
├── package.json          # 根目录配置
└── README.md
```

## 许可证

MIT
