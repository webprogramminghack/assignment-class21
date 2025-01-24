import TrashIcon from '@/assets/svg/icon-trash.svg';

import { useIntersectionObserver } from '@/hooks/general/useIntersectionObserver';
import {
  CreateTodoVariables,
  useOptimisticCreateTodo,
} from '@/hooks/todos/useCreateTodo';
import { useOptimisticDeleteInfiniteTodo } from '@/hooks/todos/useDeleteInfinteTodo';
import { useGetInfiniteTodos } from '@/hooks/todos/useGetInfiniteTodos';
import {
  UpdateTodoVariables,
  useOptimisticUpdateTodo,
} from '@/hooks/todos/useUpdateTodo';
import React, { FormEvent, KeyboardEvent, MouseEvent, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import styles from './TodosInfiniteScroll.module.scss';

export const TodosInfiniteScroll: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    queryKey,
  } = useGetInfiniteTodos({
    order: 'desc',
    limit: 10,
  });

  const [newTodoText, setNewTodoText] = useState('');
  const [openDialogUpdate, setDialogUpdate] = useState(false);

  const { createTodo, isCreating } = useOptimisticCreateTodo();
  const { deleteTodo } = useOptimisticDeleteInfiniteTodo();
  const { updateTodo } = useOptimisticUpdateTodo();

  const { containerRef, lastElementRef } = useIntersectionObserver<
    HTMLLIElement,
    HTMLUListElement
  >({
    callback: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const variables: CreateTodoVariables = {
      payload: { title: newTodoText, completed: false },
      queryKey,
    };

    if (newTodoText.trim()) {
      createTodo(variables);
      setNewTodoText('');
    }
  };

  const handleDeleteTodo = (e: MouseEvent<SVGElement>) => {
    const id = e.currentTarget.dataset.id;

    if (id) {
      deleteTodo({ id, queryKey });
    }
  };

  const handleUpdateTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const newValue = input.value.trim();
      const todoId = input.dataset.id;
      if (todoId && newValue) {
        const todoToUpdate = todos.find((todo) => todo.id === todoId);

        if (todoToUpdate) {
          const variables: UpdateTodoVariables = {
            payload: { ...todoToUpdate, title: newValue },
            queryKey,
          };

          updateTodo(variables);
        }
      }
    }
  };

  const handleDialogUpdate = () => setDialogUpdate(!openDialogUpdate);

  return (
    <div className={styles.todoContainer}>
      <form onSubmit={onSubmitForm}>
        <input
          type='text'
          placeholder='Create New Task'
          value={newTodoText}
          className={styles.newTodoInput}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <button color='primary'>Add</button>
      </form>
      <ul className={styles.todos} ref={containerRef}>
        {isCreating && <li>Adding a new todo...</li>}
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            ref={index === todos.length - 1 ? lastElementRef : null}
          >
            <div className={styles.listCheckWrapper}>
              <input type='checkbox' className={styles.checkBox} id={todo.id} />

              <p onClick={handleDialogUpdate} data-id={todo.id}>
                {todo.title}
              </p>
            </div>
            {openDialogUpdate && (
              <div className='dialogContainer'>
                <input
                  type='text'
                  defaultValue={todo.title}
                  data-id={todo.id}
                  onKeyDown={handleUpdateTodo}
                />
              </div>
            )}
            <TrashIcon
              className={styles.deleteIcon}
              data-id={todo.id}
              onClick={handleDeleteTodo}
            />
          </li>
        ))}
      </ul>

      {isLoading && <p>Loading todos...</p>}
      {error && <p>Error loading todos: {error.message}</p>}
      {isFetchingNextPage && (
        <div className={styles.spinners}>
          <MoonLoader color='#8e44ad' size={25} />
        </div>
      )}
    </div>
  );
};

// <input
//               type='text'
//               defaultValue={todo.title}
//               data-id={todo.id}
//               onKeyDown={handleUpdateTodo}/>
