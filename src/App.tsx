import React from 'react';
import styles from './App.module.scss';
import IconTrash from './assets/svg/icon-trash.svg';

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
          <button className={styles.button}>
            <p>Add</p>
          </button>
        </form>
        {/* todo list */}
        <ul className={styles.listContainer}>
          <li className={styles.list}>
            <input type="checkbox" />
            <p>Read a Book</p>
            <IconTrash />
          </li>
          <li className={styles.list}>
            <input type="checkbox" />
            <p>Learn React For 1 Hour</p>
            <IconTrash />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
