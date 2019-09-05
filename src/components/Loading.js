import React from 'react';
// import ProgressBar from '@salesforce/design-system-react/components/progress-bar';

const Loading = ({ isBusy }) => {
  return (
    <div class="slds-text-link_reset" active={isBusy} inverted>
      <div inverted content="Loading..." />
    </div>
  );
};

export default Loading;
