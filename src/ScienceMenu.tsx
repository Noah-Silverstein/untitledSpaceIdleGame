import React from 'react';

const Science: React.FC = () => {
  // Replace with actual research data or logic
  const completedResearch = ['nuclear fusion', 'the wheel'];

  return (
    <div>
      <h3>Available Research:</h3>
      <ul>
        <li>automatic vacuum cleaner</li>
        <li>fidget spinner</li>
      </ul>
      <h3>Completed Research:</h3>
      <ul>
        {completedResearch.map((research, index) => (
          <li key={index}>{research}</li>
        ))}
      </ul>
    </div>
  );
};

export default Science;