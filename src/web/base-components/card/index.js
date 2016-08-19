import React, { PropTypes } from 'react';

import styles from './card.scss';

function Card({ label, children }) {
  return (
    <div className={styles.card}>
      {label ? (
        <div className={styles.label}>
          {label}
        </div>
      ) : null}
      {children ? (
        <div className={styles.content}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

Card.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
};

export default Card;
