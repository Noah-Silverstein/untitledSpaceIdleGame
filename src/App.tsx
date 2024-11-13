// App.tsx
import { useEffect, useState } from 'react';
import LeftMenuContainer from './LeftMenuContainer';
import styles from './App.module.css'
import HoverMenu from './HoverMenu';
import { AstronomicalBody } from './astronomicalClasses/baseAstronomicalClasses';
import FPSMonitor from './FPSMonitor';
import ThreeJSCanvasNew from './ThreeJSCanvasNew';
import { GameDataProvider } from './GameDataContext'; // Import the context provider

function App() {
  const [selectedBody, setSelectedBody] = useState<AstronomicalBody | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: string; left: string }>({ top: '10px', left: '10px' });

  useEffect(() => {
    
  }, [/**dependencies, useEffect will only run when on of these updates */]);

  

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
    <GameDataProvider>
      <div className={styles.app}>
        <LeftMenuContainer  />
        <ThreeJSCanvasNew DEVMODE ={true} onMeshSelect={handleMeshSelect} onBackgroundSelect={handleCloseMenu} /> 
        <HoverMenu
          visible={selectedBody !== null}
          content={selectedBody}
          position={menuPosition}
        />
        {/*FPS Monitor */}
        <FPSMonitor />
      </div>
    </GameDataProvider>
  );
}

export default App;