#!/usr/bin/env bash

# Project root directory
PROJECT_ROOT="./"

# Create the main structure
mkdir -p $PROJECT_ROOT/public/assets
mkdir -p $PROJECT_ROOT/src/domain
mkdir -p $PROJECT_ROOT/src/controllers
mkdir -p $PROJECT_ROOT/src/components
mkdir -p $PROJECT_ROOT/src/services/persistence
mkdir -p $PROJECT_ROOT/src/services/simulation
mkdir -p $PROJECT_ROOT/src/services/rlIntegration
mkdir -p $PROJECT_ROOT/src/utils

# Create files in public
cat <<EOF > $PROJECT_ROOT/public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Floor Plan Editor</title>
<link rel="stylesheet" href="styles.css"/>
</head>
<body>
<div id="root"></div>
<script type="module" src="../src/index.js"></script>
</body>
</html>
EOF

touch $PROJECT_ROOT/public/styles.css

# domain
touch $PROJECT_ROOT/src/domain/FloorPlan.js
touch $PROJECT_ROOT/src/domain/Cell.js
touch $PROJECT_ROOT/src/domain/Room.js
touch $PROJECT_ROOT/src/domain/Appliance.js
touch $PROJECT_ROOT/src/domain/Constraints.js
cat <<EOF > $PROJECT_ROOT/src/domain/index.js
export * from './FloorPlan.js';
export * from './Cell.js';
export * from './Room.js';
export * from './Appliance.js';
export * from './Constraints.js';
EOF

# controllers
touch $PROJECT_ROOT/src/controllers/InputController.js
touch $PROJECT_ROOT/src/controllers/ToolState.js
cat <<EOF > $PROJECT_ROOT/src/controllers/index.js
export * from './InputController.js';
export * from './ToolState.js';
EOF

# components
touch $PROJECT_ROOT/src/components/FloorPlanCanvas.js
touch $PROJECT_ROOT/src/components/Toolbar.js
touch $PROJECT_ROOT/src/components/RoomAssignmentMenu.js
cat <<EOF > $PROJECT_ROOT/src/components/index.js
export * from './FloorPlanCanvas.js';
export * from './Toolbar.js';
export * from './RoomAssignmentMenu.js';
EOF

# services/persistence
touch $PROJECT_ROOT/src/services/persistence/floorPlanStorage.js
touch $PROJECT_ROOT/src/services/persistence/config.js
cat <<EOF > $PROJECT_ROOT/src/services/persistence/index.js
export * from './floorPlanStorage.js';
export * from './config.js';
EOF

# services/simulation
touch $PROJECT_ROOT/src/services/simulation/occupantSimulation.js
touch $PROJECT_ROOT/src/services/simulation/pathfinding.js
cat <<EOF > $PROJECT_ROOT/src/services/simulation/index.js
export * from './occupantSimulation.js';
export * from './pathfinding.js';
EOF

# services/rlIntegration
touch $PROJECT_ROOT/src/services/rlIntegration/rlServiceAdapter.js
cat <<EOF > $PROJECT_ROOT/src/services/rlIntegration/index.js
export * from './rlServiceAdapter.js';
EOF

# services index
cat <<EOF > $PROJECT_ROOT/src/services/index.js
export * from './persistence/index.js';
export * from './simulation/index.js';
export * from './rlIntegration/index.js';
EOF

# utils
touch $PROJECT_ROOT/src/utils/geometry.js
touch $PROJECT_ROOT/src/utils/events.js
cat <<EOF > $PROJECT_ROOT/src/utils/index.js
export * from './geometry.js';
export * from './events.js';
EOF

# app and main entry
touch $PROJECT_ROOT/src/app.js
cat <<EOF > $PROJECT_ROOT/src/index.js
import './app.js'; // Initialize and run the application
EOF

# package.json placeholder
cat <<EOF > $PROJECT_ROOT/package.json
{
  "name": "floorplan-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {},
  "devDependencies": {
    "vite": "^4.0.0"
  }
}
EOF

# README
cat <<EOF > $PROJECT_ROOT/README.md
# Floor Plan Editor

This project sets up a modular architecture for a floor plan editing app.
EOF

echo "Project structure created successfully!"
