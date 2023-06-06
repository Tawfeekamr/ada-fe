import React from 'react';

/**
 * Loading component that displays a loading image till while the request being fulfilled.
 */
const Loading = () => {
  return (
    <div className="loading">
      <div>
        <img src="/assets/images/loading.gif" alt="loading" />
      </div>
    </div>
  );
};
export default Loading;
