import styles from '@/app.module.scss';
import { TodosInfiniteScroll } from '@/components/TodosInfiniteScroll';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className={styles.main}>
      <h1>Let’s Get Things Done!</h1>
      <h2>One Step Closer to Your Goals</h2>
      <TodosInfiniteScroll />
    </div>
  );
};

export default App;
