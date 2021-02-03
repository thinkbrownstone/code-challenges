import React from 'react';
import PropTypes from 'prop-types';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from '../index.module.css';

function Result({ result }) {
  const { resultsContainer } = styles;

  return (
    <div className={resultsContainer}>
      {result ? (
        <>
          <h2 style={{ fontSize: '28px', fontWeight: 'normal' }}>
            Your fare will cost
          </h2>
          <h1 style={{ fontSize: '56px' }}>{`$${result}`}</h1>
        </>
      ) : (
        // Assumption that no result is to be displayed until all the inputs are valid
        <h2 style={{ fontSize: '32px', justifySelf: 'center' }}>
          Please select all options
        </h2>
      )}
    </div>
  );
}

Result.propTypes = {
  result: PropTypes.string,
};

export default Result;
