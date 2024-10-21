import { ScrollTodosQueryKey, TodosResponse } from '@/api/todos/getScrollTodos';
import { TodosQueryKey } from '@/api/todos/getTodos';
import { updateTodo } from '@/api/todos/updateTodo';
import { Todo } from '@/models/todo';
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

export type UpdateTodoVariables = {
  payload: Todo;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined;
};

export const useOptimisticUpdateTodo = () => {
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
  });

  return {
    updateTodo: updateTodoMutation.mutateAsync,
    isDeleting: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
  };
};
