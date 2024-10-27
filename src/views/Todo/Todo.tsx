import { FC, FormEvent, MouseEvent, useState } from 'react';
import styles from './Todo.module.scss';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import Delete from '@/assets/svg/icon-trash.svg';
import Icon from '@/assets/svg/icon.svg';
// import { useGetTodos } from '@/hooks/todos/useGetTodos';
import {
  UpdateTodoVariables,
  useUpdateTodo,
} from '@/hooks/todos/useUpdateTodo';
import { useDeleteTodo } from '@/hooks/todos/useDeleteTodo';
import {
  useCreateTodo,
  CreateTodoVariables,
} from '@/hooks/todos/useCreateTodo';
import clsx from 'clsx';
import { useGetInfiniteTodos } from '@/hooks/todos/useGetInfiniteTodos';
import { useIntersectionObserver, useScrollObserver } from '@/hooks/general/useIntersectionObserver';

export const Todo: FC = () => {
  // const { todos, isFetching, queryKey } = useGetTodos({
  //   order: 'desc'
  // })

  const [newTodoText, setNewTodoText] = useState('');

  const [modal, setModal] = useState(false);
  const [updateData, setUpdateData] = useState('');
  const [updatePlaceholder, setUpdatePlaceholder] = useState('');
  const [updateDataId, setUpdateDataId] = useState('');

  const { createTodo, isCreating } = useCreateTodo();
  const { deleteTodo, isDeleting } = useDeleteTodo();
  const { updateTodo, isUpdating } = useUpdateTodo();

  const {
    todos,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    queryKey,
  } = useGetInfiniteTodos({
    order: 'desc',
    limit: 10,
  }, !isCreating || !isUpdating || !isDeleting);

  const { lastElementRef } = useIntersectionObserver<
    HTMLDivElement
  >({
    callback: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });



  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    e.stopPropagation();
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Let’s Get Things Done!</h1>
          <p>One Step Closer to Your Goals</p>
        </div>
        <div className={styles.content}>
          <form onSubmit={onSubmitForm} className={styles.form}>
            <Input
              placeholder='Create New Task'
              onChange={(e) => setNewTodoText(e.target.value)}
              value={newTodoText}
            />
            <Button type='submit' normalWidth>
              Add
            </Button>
          </form>

          <ul className={styles.list}>
            {todos.map((todo) => (
              
              <li
                key={todo.id}
                data-id={todo.id}
                data-title={todo.title}
                onClick={(e) => handleModalUpdateTodo(e)}
                className={styles.listItem}
              >
                <div className={styles.listItemContent}>
                  <div
                    onClick={(e) => handleCompleteTodo(e)}
                    className={clsx(styles.checkbox, {
                      [styles.checked]: todo.completed,
                      [styles.unchecked]: todo.completed === false,
                    })}
                  >
                    <Icon />
                  </div>
                  <p>{todo.title}</p>
                </div>
                <Delete
                  data-id={todo.id}
                  onClick={handleDeleteTodo}
                  className={styles.delete}
                />
              </li>
            ))}
            {isFetchingNextPage && (
              <div key='loading' className={styles.spinnerContainer}>
                <div className={styles.spinner} />
              </div>
            )}
          </ul>
          <div ref={lastElementRef} />
        </div>
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
          <Button type='submit'>save</Button>
        </Modal>
      </form>
    </>
  );
};
