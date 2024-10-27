import {
  getScrollTodos,
  ScrollTodosQueryKey
} from '@/api/todo/getScrollTodos';
import { useInfiniteQuery } from '@tanstack/react-query'

export type UseGetInfiniteTodosParams = {
  completed?: boolean
  limit?: number
  sort?: 'title' | 'date'
  order?: 'asc' | 'desc'
}

export const useGetInfiniteTodos = ({
  completed,
  limit = 10,
  sort = 'date',
  order = 'asc',
}: UseGetInfiniteTodosParams, enabled?: boolean ) => {
  const queryKey: ScrollTodosQueryKey = [
    'todos',
    'scroll',
    { completed, limit, sort, order },
  ]

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey,
    queryFn: getScrollTodos,
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const todos = data?.pages.flatMap((page) => page.todos) ?? []

  return {
    todos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    queryKey,
    error
  }
}