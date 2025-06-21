
import React from 'react';

const BreakingNewsBar = () => {
  return (
    <div className="bg-gray-100 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="text-sm text-gray-600">
            Breaking: Latest updates from the Middle East
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBar;
