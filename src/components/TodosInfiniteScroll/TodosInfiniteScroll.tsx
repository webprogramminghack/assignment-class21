import TrashIcon from '@/assets/svg/icon-trash.svg';
import Icon from '@/assets/svg/icon.svg';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
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
import clsx from 'clsx';
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

  const [modal, setModal] = useState(false);
  const [updateData, setUpdateData] = useState('');
  const [updatePlaceholder, setUpdatePlaceholder] = useState('');
  const [updateDataId, setUpdateDataId] = useState('');

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

  const handleModalUpdateTodo = (e: MouseEvent<HTMLLIElement>) => {
    const id = e.currentTarget.dataset.id;
    const title = e.currentTarget.dataset.title;
    if (id && title) {
      setUpdateDataId(id);
      setUpdatePlaceholder(title);
      setUpdateData(title);
      setModal(true);
    }
  };

  const onSubmitUpdateForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateData !== updatePlaceholder) {
      const data = todos.find((todo) => todo.id === updateDataId);
      if (data) {
        const variables: UpdateTodoVariables = {
          payload: { ...data, title: updateData },
          queryKey,
        };
        updateTodo(variables);
      }
    }
    setModal(false);
  };

  const handleCompleteTodo = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const id = e.currentTarget.parentElement?.parentElement?.dataset.id;
    if (id) {
      const data = todos.find((todo) => todo.id === id);
      if (data) {
        const variables: UpdateTodoVariables = {
          payload: { ...data, completed: !data.completed },
          queryKey,
        };
        updateTodo(variables);
      }
    }
  };

  const handleUpdateTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const newValue = input.value.trim();
      const todoId = input.id;
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

  return (
    <>
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
              data-id={todo.id}
              data-title={todo.title}
              onClick={(e) => handleModalUpdateTodo(e)}
              className={styles.listItem}
            >
              <div className={styles.listCheckWrapper}>
                <div
                  onClick={(e) => handleCompleteTodo(e)}
                  type='checkbox'
                  className={clsx(styles.checkbox, {
                    [styles.checked]: todo.completed,
                    [styles.unchecked]: todo.completed === false,
                  })}
                >
                  <Icon />
                </div>
                <p className={clsx({ [styles.strikethrough]: todo.completed })}>
                  {todo.title}
                </p>
              </div>
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
      <form onSubmit={onSubmitUpdateForm}>
        <Modal
          title='Edit Task'
          isActive={modal}
          onClose={() => setModal(false)}
        >
          <Input
            placeholder={updatePlaceholder}
            value={updateData}
            onChange={(e) => setUpdateData(e.target.value)}
          />
          <Button type='submit'>Save</Button>
        </Modal>
      </form>
    </>
  );
};

// <input
//               type='text'
//               defaultValue={todo.title}
//               data-id={todo.id}
//               onKeyDown={handleUpdateTodo}/>
