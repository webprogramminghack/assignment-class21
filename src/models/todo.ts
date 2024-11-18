export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
};

export type NewTodo = Pick<Todo, 'title' | 'completed'>;
