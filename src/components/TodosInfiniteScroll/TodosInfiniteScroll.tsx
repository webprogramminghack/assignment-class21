import { useGetInfiniteTodos } from '@/hooks/todos/useGetInfiniteTodos';
import React, { FormEvent, MouseEvent, ChangeEvent, useState } from 'react';
import TrashIcon from '@/assets/svg/icon-trash.svg';
import styles from './TodosInfiniteScroll.module.scss';
import { useIntersectionObserver } from '@/hooks/general/useIntersectionObserver';
import { useOptimisticDeleteInfiniteTodo } from '@/hooks/todos/useDeleteInfinteTodo';
import { MoonLoader } from 'react-spinners';
import { Todo } from '@/models/todo';
import { UpdateDialog } from '../UpdateDialog';
import {
  CreateTodoVariables,
  useOptimisticCreateTodo,
} from '@/hooks/todos/useOptimisticCreateTodo';
import {
  UpdateTodoVariables,
  useOptimisticUpdateTodo,
} from '@/hooks/todos/useOptimisticUpdateTodo';

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<null | {
    id: string;
    title: string;
    completed: boolean;
    date: string;
  }>(null);

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

  const toggleTodoCompletion = (todoChecked: boolean, todoId: string) => {
    const updatedTodo = todos.find((todo) => todo.id === todoId);

    if (!updatedTodo) return;

    const variables: UpdateTodoVariables = {
      payload: { ...updatedTodo, completed: todoChecked }, // Hanya kirim satu todo
      queryKey,
    };

    updateTodo(variables);
  };

  const openUpdateDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsDialogOpen(false);
    setSelectedTodo(null);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.titleHeader}>
        <h2 className={styles.title}>Let’s Get Things Done!</h2>
        <p className={styles.description}>One Step Closer to Your Goal</p>
      </div>
      <div className={styles.containerForm}>
        <form onSubmit={onSubmitForm}>
          <div className={styles.inputWrapper}>
            <input
              type='text'
              value={newTodoText}
              className={styles.newTodoInput}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <button className={styles.addButton}>Add</button>
          </div>
        </form>
        <div className={styles.todoContainer}>
          <div className={styles.listContainer}>
            <ul className={styles.todos} ref={containerRef}>
              {isCreating && <li>Adding a new todo...</li>}
              {todos.map((todo, index) => (
                <li
                  key={todo.id}
                  ref={index === todos.length - 1 ? lastElementRef : null}
                >
                  <div className={styles.frameInput}>
                    <label className={styles.checkCompleted}>
                      <input
                        type='checkbox'
                        checked={todo.completed}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          toggleTodoCompletion(e.target.checked, todo.id)
                        }
                      />
                    </label>
                    <span
                      className={`${styles.todoText} ${
                        todo.completed ? styles.completedText : ''
                      }`}
                      onClick={() => openUpdateDialog(todo)}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <TrashIcon
                    className={styles.deleteIcon}
                    data-id={todo.id}
                    onClick={handleDeleteTodo}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className={styles.spinner}>
            <MoonLoader color='#8e44ad' size={25} />
          </div>
        )}
        {error && <p>Error loading todos: {error.message}</p>}

        {isFetchingNextPage && (
          <div className={styles.spinner}>
            <MoonLoader color='#8e44ad' size={25} />
          </div>
        )}
      </div>

      {selectedTodo && (
        <UpdateDialog
          isOpen={isDialogOpen}
          onClose={closeUpdateDialog}
          todo={selectedTodo}
          queryKey={queryKey}
        />
      )}
    </div>
  );
};
