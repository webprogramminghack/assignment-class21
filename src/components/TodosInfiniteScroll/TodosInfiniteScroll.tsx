import { useGetInfiniteTodos } from '@/hooks/todos/useGetInfiniteTodos';
import {
  UpdateTodoVariables,
  useOptimisticUpdateTodo,
} from '@/hooks/todos/useOptimisticUpdateTodo';
import React, { FormEvent, MouseEvent, KeyboardEvent, useState } from 'react';
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
    limit: 7,
  });

  const [newTodoText, setNewTodoText] = useState('');

  // newUpdateTodo
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [selectedTodo, setSelectedTodo] = useState<null | {
    id: string;
    title: string;
    completed: boolean;
    date: string;
  }>(null); // State for the selected todo

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

  const openUpdateDialog = (todo: Todo) => {
    setSelectedTodo(todo); // Set the todo to be edited
    setIsDialogOpen(true); // Open the dialog
  };

  const closeUpdateDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedTodo(null); // Clear the selected todo
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
            payload: todoToUpdate,
            queryKey,
          };

          updateTodo(variables);
        }
      }
    }
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
                        checked={todo.completed} // Checkbox reflects the completed status
                        onChange={() => openUpdateDialog(todo)} // Open dialog on change
                      />
                    </label>
                    <input
                      type='text'
                      defaultValue={todo.title}
                      data-id={todo.id}
                      onKeyDown={handleUpdateTodo}
                    />
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

      {/* Render the UpdateDialog */}
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
