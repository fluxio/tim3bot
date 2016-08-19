import React, { PropTypes } from 'react';

import styles from './layout-view.scss';

import Navbar from '../navbar';

function LayoutView({ isLoggedIn, children }) {
  return (
    <div className={styles.container}>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

LayoutView.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

LayoutView.defaultProps = {
  isLoggedIn: false,
};

export default LayoutView;
