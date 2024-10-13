import React, { useEffect, useState } from 'react';

const Resources: React.FC = () => {
    const [resources, setResources] = useState(0);
  
    // Function to simulate resource gathering
    const gatherResources = () => {
      setResources(prev => prev + Math.floor(Math.random() * 10));
    };
  
    useEffect(() => {
      const intervalId = setInterval(gatherResources, 2000); // Update every 2 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);
  
    return (
      <div>
        Total Resources Gathered: {resources}
      </div>
    );
  };
  
  export default Resources;