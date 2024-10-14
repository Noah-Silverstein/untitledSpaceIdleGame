import React from 'react';

const Buildings: React.FC = () => {
  // You can replace this with actual data or logic
  const buildings = ['House', 'Farm', 'Research Lab'];

  return (
    <div>
      <h3>Built Structures:</h3>
      <ul>
        {buildings.map((building, index) => (
          <li key={index}>{building}</li>
        ))}
      </ul>
    </div>
  );
};

export default Buildings;