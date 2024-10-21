import { createTodo } from '@/api/todos/createTodo';
import { ScrollTodosQueryKey, TodosResponse } from '@/api/todos/getScrollTodos';
import { TodosQueryKey } from '@/api/todos/getTodos';
import { NewTodo, Todo } from '@/models/todo';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';

export type CreateTodoVariables = {
  payload: NewTodo;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

type UseCreateTodoReturn = {
  createTodo: UseMutateAsyncFunction<void | Todo, Error, CreateTodoVariables>;
  isCreating: boolean;
  error: Error | null;
};

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined;
};

export const useOptimisticCreateTodo = (): UseCreateTodoReturn => {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation<
    void | Todo,
    Error,
    CreateTodoVariables,
    MutationContext
  >({
    mutationFn: createTodo,

    onMutate: async ({ payload, queryKey }) => {
      console.log('enter on mutate optimistic createTodo');
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey);

      if (previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  todos: [{ id: 'temp-id', ...payload }, ...page.todos],
                }
              : page
          ),
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
    createTodo: createTodoMutation.mutateAsync,
    isCreating: createTodoMutation.isPending,
    error: createTodoMutation.error,
  };
};
