import { deleteTodo } from '@/api/todo/deleteTodo';
import { Todo } from '@/models/todo';
import { TodosQueryKey } from '@/api/todo/getTodos';
import {
  useMutation,
  useQueryClient,
  UseMutateAsyncFunction,
  InfiniteData
} from '@tanstack/react-query';
import { ScrollTodosQueryKey, TodosResponse } from '@/api/todo/getScrollTodos';

export type DeleteTodoVariables = {
  id: string;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

type useDeleteTodoReturn = {
  deleteTodo: UseMutateAsyncFunction<void | Todo, Error, DeleteTodoVariables>;
  isDeleting: boolean;
  error: Error | null;
};

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined
}

export const useDeleteTodo = (): useDeleteTodoReturn => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation<
    void | Todo,
    Error,
    DeleteTodoVariables,
    MutationContext
  >({
    mutationFn: deleteTodo,
    onMutate: async ({ id, queryKey }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey)
      if(previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            todos: page.todos.filter((todo) => todo.id !== id),
          })),
        }
        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData }
    },

    onError: (_error, variables, context) => {
      if(context?.previousData) {
        queryClient.setQueryData(variables.queryKey, context.previousData)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey })
    }
  });

  return {
    deleteTodo: deleteTodoMutation.mutateAsync,
    isDeleting: deleteTodoMutation.isPending,
    error: deleteTodoMutation.error,
  }
};
 
