import { createTodo } from '@/api/todo/createTodo';
import { ScrollTodosQueryKey, TodosResponse } from '@/api/todo/getScrollTodos';
import { TodosQueryKey } from '@/api/todo/getTodos';
import { NewTodo, Todo } from '@/models/todo';
import { 
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
  InfiniteData
} from '@tanstack/react-query';

export type CreateTodoVariables = {
  payload: NewTodo;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
}

type UseCreateTodoReturn = {
  createTodo: UseMutateAsyncFunction<void | Todo, Error, CreateTodoVariables>
  isCreating: boolean
  error: Error | null
}

type MutationContext = {
  previousData: InfiniteData<TodosResponse> | undefined
}

export const useCreateTodo =  (): UseCreateTodoReturn => {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation<
    void | Todo,
    Error,
    CreateTodoVariables,
    MutationContext
    >({
      mutationFn: createTodo,
      onMutate: async ({ payload, queryKey }) => {
        await queryClient.cancelQueries({ queryKey })
  
        const previousData = queryClient.getQueryData<InfiniteData<TodosResponse>>(queryKey)
        if(previousData) {
          const updatedData = {
            ...previousData,
            pages: previousData.pages.map((page) => ({
              ...page,
              todos: [payload, ...page.todos],
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
    })

  return {
    createTodo: createTodoMutation.mutateAsync,
    isCreating: createTodoMutation.isPending,
    error: createTodoMutation.error
  }
}
