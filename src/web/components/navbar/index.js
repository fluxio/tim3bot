import React, { PropTypes } from 'react';

import { LOGOUT_PATH } from '../../lib/constants/paths';

import styles from './navbar.scss';

function Navbar({ isLoggedIn }) {
  return (
    <div className={styles.navbar}>
      <div className={styles.brand}>TIM3BOT</div>
      {isLoggedIn ? (
        <a
          href={LOGOUT_PATH}
          className={styles.navbarLink}
        >
          Logout
        </a>
      ) : null}
    </div>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

Navbar.defaultProps = {
  isLoggedIn: false,
};

export default Navbar;
