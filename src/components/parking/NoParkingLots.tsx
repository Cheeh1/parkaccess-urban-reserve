
import React from 'react';

const NoParkingLots = () => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-700">No parking lots match your criteria</h3>
      <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different location.</p>
    </div>
  );
};

export default NoParkingLots;
