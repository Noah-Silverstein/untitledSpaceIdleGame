import React from 'react';
import styles from './HoverMenu.module.css';
import { AstronomicalBody } from './astronomicalClasses/baseAstronomicalClasses';
import { Star } from './astronomicalClasses/stars/stars';
import { Planet } from './astronomicalClasses/planets/planet';

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
          
          {content instanceof Planet && (
            <>
                <div>mass: {content.earthMass.toFixed(2)}</div>
                <div>radius: {content.earthRadius.toFixed(2)}</div>
                <div>effLumin: {content.effLumin.toFixed(2)}</div>
                <div>effTemp: {(content.effTemp - 273.15).toFixed(2)}</div>
                <div>orbital distance: {content.orbitalDistance.toFixed(2)}</div> 
                <div>orbital period: {content.orbitalPeriod.toFixed(2)}</div> 
                <div>albedo: {content.albedo.toFixed(2)}</div> 
                <div>epsilon: {content.epsilon.toFixed(2)}</div>


            </>
            )}
            {content instanceof Star && (
            <>  
                <div>mass: {content.solarMass.toFixed(2)}</div>
                <div>radius: {content.solarRadius.toFixed(2)}</div>
                <div>temperature: {content.surfaceTemp.toFixed(2)}</div>
                <div>silica line: {content.silicateLine.toFixed(2)}</div>
                <div>frost line: {content.frostLine.toFixed(2)}</div>
                <div>luminosity: {content.luminosity.toFixed(2)}</div>
                <div>spectral type: {content.spectralType}</div> 
                <div>peak wavelength: {content.wavelengthPeak.toFixed(2)}</div> 

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