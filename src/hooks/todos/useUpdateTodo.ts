import { updateTodo } from '@/api/todo/updateTodo';
import { TodosQueryKey } from '@/api/todo/getTodos'; 
import { Todo } from '@/models/todo';
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { ScrollTodosQueryKey, TodosResponse } from '@/api/todo/getScrollTodos';

export type UpdateTodoVariables = {
  payload: Todo
  queryKey: TodosQueryKey | ScrollTodosQueryKey
}

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined
}


export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation<
    void | Todo,
    Error,
    UpdateTodoVariables,
    MutationContext
  >({
    mutationFn: updateTodo,
    onMutate: async ({ payload, queryKey }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey)
      if(previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            todos: page.todos.map((todo) => 
              todo.id === payload.id ? payload : todo
            ),
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
    updateTodo: updateTodoMutation.mutateAsync,
    isUpdating: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
  };
};
