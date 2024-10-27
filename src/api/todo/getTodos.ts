import { AxiosRequestConfig } from "axios";
import { QueryFunction } from '@tanstack/react-query';
import { Todo } from '@/models/todo';
import { customAxios } from "@/api";

export type TodosQueryKey = [
  path: string,
  {
    completed?: boolean;
    page?: number;
    limit?: number;
    sort: 'title' | 'date';
    order: 'asc' | 'desc';
  }
];

type TodosResponse = {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export const getTodos: QueryFunction<TodosResponse, TodosQueryKey> = async ({
  queryKey
}) => {
  const [
    path,
    { completed = false , page = 1, limit = 10, sort = 'date', order = 'asc'}
  ] = queryKey;

  const apiPath = `/${path}`;

  const axiosRequestConfig: AxiosRequestConfig = {
    params: { completed, page, limit, sort, order }
  }

  const response = await customAxios.get<TodosResponse>(apiPath, axiosRequestConfig);

  return response.data
}