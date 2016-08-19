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
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

Card.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
