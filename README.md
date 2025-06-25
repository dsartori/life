# Conway's Game of Life

A JavaScript implementation of Conway's Game of Life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## Features
- Canvas-based simulation with interactive cell editing
- Play/Pause/Step controls for simulation management
- Zoom controls (in/out/reset) with viewport management
- Pattern presets loading system (e.g. glider, pulsar, etc.)
- Responsive design for desktop and mobile
- Grid rendering with live cell visualization

## Project Structure
```
├── index.html          # HTML structure and canvas element
├── style.css           # Styling for UI elements and layout
├── main.js             # UI logic and event handlers
├── life.js             # Core game logic and cell simulation
└── img/                # UI icons and assets
    ├── cell.png        # Cell visualization
    ├── control icons   # Play/Pause/Step/Zoom controls
    └── empty.png       # Background cell visualization
```

## Technical Features
- **Zoom System**: 
  - Implemented with viewport transformation
  - Range: 0.3x to 1.6x scale
  - Dynamic canvas resizing on zoom changes
  - Viewport bounds management

- **Pattern Management**:
  - Preset system with dropdown selection
  - Pattern loading through Grid class methods
  - Confirmation dialog for pattern changes
  - Mobile-friendly touch controls

- **Core Implementation**:
  - Canvas rendering with requestAnimationFrame
  - Grid state management with Set data structure
  - Event-driven UI interactions
  - Responsive layout system

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
