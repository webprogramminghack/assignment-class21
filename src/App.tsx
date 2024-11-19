import React from 'react';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* header */}
      <div className={styles.header}>
        <p className={styles.title}>Let&apos;s Get Things Done!</p>
        <p className={styles.description}>One Step Closer to Your Goal</p>
      </div>
      {/* content todo */}
      <div className={styles.content}>
        {/* todo form */}
        <form className={styles.formContainer}>
          <input
            type="text"
            className={styles.inputTask}
            placeholder='Create new task'
          />
          <button className={styles.button}>Add</button>
        </form>
        {/* todo list */}
        <div>
          <ul>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
