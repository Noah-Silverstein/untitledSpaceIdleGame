import React from 'react';
import styles from './HoverMenu.module.css';
import { AstronomicalBody } from './astronomicalClasses/planetarySystemUtils';
import { Planet } from './astronomicalClasses/plannetClasses';

interface HoverMenuProps {
  visible: boolean;
  content: AstronomicalBody | null;
  position: { top: string; left: string };
}

const HoverMenu: React.FC<HoverMenuProps> = ({ visible, content, position }) => {
  return (
    <div
      className={styles.hoverMenu}
      style={{
        display: visible ? 'block' : 'none',
        top: position.top,
        left: position.left,
      }}
    >
      {content ? ( // Check if content is not null
        <>
          <div>{content.name}</div>
          <div>mass: {content.mass}</div>
          <div>radius: {content.radius}</div>
          {content instanceof Planet && (
            <>
                <div>temperature: {content.temperature}</div>
                <div>orbital distance: {content.orbitalDistance}</div> 
                <div>orbital period: {content.orbitalPeriod}</div> 

            </>
            )}
        </>
      ) : (
        <div>No content</div>
      )}

    </div>
  );
};

export default HoverMenu;