import React, { PropTypes } from 'react';

function LayoutView({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

LayoutView.propTypes = {
  children: PropTypes.node,
};

export default LayoutView;
