import React from 'react';

const Science: React.FC = () => {
  // Replace with actual research data or logic
  const completedResearch = ['Basic Agriculture', 'Advanced Robotics'];

  return (
    <div>
      <h3>Available Research:</h3>
      <ul>
        <li>Genetic Engineering</li>
        <li>Quantum Computing</li>
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