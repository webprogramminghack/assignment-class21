import React, { useState } from 'react';
import styles from './App.module.scss';
import IconTrash from './assets/svg/icon-trash.svg';

const App: React.FC = () => {
  const [ todos, setTodos ] = useState([
    {
      "id": "cdd88e27-fd0e-4f63-9e44-fb4bb866072e",
      "title": "Buy groceries",
      "completed": false,
      "date": "2023-10-01T00:00:00.000Z"
    },
    {
      "id": "ed48265e-2044-49e9-a429-b85d73b66c76",
      "title": "Walk the dog",
      "completed": true,
      "date": "2023-10-02T00:00:00.000Z"
    }
  ]);

  const [ inputNewTodo, setInputNewTodo ] = useState('');

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
            value={inputNewTodo}
            onChange={(e) => setInputNewTodo(e.target.value)}
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
          {
            todos.map(todo => (
              <li
                key={todo.id}
                className={styles.list}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  // onClick={(e) => setTodos([ ...todos, ])}
                />
                <p>{todo.title}</p>
                <IconTrash />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default App;
