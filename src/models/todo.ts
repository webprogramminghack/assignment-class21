export type Todo = {
  id: string
  title: string
  completed: boolean
  date: Date
}

export type NewTodo = Omit<Todo, 'id' | 'date'>