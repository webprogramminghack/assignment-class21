import { ScrollTodosQueryKey, TodosResponse } from '@/api/todos/getScrollTodos';
import { TodosQueryKey } from '@/api/todos/getTodos';
import { updateTodo } from '@/api/todos/updateTodo';
import { Todo } from '@/models/todo';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

export type UpdateTodoVariables = {
  payload: Todo;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

type UseUpdateTodoReturn = {
  updateTodo: UseMutateAsyncFunction<void | Todo, Error, UpdateTodoVariables>;
  isUpdating: boolean;
  error: Error | null;
};

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined;
};

export const useOptimisticUpdateTodo = (): UseUpdateTodoReturn => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation<
    void | Todo,
    Error,
    UpdateTodoVariables,
    MutationContext
  >({
    mutationFn: updateTodo,

    onMutate: async ({ payload, queryKey }) => {
      console.log('enter on mutate optimistic updateTodo');
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);

      if (previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            todos: page.todos.map(
              (todo) =>
                todo.id === payload.id
                  ? { ...todo, ...payload } // Update the matching todo with new data
                  : todo // Keep other todos unchanged
            ),
          })),
        };

        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData };
    },

    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(variables.queryKey, context.previousData);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },

    onSuccess: (data, variables) => {
      // Get the current data from the cache

      if (!data) return;

      const previousData = queryClient.getQueryData<
        InfiniteData<TodosResponse>
      >(variables.queryKey);

      if (previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            todos: page.todos.map((todo) =>
              todo.id === data.id
                ? { ...todo, ...data } // Use the data from the server
                : todo
            ),
          })),
        };

        // Update the cached data with the confirmed update
        queryClient.setQueryData(variables.queryKey, updatedData);
      }
    },
  });

  return {
    updateTodo: updateTodoMutation.mutateAsync,
    isUpdating: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
  };
};
