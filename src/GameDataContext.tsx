
// GameDataContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { GameDataLoader } from './gameDataLoader';

interface GameDataProviderProps {
  children: ReactNode; // Define children as a ReactNode
}
const GameDataContext = createContext<GameDataLoader | null>(null);

export const GameDataProvider: React.FC<GameDataProviderProps> = ({ children }) => {
	const [gameDataLoader, setGameDataLoader] = useState<GameDataLoader | null>(null);

  useEffect(() => {
    const loader = new GameDataLoader();
    setGameDataLoader(loader); // Set the loaded data immediately
	}, []);

  if (!gameDataLoader) return <div>Loading...</div>; // Optionally render a loading indicator

  return (
    <GameDataContext.Provider value={gameDataLoader}>
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (!context) throw new Error('useGameData must be used within a GameDataProvider');
  return context;
};