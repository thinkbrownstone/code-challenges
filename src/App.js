import React from 'react';
import { FareForm } from './form';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from './index.module.css';

// Decided to use individual components to manage each piece of state for code cleanliness
// Utilized controlled components across app to set and present state

function App() {
  const { outerContainer } = styles;
  return (
    // Rendered om a container
    <div className={outerContainer}>
      <FareForm />
    </div>
  );
}

export default App;

// Thank you for taking some of your time to review my code!
