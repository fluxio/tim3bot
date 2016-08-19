import React, { PropTypes } from 'react';

import styles from './list.scss';

console.log('styles:', styles)

function OrderedList({ children }) {
  return (
    <ol className={styles.ordered}>
      {children}
    </ol>
  );
}

OrderedList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

OrderedList.defaultProps = {
  children: [],
};

function UnorderedList({ children }) {
  return (
    <ul className={styles.unordered}>
      {children}
    </ul>
  );
}

UnorderedList.propTypes = OrderedList.propTypes;

UnorderedList.defaultProps = OrderedList.defaultProps;

function ListItem({ children }) {
  return (
    <li className={styles.listItem}>
      <div>
        {children}
      </div>
    </li>
  );
}

ListItem.propTypes = {
  children: PropTypes.node,
};

export {
  OrderedList,
  UnorderedList,
  ListItem,
};
