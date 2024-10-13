import React, { useState } from 'react';
import './LeftMenuContainer.css'
import Resources from './ResourceMenu';
import Buildings from './BuildingsMenu';
import Science from './ScienceMenu';

interface ButtonProps {
  label: string;
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
}
//Component for Buttons in the top left menu
const MenuButton: React.FC<ButtonProps> = ({ label, index, isActive, onClick }) => (
  <button
    key={index}
    className={`left-menu-button ${isActive ? 'active' : ''}`}
    onClick={() => onClick(index)}
  >
    {label}
  </button>
);
const LeftMenuContainer: React.FC = () => {
  // State to track the background color of buttons
  const [activeButton, setActiveButton] = useState<number | null>(null);
  // Array of button labels
  const buttonLabels = ['resources', 'buildings', 'science'];

  const renderContent = () => {
    switch (activeButton) {
      case 0:
        return <Resources />;
      case 1:
        return <Buildings />;
      case 2:
        return <Science />;
      default:
        return null;
    }
  };

  return (
    <div className='left-UI-container'>
      <div className='left-top-menu-buttons-container'>
      {buttonLabels.map((label, index) => (
          <MenuButton
            key={index}
            label={label}
            index={index}
            isActive={activeButton === index}
            onClick={setActiveButton}
          />
        ))}
      </div>
      <div className='left-main-info-container'>{renderContent()}</div>
      <div className='left-bottom-info-container'></div>
    </div>
  );
};


export default LeftMenuContainer;