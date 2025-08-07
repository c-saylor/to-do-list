import { Todo } from '../types/todo';

const STORAGE_KEY = 'todo-list';

export const loadTodos = (): Todo[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
  
    try {
      const todos = JSON.parse(data) as Todo[];
      return todos.map(todo => ({
        ...todo,
        id: String(todo.id), // enforce consistent ID type
      }));
    } catch {
      return [];
    }
  };

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};