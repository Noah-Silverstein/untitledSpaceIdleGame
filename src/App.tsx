// App.tsx
import { useState } from 'react';
import ThreeJSCanvas from './ThreeJSCanvas';
import LeftMenuContainer from './LeftMenuContainer';
import styles from './App.module.css'
import HoverMenu from './HoverMenu';
import { AstronomicalBody } from './astronomicalClasses/planetarySystemUtils';
import FPSMonitor from './FPSMonitor';
function App() {
  const [selectedBody, setSelectedBody] = useState<AstronomicalBody | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: string; left: string }>({ top: '10px', left: '10px' });

  const handleMeshSelect = (slctBody: AstronomicalBody | null) => {
    setSelectedBody(slctBody);
    // Optionally update the menu's position based on where the click happened
    // This is a basic example to show at a fixed position, but can be customized
    setMenuPosition({ top: '10px', left: '80%' });
  };

  // Function to close the menu
  const handleCloseMenu = () => {
    setSelectedBody(null);
  };


  return (
    <div className={styles.app}>
      <LeftMenuContainer  />
      <ThreeJSCanvas DEVMODE ={true} onMeshSelect={handleMeshSelect} onBackgroundSelect={handleCloseMenu} /> 
      <HoverMenu
        visible={selectedBody !== null}
        content={selectedBody}
        position={menuPosition}
      />
      {/* FPS Monitor */}
      <FPSMonitor />
    </div>
  );
}

export default App;