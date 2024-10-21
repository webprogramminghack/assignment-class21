import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './UpdateDialog.module.scss';
import {
  UpdateTodoVariables,
  useOptimisticUpdateTodo,
} from '@/hooks/todos/useOptimisticUpdateTodo';

// Define the type for props passed to the Alert component
interface UpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  todo: { id: string; title: string; completed: boolean; date: string };
  queryKey: [
    string,
    string,
    {
      completed?: boolean;
      limit?: number;
      sort?: 'title' | 'date';
      order?: 'asc' | 'desc';
    }
  ];
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  isOpen,
  onClose,
  todo,
  queryKey,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);

  // Use the useOptimisticUpdateTodo hook
  const { updateTodo } = useOptimisticUpdateTodo();

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTodo = {
      ...todo, // use the existing todo
      title, // updated title state
      completed, // updated completed state if it exists
    };

    // Prepare the update variables
    const variables: UpdateTodoVariables = {
      payload: updatedTodo, // Send the updated todo object
      queryKey, // Assuming queryKey is available in this component
    };

    // Trigger the update function
    updateTodo(variables);

    onClose(); // Close the dialog after saving
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h3 className={styles.title}>Edit Task</h3>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSave}>
            <input
              type='checkbox'
              checked={completed}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCompleted(e.target.checked)
              }
            />
            <input
              type='text'
              value={title}
              className={styles.input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
            <button type='submit' className={styles.saveButton}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
