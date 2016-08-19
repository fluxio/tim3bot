import React, { PropTypes } from 'react';

import { LOGOUT_PATH } from '../../lib/constants/paths';

import styles from './navbar.scss';

function Navbar({ isLoggedIn }) {
  return isLoggedIn ? (
    <div className={styles.navbar}>
      <div className={styles.brand}>FLUX TIM3BOT</div>
      <a
        href={LOGOUT_PATH}
        className={styles.navbarLink}
      >
        Logout
      </a>
    </div>
  ) : (
    <div className={styles.navbar}>
      <div className={styles.brand}>FLUX TIM3BOT</div>
      <div style={{ width: '100%' }}>
        A productivity tool to clarify your top priorities for the week, and keep your team up to date
        about your progress.
      </div>
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
