import { api } from "./client";
import type {
  CreateTodoRequest,
  PaginatedResponse,
  Todo,
  UpdateTodoRequest,
} from "../types/todo";

export interface TodoQueryParams {
  page?: number;
  status?: string;
  priority?: number;
  search?: string;
  ordering?: string;
}

export const getTodos = async (
  params?: TodoQueryParams,
): Promise<PaginatedResponse<Todo>> => {
  const response = await api.get<PaginatedResponse<Todo>>(
    "/todos/",
    { params },
  );

  return response.data;
};

export const getTodo = async (
  id: string,
): Promise<Todo> => {
  const response = await api.get<Todo>(`/todos/${id}/`);
  return response.data;
};

export const createTodo = async (
  data: CreateTodoRequest,
): Promise<Todo> => {
  const response = await api.post<Todo>("/todos/", data);
  return response.data;
};

export const updateTodo = async (
  id: string,
  data: UpdateTodoRequest,
): Promise<Todo> => {
  const response = await api.patch<Todo>(
    `/todos/${id}/`,
    data,
  );

  return response.data;
};

export const deleteTodo = async (
  id: string,
): Promise<void> => {
  await api.delete(`/todos/${id}/`);
};
