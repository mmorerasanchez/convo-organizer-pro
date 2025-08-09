
import React from 'react';

import UserProfileControls from './UserProfileControls';

const DesktopHeader: React.FC = () => {
  return (
    <div className="hidden md:block sticky top-0 z-20 border-b bg-white">
      <div className="flex h-14 items-center px-4 sm:px-6">
        <UserProfileControls />
      </div>
    </div>
  );
};

export default DesktopHeader;
